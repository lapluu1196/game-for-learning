from pathlib import Path
from playwright.sync_api import sync_playwright
base=Path(__file__).resolve().parents[1]
html=(base/'index.html').read_text('utf-8')
for js in ('questions.js','logic.js','app.js'):
 html=html.replace(f'<script src="{js}"></script>',f'<script>{(base/js).read_text("utf-8")}</script>')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium')
 for width,height in [(1280,920),(390,844),(320,740)]:
  page=browser.new_page(viewport={'width':width,'height':height})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='load')
  result=page.evaluate('''() => {
    const t=window.__gameTest,bank=window.GameBank.questions;
    let stages=0,exceptions=[];
    for(let i=0;i<52;i++){
      try{
        t.openQuestion(i);
        const q=bank[i],steps=t.derive(q).steps;
        if(document.querySelectorAll('.dot').length !== (i>=50?2:5))throw Error('Round size incorrect '+i);
        if(document.getElementById('roundLabel').textContent!==`Lượt ${Math.floor(i/5)+1} / 11`)throw Error('Round index incorrect '+i);
        if(document.getElementById('scaleBoard').hidden !== (q.kind==='math'))throw Error('Wrong game mode '+i);
        if(q.kind==='math'&&document.querySelectorAll('.number-option').length!==3)throw Error('Choices not 3 '+i);
        for(let j=0;j<steps.length;j++){
          t.state.hintOpen=true;t.state.hintStep=j;
          document.getElementById('hintReplay').click();
          if(!document.querySelector('#hintScene .hint-scene'))throw Error('Missing scene '+i+'/'+j);
          stages++;
        }
        t.state.hintOpen=false;
        if(q.kind==='math'){
          document.querySelector(`[data-option="${q.answer}"]`).click();
          document.getElementById('mathCheck').click();
        }else{
          t.state.placed=q.answer;document.getElementById('weightCheck').disabled=false;document.getElementById('weightCheck').click();
        }
        if(document.getElementById('success').hidden)throw Error('No success '+i);
        if(document.documentElement.scrollWidth>window.innerWidth+1)throw Error('Horizontal scroll '+i);
      }catch(e){exceptions.push(String(e))}
    }
    return {count:bank.length,stages,errors:exceptions};
  }''')
  assert result['count']==52,result
  assert result['stages']==328,result
  assert not result['errors'],result
  assert not errors,errors
  for idx,label in [(0,'scale'),(24,'mango'),(33,'orange-source-warning'),(34,'math-basic'),(41,'math-composite'),(50,'math-last')]:
   page.evaluate('(idx)=>window.__gameTest.openQuestion(idx)',idx)
   if idx==33:
    page.locator('#parentOpen').click()
    assert 'GIẢ ĐỊNH' in page.locator('#parentSourceNote').inner_text()
    page.locator('#parentClose').click()
   if idx==50:
    assert page.locator('.dot').count()==2
   if idx in (0,34,41,50):page.screenshot(path=str(base/f'preview-{label}-{width}.png'),full_page=True)
  print(f'PASS {width}px — 52 questions; 328 stages; parent warnings; no JS errors or horizontal overflow',flush=True)
  page.close()
 browser.close()