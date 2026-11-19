/* Ngân hàng bài tập chuyển thể theo thứ tự từ 17 trang PDF do phụ huynh cung cấp.
   Các quan hệ mơ hồ được GẮN CỜ rõ ràng, không xem là dữ kiện gốc chắc chắn. */
(function(root){
'use strict';
const items={
 eggplant:['🍆','cà tím'],onion:['🧅','củ hành'],cabbage:['🥬','bắp cải'],
 potato:['🥔','củ khoai'],bokchoy:['🥬','bó rau'],corn:['🌽','bắp ngô'],
 helicopter:['🚁','trực thăng'],car:['🚗','ô tô'],tractor:['🚜','máy kéo'],
 truck:['🚚','xe tải'],taxi:['🚕','ô tô vàng'],scooter:['🛵','xe máy'],
 pear:['🍐','quả lê'],apple:['🍎','quả táo'],orange:['🍊','quả cam'],
 cicada:['🪰','con ve sầu'],bee:['🐝','con ong'],ant:['🐜','con kiến'],
 mango:['🥭','quả xoài'],banana:['🍌','quả chuối'],strawberry:['🍓','quả dâu'],
 sundae:['🍨','ly kem'],donut:['🍩','bánh vòng'],greenApple:['🍏','táo xanh'],
 watermelonSlice:['🍉','miếng dưa hấu'],mangosteen:['🟣','măng cụt'],
 kiwi:['🥝','quả kiwi'],watermelon:['🍉','quả dưa hấu'],
 eraser:['🧱','cục tẩy'],sharpener:['🖍️','đồ gọt bút'],pencil:['✏️','bút chì'],
 basketball:['🏀','bóng rổ'],soccer:['⚽','bóng đá'],volleyball:['🏐','bóng chuyền'],
 crab:['🦀','con cua'],frog:['🐸','con ếch'],squirrel:['🐿️','con sóc'],
 star:['⭐','ngôi sao'],triangle:['🔺','tam giác'],square:['🟩','hình vuông'],
 heart:['💖','trái tim'],smile:['😊','mặt tròn cười'],diamondGreen:['🔶','hình thoi xanh'],
 tree:['🌳','cây xanh'],fruitTree:['🌳','cây có quả'],leaf:['🍃','chiếc lá'],
 grapes:['🍇','chùm nho'],lychee:['🍓','quả vải màu đỏ'],
 lollipop:['🍭','kẹo mút'],candyA:['🍬','kẹo gói màu'],candyB:['🍬','kẹo gói sọc'],
 clock:['🕒','đồng hồ'],gem:['💎','viên kim cương'],ufo:['🛸','đĩa bay'],
 giftYellow:['🎁','quà vàng'],giftBlue:['🎁','quà xanh'],giftDark:['🎁','quà nâu'],
 pyramid:['🔺','khối chóp'],cube:['🟪','khối lập phương'],cylinder:['🥫','khối trụ'],
 chiliRed:['🌶️','ớt đỏ'],chiliGreen:['🌶️','ớt xanh'],chiliYellow:['🌶️','ớt vàng']
};
// p: số trang trong tập PDF, mỗi trang 1-8 tương ứng trang in 35-42.
// rules: [vật A,số A,vật B,số B]. questions: [vật trái,số trái,vật phải,đáp án].
const weightPages=[
 {p:1,title:'Bắp cải – cà tím – hành',rules:[['eggplant',1,'onion',2],['cabbage',1,'onion',4]],questions:[['eggplant',1,'onion',2],['eggplant',2,'onion',4],['cabbage',1,'onion',4],['cabbage',1,'eggplant',2]]},
 {p:2,title:'Khoai – rau – ngô',rules:[['potato',1,'bokchoy',2],['potato',1,'corn',4]],questions:[['potato',1,'bokchoy',2],['potato',1,'corn',4],['bokchoy',2,'corn',4],['bokchoy',1,'corn',2]]},
 {p:3,title:'Trực thăng – ô tô – máy kéo',rules:[['helicopter',1,'car',2],['car',1,'tractor',2]],questions:[['helicopter',1,'car',2],['helicopter',1,'tractor',4],['car',2,'tractor',4],['tractor',2,'car',1]]},
 {p:4,title:'Xe tải – ô tô – xe máy',rules:[['truck',1,'taxi',2],['taxi',1,'scooter',2]],questions:[['truck',1,'taxi',2],['taxi',1,'scooter',2],['taxi',2,'scooter',4],['truck',1,'scooter',4]]},
 {p:5,title:'Lê – táo – cam',rules:[['pear',1,'orange',4],['apple',1,'orange',2]],questions:[['apple',1,'orange',2],['apple',2,'orange',4],['pear',1,'orange',4],['apple',2,'pear',1]]},
 {p:6,title:'Ve sầu – ong – kiến',rules:[['cicada',1,'bee',2],['bee',1,'ant',2]],questions:[['cicada',1,'bee',2],['bee',1,'ant',2],['cicada',1,'ant',4],['cicada',2,'ant',8]]},
 {p:7,title:'Xoài – chuối – dâu',rules:[['mango',1,'banana',2],['mango',2,'strawberry',8]],questions:[['mango',1,'banana',2],['mango',2,'strawberry',8],['mango',1,'strawberry',4],['banana',2,'strawberry',4],['banana',1,'strawberry',2]]},
 {p:8,title:'Cam – kem – bánh vòng',rules:[['sundae',1,'donut',2],['orange',2,'donut',8]],questions:[['sundae',1,'donut',2],['sundae',2,'donut',4],['orange',2,'donut',8],['orange',1,'donut',4],['orange',1,'sundae',2]],
  sourceWarning:'Trang in 42: cân giữa trong bản scan trông có 7 bánh vòng (4 + 3), nhưng chuỗi câu hỏi cần 8 bánh để các đáp án là số nguyên. Phiên bản này dùng 8 bánh là GIẢ ĐỊNH để có thể luyện tập; đề gốc cần phụ huynh xác nhận. Ba câu liên quan quả cam phụ thuộc giả định này.'}
];
// Phần phép tính: mỗi trang có 2 câu (trang in 43-51).
// sum là kết quả của biểu thức terms. Hệ số âm biểu diễn phép trừ.
const mathPages=[
 {p:9, puzzles:[
  {title:'Táo đỏ',eq:[[['apple',2],4]],target:[['apple',1]],answer:2},
  {title:'Táo xanh',eq:[[['greenApple',3],9]],target:[['greenApple',1]],answer:3}]},
 {p:10,puzzles:[
  {title:'Dưa hấu và măng cụt',eq:[[['watermelonSlice',2],4],[['mangosteen',1],3]],target:[['mangosteen',1],['watermelonSlice',1]],answer:5},
  {title:'Xoài và dâu',eq:[[['strawberry',3],6],[['mango',1],5]],target:[['mango',1],['strawberry',1]],answer:7}]},
 {p:11,puzzles:[
  {title:'Dâu và kiwi',eq:[[['strawberry',2],8],[['kiwi',1],4]],target:[['strawberry',1],['kiwi',1]],answer:8},
  {title:'Cam và dưa hấu',eq:[[['orange',3],9],[['watermelon',1],6]],target:[['watermelon',1],['orange',1]],answer:9}]},
 {p:12,puzzles:[
  {title:'Đồ dùng học tập',eq:[[['eraser',2],8],[['sharpener',1],2],[['pencil',1],1]],target:[['eraser',1],['sharpener',1],['pencil',1]],answer:7},
  {title:'Ba loại bóng',eq:[[['basketball',3],6],[['soccer',1],5],[['volleyball',1],1]],target:[['basketball',1],['soccer',1],['volleyball',1]],answer:8}]},
 {p:13,puzzles:[
  {title:'Sóc – cua – ếch',eq:[[['crab',1],['frog',1],7],[['squirrel',1],['crab',1],6],[['squirrel',1],2]],target:[['squirrel',1],['frog',1]],answer:5},
  {title:'Sao – tam giác – vuông',eq:[[['star',1],['triangle',1],9],[['triangle',1],['square',1],5],[['square',1],3]],target:[['star',1],['square',1]],answer:10}]},
 {p:14,puzzles:[
  {title:'Tim – tròn – thoi',eq:[[['heart',3],['smile',-1],0],[['smile',1],['diamondGreen',1],8],[['diamondGreen',1],2]],target:[['heart',1]],answer:2,
   note:'Dòng đầu trong PDF là 3 trái tim = 1 mặt tròn. Ứng dụng biểu diễn tương đương thành 3 tim − mặt tròn = 0.'},
  {title:'Cây và lá',eq:[[['tree',3],['fruitTree',-1],0],[['fruitTree',1],['leaf',1],10],[['leaf',1],1]],target:[['tree',1],['leaf',1]],answer:4,
   note:'Dòng đầu trong PDF là 3 cây thường = 1 cây có quả.'}]},
 {p:15,puzzles:[
  {title:'Chuối – nho – quả đỏ',eq:[[['banana',3],6],[['banana',1],['grapes',2],4],[['grapes',1],['lychee',1],4]],target:[['lychee',1],['banana',1],['grapes',1]],answer:6},
  {title:'Ba loại kẹo',eq:[[['lollipop',3],9],[['lollipop',1],['candyA',2],7],[['candyA',1],['candyB',1],6]],target:[['candyA',1],['lollipop',1],['candyB',1]],answer:9}]},
 {p:16,puzzles:[
  {title:'Đồng hồ – kim cương – đĩa bay',eq:[[['clock',3],3],[['clock',1],['gem',2],7],[['gem',1],['ufo',-1],1]],target:[['gem',1],['clock',1],['ufo',1]],answer:6},
  {title:'Ba hộp quà',eq:[[['giftYellow',3],6],[['giftYellow',1],['giftBlue',2],8],[['giftBlue',1],['giftDark',-1],2]],target:[['giftBlue',1],['giftDark',1],['giftYellow',1]],answer:6}]},
 {p:17,puzzles:[
  {title:'Ba khối hình',eq:[[['pyramid',3],9],[['pyramid',1],['cube',2],7],[['cylinder',1],['pyramid',1],['cube',-1],6]],target:[['cylinder',1],['pyramid',1],['cube',1]],answer:10},
  {title:'Ba loại ớt',eq:[[['chiliRed',3],6],[['chiliRed',1],['chiliGreen',2],10],[['chiliGreen',1],['chiliRed',1],['chiliYellow',-1],3]],target:[['chiliGreen',1],['chiliRed',1],['chiliYellow',1]],answer:9}]}
];
function normalizeEquation(row){const a=row.slice(0,-1);return {terms:a,sum:row[row.length-1]}}
const questions=[];
for(const page of weightPages)for(const q of page.questions){
 const [left,leftCount,right,answer]=q;
 questions.push({id:`p${page.p}-q${questions.filter(x=>x.sourcePage===page.p).length+1}`,
  kind:'weight',sourcePage:page.p,printedPage:page.p+34,title:page.title,
  rules:page.rules,left,leftCount,right,answer,sourceWarning:page.sourceWarning||null});
}
for(const page of mathPages)for(let j=0;j<page.puzzles.length;j++){
 const z=page.puzzles[j];
 questions.push({id:`p${page.p}-q${j+1}`,kind:'math',sourcePage:page.p,printedPage:page.p+34,
 title:z.title,eq:z.eq.map(normalizeEquation),target:z.target,answer:z.answer,note:z.note||null});
}
const output={items,weightPages,mathPages,questions,ROUND_SIZE:5,ROUND_COUNT:Math.ceil(questions.length/5)};
root.GameBank=output;
if(typeof module!=='undefined'&&module.exports)module.exports=output;
})(typeof globalThis!=='undefined'?globalThis:this);