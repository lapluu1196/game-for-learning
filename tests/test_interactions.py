from pathlib import Path
from playwright.sync_api import sync_playwright
base=Path(__file__).resolve().parents[1]
html=(base/'index.html').read_text('utf-8')
for name in ('questions.js','logic.js','app.js'):
 html=html.replace(f'<script src="{name}"></script>',f'<script>{(base/name).read_text("utf-8")}</script>')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium')
 for width in (390,320,1180):
  page=browser.new_page(viewport={'width':width,'height':850})
  page.set_content(html)
  # First main question = one cabbage = two eggplants.
  assert page.locator('#question [data-item="cabbage"]').count()==1
  page.locator('#pieceSource').click();page.locator('#pieceSource').click()
  assert page.locator('#balanceBadge').inner_text()=='⚖️'
  assert page.locator('#success').is_hidden(),'No auto popup before check'
  page.locator('#weightCheck').click()
  assert page.locator('#success').is_visible()
  # Drag and remove on main question 2 (greens versus corn).
  page.evaluate('window.__gameTest.openQuestion(1)')
  src=page.locator('#pieceSource').bounding_box();dst=page.locator('#rightPan').bounding_box()
  assert src and dst
  sx,sy=src['x']+src['width']/2,src['y']+src['height']/2
  tx,ty=dst['x']+dst['width']/2,dst['y']+dst['height']/2
  page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(tx,ty,steps=12);page.mouse.up()
  assert page.evaluate('window.__gameTest.state.placed')==1
  page.locator('#rightPan .remove-item').first.click()
  assert page.evaluate('window.__gameTest.state.placed')==0
  # The 9th main question is the first numeric apple example.
  page.evaluate('window.__gameTest.openQuestion(8)')
  assert page.locator('#numberOptions [data-option]').count()==3
  page.locator('[data-option="2"]').click()
  assert page.locator('#success').is_hidden()
  page.locator('#mathCheck').click()
  assert page.locator('#success').is_visible()
  # Replacing two onions by one eggplant is animated in main question 1.
  page.evaluate('window.__gameTest.openQuestion(0)')
  page.locator('#hintToggle').click()
  steps=page.evaluate('''() => window.__gameTest.derive(window.__gameTest.getActive()[0]).steps.map((s,i)=>[s.kind,i]).filter(([k])=>k==='replace')''')
  assert len(steps)>=2,steps
  page.evaluate('(n)=>{window.__gameTest.state.hintStep=n;document.getElementById("hintReplay").click()}',steps[1][1])
  assert page.locator('#hintScene .swap-slot.animate').count()==1
  page.wait_for_timeout(1820)
  old=float(page.locator('#hintScene .swap-slot .old-items').evaluate('(e)=>getComputedStyle(e).opacity'))
  new=float(page.locator('#hintScene .swap-slot .new-items').evaluate('(e)=>getComputedStyle(e).opacity'))
  assert old<.1 and new>.95,(old,new)
  page.locator('#hintReplay').click();page.wait_for_timeout(260)
  old=float(page.locator('#hintScene .swap-slot .old-items').evaluate('(e)=>getComputedStyle(e).opacity'))
  assert old>.9
  print('PASS interactive checks',width,flush=True)
  page.close()
 browser.close()