/* Pure logic: giải từng bước, kiểm tra mọi câu trước khi giao cho bé. */
(function(root){
'use strict';
const BANK=root.GameBank||(typeof require!=='undefined'?require('./questions.js'):null);
const {questions,items}=BANK;
const same=(a,b)=>Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>a[k]===b[k]);
const counts=(id,n)=>({[id]:n});
const copy=(s)=>({...s});
const sumTokens=s=>Object.values(s).reduce((a,b)=>a+b,0);
const key=s=>Object.entries(s).sort(([a],[b])=>a.localeCompare(b)).map(([a,b])=>`${a}:${b}`).join(';');
const normalize=s=>Object.fromEntries(Object.entries(s).filter(([,n])=>n>0));
function massMap(rules){
 const m={};m[rules[0][0]]=1;
 for(let pass=0;pass<rules.length+2;pass++)for(const [a,an,b,bn] of rules){
   if(m[a]!==undefined&&m[b]===undefined)m[b]=m[a]*an/bn;
   if(m[b]!==undefined&&m[a]===undefined)m[a]=m[b]*bn/an;
 }
 for(const [a,an,b,bn] of rules){
  if(m[a]===undefined||m[b]===undefined||Math.abs(m[a]*an-m[b]*bn)>1e-9)throw Error(`Cân mẫu mâu thuẫn ${a}/${b}`);
 }
 return m;
}
function stateMass(s,m){return Object.entries(s).reduce((a,[id,count])=>a+count*m[id],0)}
function replaceState(state,fromId,fromNum,toId,toNum){
 if((state[fromId]||0)<fromNum)return null;
 const next=copy(state);next[fromId]-=fromNum;
 if(!next[fromId])delete next[fromId];next[toId]=(next[toId]||0)+toNum;
 return normalize(next);
}
function searchPath(q,multiple){
 const start=counts(q.left,q.leftCount*multiple),target=counts(q.right,q.answer*multiple);
 const LIMIT=Math.max(22,sumTokens(start),sumTokens(target));
 const queue=[{state:start,path:[]}],seen=new Set([key(start)]);
 for(let head=0;head<queue.length&&queue.length<30000;head++){
   const node=queue[head];
   if(same(node.state,target))return node.path;
   if(node.path.length>=18)continue;
   for(const [a,an,b,bn] of q.rules){
    for(const [f,fn,t,tn] of [[a,an,b,bn],[b,bn,a,an]]){
     const next=replaceState(node.state,f,fn,t,tn);
     if(!next||sumTokens(next)>LIMIT||seen.has(key(next)))continue;
     seen.add(key(next));queue.push({state:next,path:[...node.path,{before:node.state,after:next,from:counts(f,fn),to:counts(t,tn)}]});
    }
   }
 }
 return null;
}
function deriveWeight(q){
 const mass=massMap(q.rules);
 if(Math.abs(q.leftCount*mass[q.left]-q.answer*mass[q.right])>1e-9)throw Error(`${q.id}: đáp án sai khối lượng`);
 let path=null,multiple=0;
 for(let n=1;n<=8;n++){path=searchPath(q,n);if(path){multiple=n;break}}
 if(!path)throw Error(`${q.id}: Không tìm ra chuỗi thay thế`);
 const left=counts(q.left,q.leftCount*multiple), steps=[];
 for(const r of q.rules)steps.push({kind:'equation',left:counts(r[0],r[1]),right:counts(r[2],r[3]),
  text:`Cân mẫu: ${r[1]} ${items[r[0]][1]} nặng bằng ${r[3]} ${items[r[2]][1]}.`});
 if(multiple>1)steps.push({kind:'equation',left,right:copy(left),
  text:`Lấy ${multiple} nhóm như nhau để có thể đổi trọn từng nhóm. Sau đó sẽ chia đều ${multiple} phần.`});
 let total=0;
 for(const tr of path){
  const [fromId,fromN]=Object.entries(tr.from)[0];
  const groups=Math.floor((tr.before[fromId]||0)/fromN);
  if(fromN>1&&groups>1){
    steps.push({kind:'group',left,right:tr.before,focus:tr.from,groups,
      text:`Gom ${tr.before[fromId]} ${items[fromId][1]} thành ${groups} nhóm, mỗi nhóm ${fromN}.`});
  }
  const [toId,toN]=Object.entries(tr.to)[0];
  steps.push({kind:'replace',left,before:tr.before,after:tr.after,from:tr.from,to:tr.to,
    text:`Nhấc ${fromN} ${items[fromId][1]} ra, đặt ${toN} ${items[toId][1]} vào ngay chỗ đó. Hai bên vẫn nặng bằng nhau.`});
  total++;
 }
 if(multiple>1){
   steps.push({kind:'split',parts:multiple,leftGroup:counts(q.left,q.leftCount),rightGroup:counts(q.right,q.answer),
     text:`Chia đều cả hai bên thành ${multiple} phần. Giữ lại một cặp nhóm bằng nhau.`});
 }
 steps.push({kind:'equation',left:counts(q.left,q.leftCount),right:counts(q.right,q.answer),
  text:`Kết luận: ${q.leftCount} ${items[q.left][1]} = ${q.answer} ${items[q.right][1]}.`});
 // Mọi bước phải bảo toàn khối lượng và phép thay phải từ một cân mẫu thật.
 for(const [i,s] of steps.entries()){
   if(s.kind==='equation'&&Math.abs(stateMass(s.left,mass)-stateMass(s.right,mass))>1e-9)throw Error(`${q.id}: phương trình ${i}`);
   if(s.kind==='replace'){
    if(Math.abs(stateMass(s.before,mass)-stateMass(s.after,mass))>1e-9)throw Error(`${q.id}: thay đổi khối lượng ${i}`);
    if(Math.abs(stateMass(s.from,mass)-stateMass(s.to,mass))>1e-9)throw Error(`${q.id}: thay nhóm sai ${i}`);
   }
   if(s.kind==='split'&&Math.abs(stateMass(s.leftGroup,mass)-stateMass(s.rightGroup,mass))>1e-9)throw Error(`${q.id}: chia nhóm sai ${i}`);
 }
 return {kind:'weight',mass,multiple,transitions:path.length,steps};
}
function equationValue(eq,values){return eq.terms.reduce((acc,[id,coefficient])=>acc+coefficient*(values[id]||0),0)}
function deriveMath(q){
 const values={},steps=[];
 const allIds=[...new Set([...q.eq.flatMap(e=>e.terms.map(([id])=>id)),...q.target.map(([id])=>id)])];
 let safety=0;
 while(Object.keys(values).length<allIds.length&&safety++<30){
   let advanced=false;
   for(const eq of q.eq){
     const unknown=[...new Set(eq.terms.map(([id])=>id).filter(id=>values[id]===undefined))];
     if(unknown.length!==1)continue;
     const id=unknown[0];
     const coef=eq.terms.filter(t=>t[0]===id).reduce((a,t)=>a+t[1],0);
     const known=eq.terms.filter(t=>t[0]!==id).reduce((acc,[key,c])=>acc+c*values[key],0);
     const n=(eq.sum-known)/coef;
     if(!Number.isInteger(n)||n<1||n>12)throw Error(`${q.id}: giá trị ${id} không nguyên hoặc quá lớn: ${n}`);
     values[id]=n;advanced=true;
     steps.push({kind:'mathSource',eq,text:`Nhìn phép tính: ${formatTerms(eq.terms)} = ${eq.sum}.`});
     if(Math.abs(coef)>1&&coef>0){
       steps.push({kind:'mathDivide',symbol:id,parts:coef,total:eq.sum-known,known,eq,
         text:`Chia đều ${eq.sum-known} chấm thành ${coef} phần. Mỗi phần có ${n} chấm.`});
     }else if(eq.terms.length>1){
       steps.push({kind:'mathSubstitute',eq,known:{...values},unknown:id,
         text:`Thay các hình đã biết bằng số, ta tìm được ${items[id][1]} bằng ${n}.`});
     }
     steps.push({kind:'mathSolved',symbol:id,value:n,text:`${items[id][1]} có giá trị ${n}.`});
   }
   if(!advanced)break;
 }
 if(allIds.some(x=>values[x]===undefined))throw Error(`${q.id}: chưa giải được ${allIds.filter(x=>values[x]===undefined)}`);
 for(const eq of q.eq){if(equationValue(eq,values)!==eq.sum)throw Error(`${q.id}: mâu thuẫn dữ kiện ${formatTerms(eq.terms)}`)}
 const answer=q.target.reduce((v,[id,c])=>v+c*values[id],0);
 if(answer!==q.answer)throw Error(`${q.id}: đáp án ${answer} khác ${q.answer}`);
 steps.push({kind:'mathFinal',target:q.target,answer,text:`Thay từng hình bằng số tương ứng rồi tính được ${answer}.`});
 return {kind:'math',values,steps};
}
function formatTerms(terms){return terms.map(([id,c])=>`${c<0?'-':'+'} ${Math.abs(c)} ${items[id][1]}`).join(' ').replace(/^\+ /,'')}
function derive(q){return q.kind==='weight'?deriveWeight(q):deriveMath(q)}
function audit(){
 if(questions.length!==52)throw Error('Phải có 52 câu');
 const seen=new Set();
 for(const q of questions){
  if(seen.has(q.id))throw Error('ID trùng '+q.id);seen.add(q.id);
  if(!items[q.kind==='weight'?q.left:q.target[0][0]])throw Error('ID hình không tồn tại '+q.id);
  const out=derive(q);if(!out.steps.length)throw Error('Thiếu gợi ý '+q.id);
 }
 if(questions.filter(q=>q.kind==='weight').length!==34||questions.filter(q=>q.kind==='math').length!==18)throw Error('Sai số câu theo dạng');
 return {count:questions.length,weight:34,math:18,rounds:Math.ceil(questions.length/5),hints:questions.map(q=>derive(q).steps.length).reduce((a,b)=>a+b,0)};
}
const exported={derive,deriveWeight,deriveMath,massMap,audit,searchPath,counts,key,stateMass};
root.GameLogic=exported;if(typeof module!=='undefined'&&module.exports)module.exports=exported;
})(typeof globalThis!=='undefined'?globalThis:this);