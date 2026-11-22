/* Manual transcription of the bottom rows of PDF pages 35-42.
   Deliberately independent of source array order and derived answers. */
const assert=require('node:assert/strict');
const B=require('../questions.js'),L=require('../logic.js');
const primary={
  35:['cabbage',1,'eggplant',2],
  36:['bokchoy',1,'corn',2],
  37:['tractor',2,'car',1],
  38:['truck',1,'scooter',4],
  39:['apple',2,'pear',1],
  40:['cicada',2,'ant',8],
  41:['banana',1,'strawberry',2],
  42:['orange',1,'sundae',2]
};
assert.equal(B.questions.length,52);
assert.equal(B.mainQuestions.length,26);
assert.equal(B.extraQuestions.length,26);
assert.equal(B.mainQuestions[0].id,'p1-q4');
assert.equal(B.mainQuestions[1].id,'p2-q4');
assert.equal(B.ROUND_COUNT,6);
for(const [printedPage,row] of Object.entries(primary)){
  const q=B.mainQuestions.find(q=>q.printedPage===Number(printedPage));
  assert(q,`missing page ${printedPage}`);
  assert.deepEqual([q.left,q.leftCount,q.right,q.answer],row,`page ${printedPage}: bottom row of PDF`);
  assert.equal(q.sourceRow,B.weightPages[q.sourcePage-1].questions.length);
  assert.equal(L.derive(q).steps.at(-1).kind,'equation');
}
// The first 8 questions are the last rows of the 8 balance-scale pages.
assert.deepEqual(B.mainQuestions.slice(0,8).map(x=>x.printedPage),[35,36,37,38,39,40,41,42]);
// Remaining: two numerical puzzles per printed page 43-51.
assert.deepEqual(B.mainQuestions.slice(8).map(x=>x.printedPage),[43,43,44,44,45,45,46,46,47,47,48,48,49,49,50,50,51,51]);
for(const q of B.extraQuestions){assert.equal(q.kind,'weight');assert.equal(q.isMain,false);}
assert.equal(B.mainQuestions.filter(q=>q.kind==='math').length,18);
// The source scan at p.42 shows seven donuts; it has been explicitly marked ambiguous.
assert(B.mainQuestions.find(q=>q.printedPage===42).sourceWarning.includes('GIẢ ĐỊNH'));
assert.deepEqual(L.audit(),{count:52,weight:34,math:18,main:26,extra:26,rounds:6,extraRounds:6,hints:328});
console.log('PASS: 8 primary weight prompts match final PDF rows, 18 math puzzles, 26 optional scaffold prompts, 52 total.');