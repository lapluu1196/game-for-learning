/* Giao diện tương tác: 52 câu, chia 5 câu/lượt; không có backend. */
(function(){
'use strict';
const BANK=window.GameBank,LOGIC=window.GameLogic;
const {questions,items,ROUND_SIZE,ROUND_COUNT}=BANK;
const summary=LOGIC.audit();
const $=id=>document.getElementById(id);
const state={index:0,placed:0,picked:null,hintStep:0,hintOpen:false,solved:false,swapped:new Set(),done:new Set()};
try{const saved=JSON.parse(localStorage.getItem('can-vui:v4:completed')||'[]');if(Array.isArray(saved))saved.forEach(id=>{if(questions.some(q=>q.id===id))state.done.add(id)})}catch{}
let drag=null;
const current=()=>questions[state.index];
const currentHints=()=>LOGIC.derive(current()).steps;
const el=(id,n=1)=>({[id]:n});
const drawings={
  pyramid:'<svg viewBox="0 0 64 64" aria-hidden="true"><polygon fill="#267d82" points="32,4 57,53 7,53"/><polygon fill="#59b6aa" points="32,4 32,53 7,53"/><path stroke="#135c60" stroke-width="2" d="M32 4L32 53"/></svg>',
  cube:'<svg viewBox="0 0 64 64" aria-hidden="true"><polygon fill="#b98ddd" points="10,16 29,5 55,18 36,30"/><polygon fill="#8559ad" points="10,16 36,30 36,56 10,44"/><polygon fill="#a16bc2" points="36,30 55,18 55,44 36,56"/></svg>',
  cylinder:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect fill="#5b4d93" x="11" y="18" width="42" height="31"/><ellipse fill="#9688c8" cx="32" cy="18" rx="21" ry="8"/><path d="M11 49a21 8 0 0 0 42 0" fill="#4d447f"/></svg>',
  mangosteen:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="36" r="22" fill="#4b204a"/><path d="M15 21q17-18 34 0l-18 6z" fill="#6ca144"/><path d="M32 24V11" stroke="#3c6b29" stroke-width="5"/></svg>'
};
const safeItem=(id)=>{if(!items[id])throw Error(`Không có biểu tượng ${id}`);return `<span class="obj" data-item="${id}" aria-hidden="true">${drawings[id]||items[id][0]}</span>`};
function icons(id,count=1){return `<span class="items ${count>5?'many':''}">${Array.from({length:count},()=>safeItem(id)).join('')}</span>`}
function units(groups){return `<span class="items ${Object.values(groups).reduce((a,b)=>a+b,0)>5?'many':''}">${Object.entries(groups).flatMap(([id,n])=>Array.from({length:n},()=>safeItem(id))).join('')}</span>`}
function renderQWeight(q,answer){return `<div class="expr">${icons(q.left,q.leftCount)}<span class="eq">=</span>${answer===undefined?'<span class="qmark">?</span>':icons(q.right,answer)}${answer===undefined?icons(q.right):''}</div>`}
function mathPieces(terms,{replaceKnown=null,unknown=null}={}){
 const result=[];
 for(const [id,coef] of terms){const isMinus=coef<0;
  const repeats=Math.abs(coef);for(let i=0;i<repeats;i++){
    if(result.length||isMinus)result.push(`<span class="op">${isMinus?'−':'+'}</span>`);
    if(replaceKnown && replaceKnown[id]!==undefined && id!==unknown)result.push(`<span class="num">${replaceKnown[id]}</span>`);
    else result.push(safeItem(id));
  }
 }
 return result.join('');
}
function mathEquation(eq,{replaceKnown=null,unknown=null}={}){
 // Hai phép "3 tim = tròn" và "3 cây = cây quả" giữ đúng cách trình bày ở PDF.
 const plus=eq.terms.filter(([,c])=>c>0),minus=eq.terms.filter(([,c])=>c<0);
 if(eq.sum===0&&minus.length>0&&plus.length>0){
  return `<div class="expr">${mathPieces(plus,{replaceKnown,unknown})}<span class="eq">=</span>${mathPieces(minus.map(([id,c])=>[id,-c]),{replaceKnown,unknown})}</div>`;
 }
 return `<div class="expr">${mathPieces(eq.terms,{replaceKnown,unknown})}<span class="eq">=</span><span class="num">${eq.sum}</span></div>`;
}
function mathQuery(q,answer){return `<div class="expr">${mathPieces(q.target)}<span class="eq">=</span>${answer===undefined?'<span class="qmark">?</span>':`<span class="num">${answer}</span>`}</div>`}
function renderWeightHint(step,{animate=true}={}){
 switch(step.kind){
  case 'equation':return `<div class="expr">${units(step.left)}<span class="eq">=</span>${units(step.right)}</div>`;
  case 'group':{
    const [[id,n]]=Object.entries(step.focus),groupCount=step.groups;
    const remaining={...step.right};remaining[id]-=n*groupCount;if(!remaining[id])delete remaining[id];
    return `<div class="group-scene">${units(step.left)}<span class="eq">=</span>${Object.keys(remaining).length?units(remaining):''}${Array.from({length:groupCount},(_,i)=>`<div class="group-box" style="--n:${i}">${icons(id,n)}</div>`).join('')}</div>`;
  }
  case 'replace':{
    const [fid,fc]=Object.entries(step.from)[0], [tid,tc]=Object.entries(step.to)[0];
    const rest={...step.before};rest[fid]-=fc;if(rest[fid]===0)delete rest[fid];
    const all=Object.values(rest).reduce((a,b)=>a+b,0);
    return `<div class="replace-scene"><div class="swap-legend">${icons(fid,fc)}<span class="arrow">➜</span>${icons(tid,tc)}</div><div class="replace-main">${units(step.left)}<span class="eq">=</span><div class="objects-row">${all?units(rest):''}<div class="swap-slot ${animate?'animate':'static'}"><span class="old-items">${icons(fid,fc)}</span><span class="new-items">${icons(tid,tc)}</span></div></div></div></div>`;
  }
  case 'split':{
    const groups=(x,type)=>`<div class="split-side ${type}" style="--parts:${step.parts}">${Array.from({length:step.parts},(_,i)=>`<div class="group-box" style="--n:${i}">${units(x)}</div>`).join('')}</div>`;
    return `<div class="split-scene">${groups(step.leftGroup,'left')}<div class="split-equals">=</div>${groups(step.rightGroup,'right')}</div>`;
  }
 }
 throw Error('Unknown weight hint '+step.kind);
}
function renderMathHint(step){
 if(step.kind==='mathSource')return mathEquation(step.eq);
 if(step.kind==='mathDivide'){
  const per=step.total/step.parts;
  return `<div class="math-steps">${mathEquation(step.eq)}<div class="math-dots">${Array.from({length:step.parts},(_,i)=>`<div class="dot-group" style="--n:${i}" aria-label="Nhóm ${i+1}">${Array.from({length:per},()=>'<span class="count-dot"></span>').join('')}</div>`).join('')}</div></div>`;
 }
 if(step.kind==='mathSubstitute')return mathEquation(step.eq,{replaceKnown:step.known,unknown:step.unknown});
 if(step.kind==='mathSolved')return `<div class="expr">${icons(step.symbol)}<span class="eq">=</span><span class="num">${step.value}</span></div>`;
 if(step.kind==='mathFinal'){
  const q=current(),v=LOGIC.deriveMath(q).values;
  return `<div class="math-steps">${mathQuery(q,step.answer)}<div class="expr">${mathPieces(q.target,{replaceKnown:v})}<span class="eq">=</span><span class="num">${step.answer}</span></div></div>`;
 }
 throw Error('Unknown math hint '+step.kind);
}
function showScene(step,{animate=true}={}){return `<div class="hint-scene">${current().kind==='weight'?renderWeightHint(step,{animate}):renderMathHint(step)}</div>`}
function renderFacts(){const q=current();
 $('sourcePage').textContent=`📖 ${q.printedPage}`;
 $('facts').className='facts'+(q.kind==='math'&&q.eq.length>2?' many':'');
 if(q.kind==='weight'){$('facts').innerHTML=q.rules.map((r,i)=>{
    const swapped=state.swapped.has(i);
    const a=swapped?[r[2],r[3]]:[r[0],r[1]], b=swapped?[r[0],r[1]]:[r[2],r[3]];
    return `<button class="fact ${swapped?'swapped':''}" data-fact="${i}" type="button" aria-label="Cân mẫu ${i+1}; chạm để đổi hai vế"><div class="expr">${icons(a[0],a[1])}<span class="eq">=</span>${icons(b[0],b[1])}</div><span class="swap-sign">↔</span></button>`;
 }).join('')}
 else $('facts').innerHTML=q.eq.map((eq,i)=>`<div class="fact" data-fact="${i}">${mathEquation(eq)}</div>`).join('');
}
function renderRound(){
 const start=Math.floor(state.index/ROUND_SIZE)*ROUND_SIZE;
 const round=Math.floor(state.index/ROUND_SIZE);
 $('roundLabel').textContent=`Lượt ${round+1} / ${ROUND_COUNT}`;
 $('prevRound').disabled=round===0;$('nextRound').disabled=round>=ROUND_COUNT-1;
 $('progress').innerHTML=questions.slice(start,start+ROUND_SIZE).map((q,i)=>{
  const active=start+i===state.index,done=state.done.has(q.id);
  return `<button type="button" class="dot ${active?'active':''} ${done?'done':''}" data-question="${start+i}" aria-label="Câu ${i+1} trong lượt ${round+1}: ${q.title}" aria-current="${active?'step':'false'}">${done?'✓':i+1}</button>`;
 }).join('');
}
function renderHints(){const h=currentHints();$('hints').hidden=!state.hintOpen;$('hintToggle').setAttribute('aria-expanded',String(state.hintOpen));
 if(!state.hintOpen)return;
 $('hintIndex').textContent=`${state.hintStep+1} / ${h.length}`;
 $('hintBack').disabled=state.hintStep===0;$('hintNext').disabled=state.hintStep===h.length-1;
 $('hintScene').innerHTML=showScene(h[state.hintStep]);
}
function renderParent(){const q=current(),h=currentHints();
 $('parentLessonTitle').textContent=`${q.title} · Trang ${q.printedPage} · Câu ${q.id.split('-q')[1]}`;
 const warning=q.sourceWarning||q.note;
 $('parentSourceNote').hidden=!warning;$('parentSourceNote').textContent=warning||'';
 $('parentIntro').textContent=q.kind==='weight'?'Giữ nguyên hai bên cân bằng. Khi đổi một nhóm vật, phải dùng đúng cân mẫu; nếu lấy nhiều nhóm để đổi thì cuối cùng chia đều hai bên.':'Thay từng hình đã biết bằng số, làm phép cộng/trừ, chia đều khi có nhiều hình giống nhau.';
 $('parentSteps').innerHTML=h.map((s,i)=>`<div class="parent-step"><span class="step-index">${i+1}</span><div><p>${s.text}</p>${showScene(s,{animate:false})}</div></div>`).join('');
}
function renderScale(){const q=current();if(q.kind!=='weight')return;
 const m=LOGIC.massMap(q.rules),left=q.leftCount*m[q.left],right=state.placed*m[q.right];
 $('beam').style.setProperty('--tilt',`${left===right?0:left>right?-9:9}deg`);
 $('leftPan').innerHTML=icons(q.left,q.leftCount);
 $('rightPan').innerHTML=state.placed?
  Array.from({length:state.placed},()=>`<button type="button" class="remove-item" aria-label="Chạm để bớt một ${items[q.right][1]}">${safeItem(q.right)}</button>`).join(''):
  '<span class="empty" aria-hidden="true">⇣</span>';
 $('balanceBadge').textContent=left===right?'⚖️':left>right?'↙️':'↘️';$('balanceBadge').className='balance-badge'+(left===right?' equal':'');
 $('pieceSource').disabled=state.solved||state.placed>=12;$('weightCheck').disabled=state.solved||state.placed===0;
}
function mathChoices(q){
 const a=q.answer, nums=a===1?[1,2,3]:a===12?[10,11,12]:[a-1,a,a+1];
 const offset=state.index%3;
 return [nums[offset],nums[(offset+1)%3],nums[(offset+2)%3]];
}
function renderMathChoices(){const q=current();$('numberOptions').innerHTML=mathChoices(q).map(n=>`<button class="number-option ${state.picked===n?'selected':''}" type="button" data-option="${n}" aria-label="Chọn số ${n}" aria-pressed="${state.picked===n}">${n}</button>`).join('');$('mathCheck').disabled=state.solved||state.picked===null}
function openQuestion(i){
 if(i<0||i>=questions.length)return;
 cleanDrag();state.index=i;state.placed=0;state.picked=null;state.hintStep=0;state.hintOpen=false;state.swapped=new Set();state.solved=false;
 const q=current();$('success').hidden=true;$('roundComplete').hidden=true;$('feedback').textContent='';$('feedback').className='feedback';
 $('question').innerHTML=q.kind==='weight'?renderQWeight(q):mathQuery(q);
 $('question').setAttribute('aria-label',q.kind==='weight'?`${q.leftCount} ${items[q.left][1]} bằng mấy ${items[q.right][1]}?`:'Hãy tìm số còn thiếu trong phép tính bằng hình');
 $('scaleBoard').hidden=q.kind!=='weight';$('weightControls').hidden=q.kind!=='weight';$('mathControls').hidden=q.kind!=='math';
 if(q.kind==='weight'){
  $('piece').textContent=items[q.right][0];$('piece').setAttribute('data-item',q.right);
  $('pieceSource').setAttribute('aria-label',`Chạm để thêm hoặc kéo ${items[q.right][1]} lên đĩa phải`);
  renderScale();
 } else renderMathChoices();
 renderFacts();renderRound();renderHints();renderParent();
}
function changePlaced(d){if(state.solved||current().kind!=='weight')return;state.placed=Math.max(0,Math.min(12,state.placed+d));$('feedback').textContent='';renderScale()}
function pickNumber(n){if(state.solved||current().kind!=='math')return;state.picked=n;$('feedback').textContent='';renderMathChoices()}
function check(){const q=current();if(state.solved)return;const value=q.kind==='weight'?state.placed:state.picked;if(value===null||value===0)return;
 if(value!==q.answer){$('feedback').textContent='👀  ↻';$('feedback').className='feedback err';return}
 state.solved=true;state.done.add(q.id);try{localStorage.setItem('can-vui:v4:completed',JSON.stringify([...state.done]))}catch{}
 $('success').hidden=false;$('feedback').textContent='';$('feedback').className='feedback';
 $('solved').innerHTML=q.kind==='weight'?renderQWeight(q,q.answer):mathQuery(q,q.answer);
 const end=Math.min(questions.length,(Math.floor(state.index/ROUND_SIZE)+1)*ROUND_SIZE);
 const complete=questions.slice(Math.floor(state.index/ROUND_SIZE)*ROUND_SIZE,end).every(c=>state.done.has(c.id));
 $('roundComplete').hidden=!complete;$('nextQuestion').hidden=state.index===questions.length-1;
 if(q.kind==='weight')renderScale();else renderMathChoices();renderRound();
}
function reset(){openQuestion(state.index)}
// Kéo thả Pointer Events: không cần thư viện và không kích hoạt "đúng" khi vừa cân bằng.
function overRight(x,y){const p=$('rightPan').getBoundingClientRect(),r=20;return x>=p.left-r&&x<=p.right+r&&y>=p.top-r&&y<=p.bottom+r}
function startDrag(e,kind){if(state.solved||current().kind!=='weight'||e.button!==0)return;if(kind==='add'&&state.placed>=12)return;
 const src=kind==='add'?$('pieceSource'):e.target.closest('.remove-item');if(!src)return;
 drag={id:e.pointerId,kind,src,x:e.clientX,y:e.clientY,active:false,ghost:null};src.setPointerCapture?.(e.pointerId);e.preventDefault()}
function moveDrag(e){if(!drag||drag.id!==e.pointerId)return;
 if(!drag.active&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>9){drag.active=true;const ghost=document.createElement('div');ghost.className='drag-ghost';ghost.textContent=items[current().right][0];document.body.appendChild(ghost);drag.ghost=ghost;drag.src.classList.add('dragging')}
 if(drag.active){drag.ghost.style.left=`${e.clientX}px`;drag.ghost.style.top=`${e.clientY}px`; $('rightPan').classList.toggle('drop-ready',overRight(e.clientX,e.clientY))}}
function cleanDrag(){if(!drag)return;drag.ghost?.remove();drag.src.classList.remove('dragging');$('rightPan').classList.remove('drop-ready');drag=null}
function finishDrag(e){if(!drag||drag.id!==e.pointerId)return;const kind=drag.kind,active=drag.active,onPan=overRight(e.clientX,e.clientY);cleanDrag();if(kind==='add'&&(!active||onPan))changePlaced(1);if(kind==='remove'&&(!active||!onPan))changePlaced(-1)}
function speak(){if(!('speechSynthesis'in window))return;const q=current();try{speechSynthesis.cancel();const word=q.kind==='weight'?`${q.leftCount} ${items[q.left][1]} nặng bằng mấy ${items[q.right][1]}? Con đặt vào cân nhé.`:'Con xem các phép tính bằng hình phía trên. Ô dấu hỏi bằng mấy?';const s=new SpeechSynthesisUtterance(word);s.lang='vi-VN';s.rate=.78;speechSynthesis.speak(s)}catch{}}
$('progress').addEventListener('click',e=>{const b=e.target.closest('[data-question]');if(b)openQuestion(Number(b.dataset.question))});
$('prevRound').addEventListener('click',()=>openQuestion(Math.max(0,(Math.floor(state.index/ROUND_SIZE)-1)*ROUND_SIZE)));
$('nextRound').addEventListener('click',()=>openQuestion(Math.min(questions.length-1,(Math.floor(state.index/ROUND_SIZE)+1)*ROUND_SIZE)));
$('facts').addEventListener('click',e=>{const b=e.target.closest('[data-fact]');if(!b||current().kind!=='weight')return;const i=Number(b.dataset.fact);state.swapped.has(i)?state.swapped.delete(i):state.swapped.add(i);renderFacts()});
$('hintToggle').addEventListener('click',()=>{state.hintOpen=!state.hintOpen;state.hintStep=0;renderHints()});
$('hintBack').addEventListener('click',()=>{state.hintStep=Math.max(0,state.hintStep-1);renderHints()});
$('hintNext').addEventListener('click',()=>{state.hintStep=Math.min(currentHints().length-1,state.hintStep+1);renderHints()});
$('hintReplay').addEventListener('click',renderHints);
$('pieceSource').addEventListener('pointerdown',e=>startDrag(e,'add'));
$('rightPan').addEventListener('pointerdown',e=>{if(e.target.closest('.remove-item'))startDrag(e,'remove')});
document.addEventListener('pointermove',moveDrag);document.addEventListener('pointerup',finishDrag);document.addEventListener('pointercancel',cleanDrag);
$('pieceSource').addEventListener('click',e=>{if(!window.PointerEvent||(e.detail===0&&!e.pointerType))changePlaced(1)});
$('rightPan').addEventListener('click',e=>{if(e.target.closest('.remove-item')&&(!window.PointerEvent||(e.detail===0&&!e.pointerType)))changePlaced(-1)});
$('numberOptions').addEventListener('click',e=>{const b=e.target.closest('[data-option]');if(b)pickNumber(Number(b.dataset.option))});
$('weightCheck').addEventListener('click',check);$('mathCheck').addEventListener('click',check);
$('weightReset').addEventListener('click',reset);$('mathReset').addEventListener('click',reset);
$('nextQuestion').addEventListener('click',()=>openQuestion(state.index+1));$('speak').addEventListener('click',speak);
$('parentOpen').addEventListener('click',()=>{$('parentOverlay').hidden=false;$('parentClose').focus()});
function closeParent(){$('parentOverlay').hidden=true;$('parentOpen').focus()}
$('parentClose').addEventListener('click',closeParent);$('parentOverlay').addEventListener('click',e=>{if(e.target===$('parentOverlay'))closeParent()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('parentOverlay').hidden)closeParent()});
// Read-only testing surface; no external communication.
window.__gameTest={summary,state,openQuestion,check,derive:LOGIC.derive};
openQuestion(0);
})();