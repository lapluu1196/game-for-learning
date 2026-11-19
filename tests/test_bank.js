const assert=require('node:assert/strict');
const B=require('../questions.js');const L=require('../logic.js');
assert.deepEqual(L.audit(),{count:52,weight:34,math:18,rounds:11,hints:328});
assert.deepEqual(B.questions.slice(0,4).map(q=>q.answer),[2,4,4,2]);
assert.deepEqual(B.questions.filter(q=>q.sourcePage===6).map(q=>q.answer),[2,2,4,8]);
assert.deepEqual(B.questions.filter(q=>q.sourcePage===7).map(q=>q.answer),[2,8,4,4,2]);
assert.deepEqual(B.questions.filter(q=>q.sourcePage===8).map(q=>q.answer),[2,4,8,4,2]);
assert(B.questions.find(q=>q.id==='p8-q5').sourceWarning.includes('GIẢ ĐỊNH'));
assert.equal(new Set(B.questions.map(q=>q.id)).size,52);
for (const q of B.questions){const d=L.derive(q);assert(d.steps.at(-1).kind==='equation'||d.steps.at(-1).kind==='mathFinal');if(q.kind==='weight'){
  const m=L.massMap(q.rules);
  assert.equal(q.leftCount*m[q.left],q.answer*m[q.right]);
  for (const s of d.steps)if(s.kind==='replace'){
    assert.equal(L.stateMass(s.before,m),L.stateMass(s.after,m));
    assert.equal(L.stateMass(s.from,m),L.stateMass(s.to,m));
  }
} else {assert.equal(q.target.reduce((v,[id,c])=>v+c*d.values[id],0),q.answer)} }
const perPage=B.questions.reduce((a,q)=>(a[q.sourcePage]=(a[q.sourcePage]||0)+1,a),{});
assert.deepEqual(Object.values(perPage),[4,4,4,4,4,4,5,5,2,2,2,2,2,2,2,2,2]);
console.log('PASS: 52/52 questions, 17 source pages, 328 valid hint stages, 11 rounds.');