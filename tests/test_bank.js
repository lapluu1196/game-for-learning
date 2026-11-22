const assert=require('node:assert/strict');
const B=require('../questions.js'),L=require('../logic.js');
assert.deepEqual(L.audit(),{count:52,weight:34,math:18,main:26,extra:26,rounds:6,extraRounds:6,hints:328});
assert.equal(B.mainQuestions.length,26);
assert.equal(B.extraQuestions.length,26);
assert.equal(B.mainQuestions[0].id,'p1-q4');
assert.deepEqual([B.mainQuestions[0].left,B.mainQuestions[0].leftCount,B.mainQuestions[0].right,B.mainQuestions[0].answer],['cabbage',1,'eggplant',2]);
assert.equal(new Set(B.questions.map(q=>q.id)).size,52);
assert.deepEqual(Object.values(B.questions.reduce((o,q)=>(o[q.sourcePage]=(o[q.sourcePage]||0)+1,o),{})),[4,4,4,4,4,4,5,5,2,2,2,2,2,2,2,2,2]);
for(const q of B.questions){
 const d=L.derive(q);
 assert(d.steps.length>0);
 if(q.kind==='weight'){
  const m=L.massMap(q.rules);
  assert.equal(q.leftCount*m[q.left],q.answer*m[q.right]);
  for(const s of d.steps)if(s.kind==='replace'){
   assert.equal(L.stateMass(s.before,m),L.stateMass(s.after,m));
   assert.equal(L.stateMass(s.from,m),L.stateMass(s.to,m));
  }
 }else{
  assert.equal(q.target.reduce((v,[id,c])=>v+c*d.values[id],0),q.answer);
 }
}
console.log('PASS: 52 original prompts preserved; 26 main and 26 optional; all math and substitution stages valid.');