"""Check all 5 lesson answers, every derivation, and replacement animation.
Run: pip install playwright && playwright install chromium
     python tests/test_hints.py
"""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright

html=(Path(__file__).resolve().parents[1]/"index.html").read_text(encoding="utf-8")
expected=[
    ["equation","equation","equation","split","equation"],
    ["equation","equation","group","replace","replace","equation"],
    ["equation","equation","group","replace","replace","equation"],
    ["equation","equation","group","replace","replace","equation"],
    ["equation","equation","equation","split","equation"],
]
answers=[2,2,2,4,2]

with sync_playwright() as playwright:
    executable=shutil.which("chromium") or shutil.which("chromium-browser")
    options={"headless":True}
    if executable: options["executable_path"]=executable
    browser=playwright.chromium.launch(**options)
    for width,height in [(1180,950),(390,844),(320,740)]:
        page=browser.new_page(viewport={"width":width,"height":height})
        errors=[]
        page.on("pageerror",lambda e: errors.append(str(e)))
        page.set_content(html,wait_until="load")
        assert page.evaluate("auditLessons(); lessons.length")==5
        for idx,kinds in enumerate(expected):
            page.evaluate("(i)=>openLevel(i)",idx)
            assert page.evaluate(f"lessons[{idx}].steps.map(s=>s.kind)")==kinds
            assert page.evaluate(f"lessons[{idx}].leftMass/lessons[{idx}].rightMass")==answers[idx]
            page.evaluate("()=>{state.hintOpen=true;renderHint()}")
            for j,kind in enumerate(kinds):
                page.evaluate("(s)=>{state.step=s;renderHint()}",j)
                scene=page.locator("#hintScene")
                assert page.locator("#hintCounter").inner_text()==f"{j+1} / {len(kinds)}"
                if kind=="group": assert scene.locator(".substitution-group").count()==2
                if kind=="replace":
                    step=page.evaluate(f"lessons[{idx}].steps[{j}]")
                    assert scene.locator(".substitution-group").count()==step["parts"]
                    assert scene.locator(".group-finished").count()==step["replacing"]
                    assert scene.locator(".swap-slot.animate").count()==1
                if kind=="split":
                    parts=page.evaluate(f"lessons[{idx}].steps[{j}].parts")
                    assert scene.locator(".split-side.left .split-group").count()==parts
                    assert scene.locator(".split-side.right .split-group").count()==parts
                assert page.evaluate("document.documentElement.scrollWidth<=innerWidth")
                assert page.evaluate("document.querySelector('#hintScene').scrollWidth<=document.querySelector('#hintScene').clientWidth+1")
            page.evaluate("()=>{state.hintOpen=false;renderHint()}")
            page.locator("#parentOpen").click()
            assert page.locator(".parent-step").count()==len(kinds)
            if idx in (1,2,3):
                assert page.locator(".swap-slot.static").count()==2
            page.locator("#parentClose").click()
            for _ in range(answers[idx]): page.locator("#pieceSource").click()
            assert page.locator("#successPanel").is_hidden()
            page.locator("#check").click()
            assert page.locator("#successPanel").is_visible()
            assert not errors,errors
        print(f"{width}px: all five solutions + 28 steps PASS")
        page.close()

    page=browser.new_page(viewport={"width":390,"height":844})
    page.set_content(html,wait_until="load")
    page.evaluate("()=>{openLevel(1);state.hintOpen=true;state.step=3;renderHint()}")
    slot=page.locator("#hintScene .swap-slot.animate")
    assert slot.locator(".old-items .object").count()==2
    assert slot.locator(".new-items .object").count()==1
    page.wait_for_timeout(1850)
    assert float(slot.locator(".old-items").evaluate("(e)=>getComputedStyle(e).opacity"))<.05
    assert float(slot.locator(".new-items").evaluate("(e)=>getComputedStyle(e).opacity"))>.95
    page.locator("#hintReplay").click()
    page.wait_for_timeout(250)
    assert float(page.locator("#hintScene .swap-slot .old-items").evaluate("(e)=>getComputedStyle(e).opacity"))>.9
    print("Onion-to-eggplant animation and replay PASS")
    browser.close()
