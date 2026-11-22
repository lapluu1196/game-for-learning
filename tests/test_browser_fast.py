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
  errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
  page.set_content(html,wait_until='load')
  assert page.locator('#roundLabel').inner_text()=='Lượt 1 / 6'
  assert page.locator('#question [data-item="cabbage"]').count()==1
  assert page.locator('#question [data-item="eggplant"]').count()==1
  assert page.locator('#question .qmark').count()==1
  assert page.locator('#courseSummary').inner_text().startswith('26 bài chính')
  result=page.evaluate('''() => {
    const t=window.__gameTest;const records=[];
    for(const mode of ['main','extra']){
      t.selectMode(mode);
      const bank=t.getActive();let stages=0;
      for(let i=0;i<bank.length;i++){
        t.openQuestion(i);const q=bank[i];const steps=t.derive(q).steps;
        const expected=Math.min(5,bank.length-Math.floor(i/5)*5);
        if(document.querySelectorAll('.dot').length!==expected)throw Error('wrong dots '+mode+'/'+i);
        if(document.getElementById('roundLabel').textContent!==`Lượt ${Math.floor(i/5)+1} / 6`)throw Error('wrong round '+mode+'/'+i);
        if(document.getElementById('scaleBoard').hidden!==(q.kind==='math'))throw Error('wrong board '+mode+'/'+i);
        for(let j=0;j<steps.length;j++){
          t.state.hintOpen=true;t.state.hintStep=j;document.getElementById('hintReplay').click();
          if(!document.querySelector('#hintScene .hint-scene'))throw Error('no scene '+mode+'/'+i+'/'+j);
          stages++;
        }
        t.state.hintOpen=false;
        if(q.kind==='math'){
          document.querySelector(`[data-option="${q.answer}"]`).click();document.getElementById('mathCheck').click();
        }else{
          t.state.placed=q.answer;document.getElementById('weightCheck').disabled=false;document.getElementById('weightCheck').click();
        }
        if(document.getElementById('success').hidden)throw Error('success missing '+mode+'/'+i);
        if(document.documentElement.scrollWidth>window.innerWidth+1)throw Error('horizontal overflow '+mode+'/'+i);
      }
      records.push([mode,bank.length,stages]);
    }
    t.selectMode('main');return records;
  }''')
  assert result[0][1] ==26 and result[1][1]==26,result
  assert result[0][2]+result[1][2]==328,result
  assert not errors,errors
  # The mode picker lives behind the parent button.
  page.locator('#parentOpen').click()
  assert page.locator('#modeMain').get_attribute('aria-pressed')=='true'
  page.locator('#modeExtra').click()
  assert page.locator('#modeExtra').get_attribute('aria-pressed')=='true'
  assert page.locator('#courseSummary').inner_text().startswith('26 câu luyện thêm')
  page.locator('#parentOpen').click();page.locator('#modeMain').click()
  assert page.locator('#question [data-item="cabbage"]').count()==1
  assert page.locator('#question [data-item="eggplant"]').count()==1
  page.screenshot(path=str(base/f'primary-{width}.png'),full_page=True)
  print(f'PASS {width}px: {result}, parent switch, no overflow/JS errors',flush=True)
  page.close()
 browser.close()