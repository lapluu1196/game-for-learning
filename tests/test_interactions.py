from pathlib import Path
from playwright.sync_api import sync_playwright
base=Path(__file__).resolve().parents[1]
html=(base/'index.html').read_text('utf-8')
for name in ('questions.js','logic.js','app.js'):
 html=html.replace(f'<script src="{name}"></script>',f'<script>{(base/name).read_text("utf-8")}</script>')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium')
 for width in (390,320,1180):
  page=b.new_page(viewport={'width':width,'height':850})
  page.set_content(html)
  page.locator('#pieceSource').click();page.locator('#pieceSource').click()
  assert page.locator('#balanceBadge').inner_text()=='⚖️'
  assert page.locator('#success').is_hidden(), 'Popup may only appear after check'
  page.locator('#weightCheck').click()
  assert page.locator('#success').is_visible()
  page.evaluate('window.__gameTest.openQuestion(1)')
  src=page.locator('#pieceSource').bounding_box();dst=page.locator('#rightPan').bounding_box()
  assert src and dst
  sx=src['x']+src['width']/2;sy=src['y']+src['height']/2
  tx=dst['x']+dst['width']/2;ty=dst['y']+dst['height']/2
  page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(tx,ty,steps=12);page.mouse.up()
  assert page.evaluate('window.__gameTest.state.placed')==1,'Drag to pan did not add an object'
  page.locator('#rightPan .remove-item').first.click()
  assert page.evaluate('window.__gameTest.state.placed')==0,'Tap to remove failed'
  page.evaluate('window.__gameTest.openQuestion(34)')
  wrong=page.locator('[data-option]')
  wrong.first.click()
  is_right=int(wrong.first.get_attribute('data-option'))==2
  if not is_right:
   page.locator('#mathCheck').click()
   assert page.locator('#success').is_hidden(), 'Wrong answer displayed success'
  page.locator('[data-option="2"]').click()
  assert page.locator('#success').is_hidden(), 'Selecting number should not auto-check'
  page.locator('#mathCheck').click();assert page.locator('#success').is_visible()
  page.evaluate('window.__gameTest.openQuestion(3)')
  page.locator('#hintToggle').click()
  replacement=page.evaluate('''() => {const h=window.__gameTest.derive(window.GameBank.questions[3]).steps;return h.map((s,i)=>[s.kind,i]).filter(([k])=>k==='replace')}''')
  assert len(replacement)>=2,replacement
  page.evaluate('(n)=>{window.__gameTest.state.hintStep=n;document.getElementById("hintReplay").click()}',replacement[1][1])
  assert page.locator('#hintScene .swap-slot.animate').count()==1
  page.wait_for_timeout(1820)
  old=float(page.locator('#hintScene .swap-slot .old-items').evaluate('(e)=>getComputedStyle(e).opacity'))
  new=float(page.locator('#hintScene .swap-slot .new-items').evaluate('(e)=>getComputedStyle(e).opacity'))
  assert old<.1 and new>.95,(old,new)
  page.locator('#hintReplay').click()
  page.wait_for_timeout(260)
  old=float(page.locator('#hintScene .swap-slot .old-items').evaluate('(e)=>getComputedStyle(e).opacity'))
  assert old>.9
  print('PASS interactions',width,flush=True)
  page.close()
 b.close()