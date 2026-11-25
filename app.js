'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
const RLM='‏';
const LIB=window.SENTENCES;

/* ================= data ================= */
const HOBBIES=[
 {label:'כדורגל',emoji:'⚽'},{label:'כדורסל',emoji:'🏀'},{label:'כדורעף',emoji:'🏐'},
 {label:'טניס',emoji:'🎾'},{label:'שחייה',emoji:'🏊‍♀️'},{label:'אופניים',emoji:'🚲'},
 {label:'ריקוד',emoji:'💃'},{label:'שירה',emoji:'🎤'},{label:'מוזיקה',emoji:'🎸'},
 {label:'אומנות וציור',emoji:'🎨'},{label:'לגו',emoji:'🧱'},{label:'רובלוקס',emoji:'🎮'},
 {label:'מיינקרפט',emoji:'⛏️'},{label:'רובוטיקה',emoji:'🤖'},{label:'מדע',emoji:'🔬'},
 {label:'חלל',emoji:'🚀'},{label:'קריאה',emoji:'📚'},{label:'בישול ואפייה',emoji:'🧁'},
 {label:'חיות',emoji:'🐶'},{label:'חתולים',emoji:'🐱'},{label:'סוסים',emoji:'🐴'},
 {label:'יוניקורן',emoji:'🦄'},{label:'דינוזאורים',emoji:'🦕'},{label:'פרפרים',emoji:'🦋'},
 {label:'שחמט',emoji:'♟️'},{label:'ג׳ודו',emoji:'🥋'},{label:'התעמלות',emoji:'🤸'},
 {label:'תיאטרון',emoji:'🎭'},{label:'צילום',emoji:'📷'},{label:'טיולים בטבע',emoji:'🥾'},
 {label:'פאזלים',emoji:'🧩'}
];
const TRAITS_PRESERVE=[
 {id:'kindness',label:'אדיבות',emoji:'💖'},{id:'curiosity',label:'סקרנות',emoji:'🔍'},
 {id:'humor',label:'חוש הומור',emoji:'😄'},{id:'responsibility',label:'אחריות',emoji:'🌟'},
 {id:'creativity',label:'יצירתיות',emoji:'🎨'},{id:'helping',label:'עזרה לאחרים',emoji:'🤝'},
 {id:'persistence',label:'נחישות',emoji:'💪'},{id:'friendship',label:'חברות',emoji:'🫂'},
 {id:'courage',label:'אומץ',emoji:'🦸'},{id:'optimism',label:'אופטימיות',emoji:'🌞'}
];
const TRAITS_STRENGTHEN=[
 {id:'confidence',label:'ביטחון עצמי',emoji:'🦁'},{id:'perseverance',label:'התמדה',emoji:'🐢'},
 {id:'reading',label:'קריאה',emoji:'📖'},{id:'organization',label:'סדר וארגון',emoji:'🗂️'},
 {id:'calm',label:'הרגעה וסבלנות',emoji:'🧘'},{id:'trying',label:'לנסות דברים חדשים',emoji:'🚀'},
 {id:'sharing',label:'שיתוף',emoji:'🫶'},{id:'listening',label:'הקשבה',emoji:'👂'},
 {id:'independence',label:'עצמאות',emoji:'🎒'},{id:'feelings',label:'לדבר על רגשות',emoji:'💬'}
];
/* situation-themed sentence sets */
const OCCASIONS=[
 {id:'everyday',label:'סתם כי אוהבים',emoji:'💛',desc:'עידוד ליום יום'},
 {id:'hardmorning',label:'בוקר קשה',emoji:'🌤️',desc:'פרידה בבוקר, מצב רוח עצוב'},
 {id:'exam',label:'לפני מבחן',emoji:'✏️',desc:'מבחן, תחרות או הופעה'},
 {id:'newstart',label:'התחלה חדשה',emoji:'🌱',desc:'מעבר דירה, מסגרת חדשה'},
 {id:'schoolyear',label:'שנת לימודים',emoji:'🎒',desc:'כיתה חדשה או גן חדש'},
 {id:'birthday',label:'יום הולדת',emoji:'🎂',desc:'ברכות לשנה החדשה'},
 {id:'journey',label:'דרך צלחה',emoji:'🧳',desc:'טיול, מחנה, נסיעה'},
 {id:'recovery',label:'החלמה מהירה',emoji:'🩹',desc:'מחלה, ניתוח, בית חולים'}
];
const OCC_EMOJI={
 everyday:['⭐','🌟','💖','🌈','☀️','🎈','🍀','💫','🌸','🦋','🎯','🧸'],
 hardmorning:['☀️','🫶','🌤️','💛','🧸','🌈'],exam:['✏️','📚','🍀','💡','🎯','🏆'],
 newstart:['🌱','🗝️','🚪','✨','🌅','🧭'],schoolyear:['🎒','✏️','📏','🍎','📚','🖍️'],
 birthday:['🎂','🎈','🎁','🥳','🎉','🧁'],journey:['🧳','✈️','🗺️','🚌','🏕️','🌍'],
 recovery:['🩹','🍵','🌻','🧸','💐','🌈']
};
const TONES=[
 {id:'mix',label:'מגוון',emoji:'🎨',desc:'קצת מהכול'},
 {id:'w',label:'חם ורך',emoji:'🤗',desc:'חיבוק במילים'},
 {id:'p',label:'שובב ומצחיק',emoji:'😜',desc:'הרבה חיוכים'},
 {id:'e',label:'מעצים ונותן כוח',emoji:'💪',desc:'אומץ וביטחון'}
];
const FONTS=[
 {id:'gveret',kind:'hand',family:'Gveret Levin',nw:400,tw:400,fs:1.3,label:'כתב יד של מורה'},
 {id:'playpen',kind:'hand',family:'Playpen Sans Hebrew',nw:700,tw:400,fs:.92,label:'כתב יד רהוט'},
 {id:'amatic',kind:'hand',family:'Amatic SC',nw:700,tw:700,fs:1.55,label:'טוש דק וגבוה'},
 {id:'karantina',kind:'hand',family:'Karantina',nw:700,tw:400,fs:1.38,label:'טוש עבה'},
 {id:'varela',kind:'print',family:'Varela Round',nw:700,tw:400,fs:1,label:'עגול ורך'},
 {id:'rubik',kind:'print',family:'Rubik',nw:700,tw:500,fs:.98,label:'מודרני ושמח'},
 {id:'fredoka',kind:'print',family:'Fredoka',nw:600,tw:400,fs:1,label:'בועתי וחמוד'},
 {id:'heebo',kind:'print',family:'Heebo',nw:700,tw:300,fs:1.02,label:'נקי ודק'},
 {id:'assistant',kind:'print',family:'Assistant',nw:700,tw:400,fs:1.06,label:'פשוט וקריא'},
 {id:'alef',kind:'print',family:'Alef',nw:700,tw:400,fs:1,label:'ספר ילדים'},
 {id:'secular',kind:'print',family:'Secular One',nw:400,tw:400,fs:.96,label:'כותרת נועזת'},
 {id:'suez',kind:'print',family:'Suez One',nw:400,tw:400,fs:.94,label:'סריף שמנמן'},
 {id:'frank',kind:'print',family:'Frank Ruhl Libre',nw:700,tw:400,fs:1.04,label:'קלאסי ספרותי'},
 {id:'david',kind:'print',family:'David Libre',nw:700,tw:400,fs:1.06,label:'דוד, כמו בספר'},
 {id:'bellefair',kind:'print',family:'Bellefair',nw:400,tw:400,fs:1.1,label:'אלגנטי ועדין'},
 {id:'miriam',kind:'print',family:'Miriam Libre',nw:700,tw:400,fs:.94,label:'מכונת כתיבה'}
];
const FONT_BY=Object.fromEntries(FONTS.map(f=>[f.id,f]));
const PALETTES={
 rainbow:{name:'קשת 🌈',cards:[['#FFD6E0','#C2456E'],['#FFE9C7','#B87714'],['#FFF7AE','#8A7D00'],['#D8F3DC','#2E7D4F'],['#CDE7FF','#2B62A3'],['#E5DBFF','#6A4FC0']]},
 candy:{name:'ורוד וסגול 💜',cards:[['#FFD9EC','#C0447E'],['#F3D9FF','#8B4FC0'],['#FFE0F0','#C23A6B'],['#EAD9FF','#7A4FB8'],['#FFD3E0','#C2456E'],['#F7E1FF','#9A5BC0']]},
 ocean:{name:'ים 🌊',cards:[['#CDEFFF','#1E7FA8'],['#BDE8F5','#1E88A0'],['#D6F5EF','#1E9078'],['#A8D8FF','#2B62A3'],['#C9F0FF','#2B88A8'],['#B5EAEA','#1E9080']]},
 forest:{name:'יער 🌲',cards:[['#D9F2D0','#3A7D2C'],['#C7ECD4','#2E7D4F'],['#EAF7C0','#7D8F1E'],['#CDEBC5','#3E8D3E'],['#D0F0E0','#2E8D6E'],['#E3F4C9','#6E8D1E']]},
 space:{name:'חלל 🌌',cards:[['#E3DBFF','#6A4FC0'],['#D6E0FF','#4F62C0'],['#F0DBFF','#9A4FC0'],['#CFE3FF','#3A6FC0'],['#E0E5FF','#5A5AC0'],['#EFD9F2','#8A4FA0']]},
 sun:{name:'שמש ☀️',cards:[['#FFF1B8','#A8871E'],['#FFE3A3','#B87714'],['#FFD9B0','#C26A2E'],['#FFECC7','#B89014'],['#FFF6CC','#A89A1E'],['#FFE0C2','#C2792E']]}
};
const LAYOUTS={
 std:{label:'רגילות',desc:'8 בדף · 9×6 ס״מ',cols:2,rows:4,w:90,h:60,cg:10,rg:12.33,u:1,maxLen:150},
 big:{label:'גלויות גדולות',desc:'4 בדף · 9.2×13.3 ס״מ',cols:2,rows:2,w:92,h:133,cg:6,rg:11,u:1.32,maxLen:200,grow:1.3},
 mini:{label:'פתקים קטנים',desc:'12 בדף · 6×6.4 ס״מ, לקופסת האוכל',cols:3,rows:4,w:60,h:64,cg:5,rg:7,u:.74,maxLen:105}
};
const perPage=l=>l.cols*l.rows;
const EMOJI_CHOICES=['⭐','💖','🌈','☀️','🎈','🍀','💫','🌸','🦋','🧸','🎯','🦁','🚀','🎨','📚','⚽','🎂','🧳','✏️','🌱','🩹','🫶','✨','🏆'];

/* ================= SVG helpers (all drawn locally) ================= */
function sprig(stem,leaf,flower){
 let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M6 96 Q34 70 52 48 T92 10" stroke="${stem}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
 [[18,84,-20],[30,71,-35],[42,58,-40],[55,44,-45],[67,32,-40],[79,21,-35]].forEach(([x,y,a],i)=>{
  s+=`<ellipse cx="${x-5}" cy="${y-7}" rx="8.5" ry="3.6" fill="${leaf}" transform="rotate(${a-55} ${x-5} ${y-7})"/>`;
  if(i<5)s+=`<ellipse cx="${x+7}" cy="${y+4}" rx="8" ry="3.4" fill="${leaf}" opacity=".8" transform="rotate(${a+25} ${x+7} ${y+4})"/>`;
 });
 if(flower){for(let k=0;k<5;k++){const a=k*72*Math.PI/180;s+=`<circle cx="${(92+6*Math.cos(a)).toFixed(1)}" cy="${(10+6*Math.sin(a)).toFixed(1)}" r="4.6" fill="${flower}"/>`;}s+=`<circle cx="92" cy="10" r="3.4" fill="#F2C14E"/>`;}
 return s+'</svg>';
}
const MOON='<div class="moon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M44.1 10.4A40 40 0 1 0 88.2 61.9A34 34 0 0 1 44.1 10.4Z" fill="#F4C95D"/></svg></div>';
function burst(fill){
 let p='';for(let k=0;k<24;k++){const r=k%2?30:48,a=(k*15-90)*Math.PI/180;p+=(50+r*Math.cos(a)).toFixed(1)+','+(50+r*Math.sin(a)).toFixed(1)+' ';}
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="${p}" fill="${fill}" stroke="#111" stroke-width="3.2" stroke-linejoin="round"/></svg>`;
}

/* ---------- icons: everything on a card is drawn, never taken from the device's emoji font ---------- */
const EMOJI_RE=/(?:\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]{2})(?:️|⃣|[\u{1F3FB}-\u{1F3FF}]|‍(?:\p{Extended_Pictographic}|♀|♂)️?)*/gu;
const SYMBOL_RE=/[←-⯿️‍]/g;
function emoKey(e){return String(e||'').replace(/️/g,'')}
function emo(e){const src=(window.EMOJI_IMG||{})[emoKey(e)];return src?'<img class="emo" src="'+src+'" alt="" draggable="false">':''}
/* escape text; known emoji become images, unknown emoji and stray symbols are dropped */
function rich(t){
 const str=String(t||'');let out='',last=0;EMOJI_RE.lastIndex=0;let m;
 while((m=EMOJI_RE.exec(str))){out+=esc(str.slice(last,m.index).replace(SYMBOL_RE,''));out+=emo(m[0]);last=m.index+m[0].length;}
 return out+esc(str.slice(last).replace(SYMBOL_RE,''));
}
const SHAPES={
 star:'<path d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 18l-6.4 3.4L7 14.3l-5.3-5 7.2-.9z"/>',
 heart:'<path d="M12 21.2S2.2 15 2.2 8.4A5.2 5.2 0 0 1 12 5.6a5.2 5.2 0 0 1 9.8 2.8C21.8 15 12 21.2 12 21.2z"/>',
 flower:'<circle cx="12" cy="5.6" r="4.2"/><circle cx="18.1" cy="10" r="4.2"/><circle cx="15.8" cy="17.2" r="4.2"/><circle cx="8.2" cy="17.2" r="4.2"/><circle cx="5.9" cy="10" r="4.2"/><circle cx="12" cy="12" r="3" fill="#fff" fill-opacity=".55"/>',
 dot:'<circle cx="12" cy="12" r="6.5"/>',
 diamond:'<path d="M12 2l8 10-8 10-8-10z"/>',
 sparkle:'<path d="M12 1c.8 6 4.9 10.2 11 11-6.1.8-10.2 5-11 11-.8-6-4.9-10.2-11-11 6.1-.8 10.2-5 11-11z"/>',
 smile:'<circle cx="12" cy="12" r="9.6" fill="none" stroke-width="2"/><circle cx="8.6" cy="9.6" r="1.4" stroke="none"/><circle cx="15.4" cy="9.6" r="1.4" stroke="none"/><path d="M7.4 14c1.2 2 2.8 3 4.6 3s3.4-1 4.6-3" fill="none" stroke-width="2" stroke-linecap="round"/>',
 pencil:'<path d="M3 21l1.3-5.2L16.6 3.5a2.1 2.1 0 0 1 3 0l.9.9a2.1 2.1 0 0 1 0 3L8.2 19.7z" fill="none" stroke-width="1.9" stroke-linejoin="round"/><path d="M14.6 5.5l3.9 3.9" fill="none" stroke-width="1.9"/>',
 note:'<path d="M9 18.2V5.4l11-2.6v12.6" fill="none" stroke-width="2"/><ellipse cx="6.3" cy="18.4" rx="3.3" ry="2.6"/><ellipse cx="17.3" cy="15.6" rx="3.3" ry="2.6"/>'
};
function shape(name,color){return '<svg class="shp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="'+color+'" stroke="'+color+'">'+SHAPES[name]+'</svg>'}

/* ================= designs ================= */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuffle(arr,rnd){for(let i=arr.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));const t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr}
function pick(arr,rnd){return arr[Math.floor(rnd()*arr.length)]}
/* positions spread around the edge band, away from the text in the middle */
function edgeSpots(n,rnd,band){
 const out=[];band=band||.16;
 for(let i=0;i<n;i++){
  const side=i%4;let x,y;
  if(side===0){x=rnd();y=rnd()*band}else if(side===1){x=rnd();y=1-rnd()*band}
  else if(side===2){x=rnd()*band*.8;y=rnd()}else{x=1-rnd()*band*.8;y=rnd()}
  out.push([(x*100).toFixed(1),(y*100).toFixed(1)]);
 }
 return out;
}
const DESIGNS={
 classic:{name:'קלאסי צבעוני',desc:'רקע פסטל, אימוג׳י גדול',font:'varela',hand:'gveret',palette:true,
  colors:i=>{const p=PALETTES[state.palette]||PALETTES.rainbow;const c=p.cards[i%p.cards.length];return{bg:c[0],ac:c[1],ink:'rgba(0,0,0,.68)',soft:'rgba(0,0,0,.42)',solid:c[0]}},
  front:()=>({deco:''}),
  back:(c,i,rnd)=>{
   const tier=ageTier();const glyphs=tier==='young'?['heart','star','dot','diamond']:tier==='teen'?['sparkle','star','heart']:['star','heart','flower','dot'];
   let out='';for(let k=0;k<12;k++)out+='<span style="font-size:'+(4.5+rnd()*5).toFixed(1)+'em">'+shape(pick(glyphs,rnd),c.ac)+'</span>';
   return '<div class="pat">'+out+'</div><div class="ct"><div class="big">'+emo(c.emoji)+'</div><div class="bn">'+rich(state.name)+'</div><div class="brand">כרטיסי על '+shape('star','#E9B200')+'</div></div>';
  }},
 night:{name:'שמיים זרועי כוכבים',desc:'כחול לילה, זהב וירח',font:'frank',hand:'gveret',
  colors:i=>{const b=[['#1B2350','#33407A'],['#22305E','#3B5590'],['#2A1F4F','#4A3A80'],['#152B45','#2B5070'],['#2B2350','#4B3D7A'],['#1D2B4A','#35507A']][i%6];return{bg:b[0],bg2:b[1],ac:'#F4C95D',ink:'#F4EFDD',soft:'rgba(244,239,221,.62)',solid:b[0]}},
  front:(c,i,rnd)=>{let s='<div class="frame"></div>'+MOON;
   edgeSpots(16,rnd,.1).forEach(([x,y],k)=>{s+='<span class="star" style="left:'+x+'%;top:'+y+'%;font-size:'+(1.4+rnd()*2.4).toFixed(1)+'em;opacity:'+(.45+rnd()*.5).toFixed(2)+'">'+shape('sparkle','#F7E3A6')+'</span>';});
   return{deco:s};},
  back:(c,i,rnd)=>{let s='<div class="frame"></div>';
   for(let k=0;k<44;k++)s+='<span class="star" style="left:'+(rnd()*96+2).toFixed(1)+'%;top:'+(rnd()*96+2).toFixed(1)+'%;font-size:'+(1.2+rnd()*2.8).toFixed(1)+'em;opacity:'+(.35+rnd()*.6).toFixed(2)+'">'+shape(k%3?'sparkle':'dot','#F7E3A6')+'</span>';
   return s+'<div class="ct">'+MOON.replace('class="moon"','class="moon mb"')+'<div class="bn">'+rich(state.name)+'</div></div>';}},
 postcard:{name:'גלויה מטיילת',desc:'מסגרת דואר אוויר ובול',font:'david',hand:'gveret',
  colors:i=>{const a=['#B83227','#1F4E8C','#2E7D4F','#7D3C98','#A4610E','#16697A'][i%6];return{bg:'#FBF4E4',ac:a,ink:'#3B2F2F',soft:'#8A7B6B',solid:'#F3E6CC'}},
  front:(c,i,rnd)=>({hideEmoji:true,deco:'<div class="air"></div><div class="paper"></div><div class="stamp" style="transform:rotate('+((rnd()*6)-1).toFixed(1)+'deg)"><div class="stamp-in" style="background:'+c.ac+'"><span>'+emo(c.emoji)+'</span></div></div><div class="pmark"><i></i><i></i><i></i></div>'}),
  back:(c)=>'<div class="air"></div><div class="paper"></div><div class="pc-line"></div><div class="stamp"><div class="stamp-in" style="background:'+c.ac+'"><span>'+emo(c.emoji)+'</span></div></div><div class="pc-left"><div class="pc-to">אל: '+rich(state.name)+'</div><i></i><i></i><i></i></div><div class="pc-right">באהבה<br>גדולה</div>'},
 notebook:{name:'דף מחברת',desc:'שורות, שוליים וסלוטייפ',font:'alef',hand:'gveret',
  colors:i=>{const a=['#2B5FAE','#C2410C','#15803D','#7C3AED','#BE185D','#0E7490'][i%6];return{bg:'#FFFFFF',ac:a,ink:'#24243A',soft:'#7C7C95',solid:['#EAF1FB','#FDEEE6','#E8F5EC','#F1EBFD','#FBE9F1','#E6F4F7'][i%6]}},
  front:(c,i,rnd)=>({deco:'<div class="lines"></div><div class="margin"></div><div class="margin m2"></div><div class="holes"><i></i><i></i><i></i></div><div class="tape" style="transform:rotate('+(-6+rnd()*12).toFixed(1)+'deg)"></div>'}),
  back:(c,i,rnd)=>{let s='<div class="grid"></div>';const g=['star','heart','flower','smile','pencil','note'];
   edgeSpots(10,rnd,.22).forEach(([x,y])=>{s+='<span class="doodle" style="left:'+x+'%;top:'+y+'%;transform:rotate('+(-25+rnd()*50).toFixed(0)+'deg)">'+shape(pick(g,rnd),c.ac)+'</span>';});
   return s+'<div class="ct"><div class="big">'+emo(c.emoji)+'</div><div class="bn">'+rich(state.name)+'</div></div>';}},
 confetti:{name:'מסיבת קונפטי',desc:'צבעוני, חגיגי ושמח',font:'fredoka',hand:'playpen',
  colors:i=>{const b=[['#FFE3EC','#E0356B'],['#E3F1FF','#1D6FC0'],['#FFF2CF','#C77700'],['#E4F8E6','#1F8A4C'],['#EFE6FF','#6E35D6'],['#FFE7D6','#D5531F']][i%6];return{bg:b[0],ac:b[1],ink:'#2E2433',soft:'rgba(46,36,51,.5)',solid:b[0]}},
  front:(c,i,rnd)=>({deco:'<div class="frame"></div>'+confetti(22,rnd,.1)}),
  back:(c,i,rnd)=>confetti(60,rnd,0)+'<div class="ct"><div class="disc"><span>'+emo(c.emoji)+'</span></div><div class="bn">'+rich(state.name)+'</div></div>'},
 garden:{name:'גן פורח',desc:'ענפים עדינים ומסגרת כפולה',font:'bellefair',hand:'gveret',
  colors:i=>{const b=[['#F6F1E4','#4F7A4A','#E8A0A8'],['#EEF4E8','#5E8A35','#F0B86E'],['#F8EDE6','#9A5A44','#E59A8C'],['#F2EEF6','#6E5488','#C9A0DC'],['#EDF3F1','#3F7F72','#9CC6E6'],['#FAF3E3','#8A6A25','#E7A3A3']][i%6];return{bg:b[0],ac:b[1],fl:b[2],ink:'#3A3A2E',soft:'#8A8A74',solid:b[0]}},
  front:(c)=>{const sp=sprig(c.ac,c.ac,c.fl);return{deco:'<div class="frame"></div><div class="frame2"></div><div class="sprig tl">'+sp+'</div><div class="sprig br">'+sp+'</div>'};},
  back:(c,i,rnd)=>{const sp=sprig(c.ac,c.ac,c.fl);let s='<div class="frame"></div><div class="frame2"></div>';
   [[8,10,0],[70,6,80],[6,62,-80],[72,64,170],[40,0,40],[40,78,210]].forEach(([x,y,r])=>{s+='<div class="sprig sm" style="left:'+x+'%;top:'+y+'%;transform:rotate('+r+'deg)">'+sp+'</div>';});
   return s+'<div class="ct"><div class="bn">'+rich(state.name)+'</div></div>';}},
 comic:{name:'קומיקס',desc:'בועת דיבור, נקודות ובום!',font:'secular',hand:'karantina',
  colors:i=>{const b=[['#FFE34D','#D7192A'],['#6FD3F2','#1B2F8A'],['#FF9CC2','#6A0E80'],['#A6E879','#0B5E2A'],['#FFB75E','#A3200F'],['#CDB3FF','#311483']][i%6];return{bg:b[0],ac:b[1],ink:'#111',soft:'rgba(0,0,0,.55)',solid:b[0]}},
  front:(c)=>({hideEmoji:true,bubble:true,deco:'<div class="dots"></div><div class="frame"></div><div class="burst">'+burst('#fff')+'<span>'+emo(c.emoji)+'</span></div>'}),
  back:(c)=>'<div class="dots"></div><div class="frame"></div><div class="ct"><div class="burst bb">'+burst('#fff')+'<span>'+emo(c.emoji)+'</span></div><div class="bn">'+rich(state.name)+'</div></div>'},
 minimal:{name:'נקי ומודרני',desc:'לבן, פס צבע ומונוגרמה',font:'heebo',hand:'gveret',
  colors:i=>{const a=['#E4572E','#2D6A8F','#3D8B5F','#8E5BB5','#B8901A','#D14D72'][i%6];return{bg:'#FFFFFF',ac:a,ink:'#222',soft:'#8A8A8A',solid:a}},
  front:()=>({hideEmoji:true,rule:true,deco:'<div class="bar"></div><div class="corner"></div>'}),
  back:(c)=>'<div class="ct"><div class="mono">'+esc((state.name||'?').trim().charAt(0))+'</div></div>'}
};
const DESIGN_ORDER=['classic','night','postcard','notebook','confetti','garden','comic','minimal'];
function confetti(n,rnd,band){
 const cols=['#FF4D6D','#FFB703','#3A86FF','#06D6A0','#8338EC','#FB5607','#FF70A6'];let s='';
 const spots=band?edgeSpots(n,rnd,band):Array.from({length:n},()=>[(rnd()*100).toFixed(1),(rnd()*100).toFixed(1)]);
 spots.forEach(([x,y],k)=>{const c=pick(cols,rnd);const r=(rnd()*180).toFixed(0);const t=k%3;
  s+='<i class="cf cf'+t+'" style="left:'+x+'%;top:'+y+'%;background:'+c+';transform:rotate('+r+'deg)"></i>';});
 return s;
}

/* ================= state ================= */
const LOVE_SIG={p:'אוהבים אותך ❤️',ms:'אוהב אותך ❤️',fs:'אוהבת אותך ❤️'};
const DEFAULTS={name:'',gender:'',age:null,occasion:'everyday',tone:'mix',hobbies:[],preserve:[],strengthen:[],design:'classic',palette:'rainbow',font:'auto',sigChoice:'love',signer:'p',signature:LOVE_SIG.p,personal:'',backStyle:'decorated',layout:'std',pages:2};
const FAV_KEYS=['design','palette','font','backStyle','layout','pages','tone','sigChoice','signer','signature'];
const state=JSON.parse(JSON.stringify(DEFAULTS));state.seed=1;
function save(){try{localStorage.setItem('kartiseiAl',JSON.stringify(state))}catch(e){}}
function load(){
 try{const s=JSON.parse(localStorage.getItem('kartiseiAl'));if(s&&typeof s==='object')Object.assign(state,s);}catch(e){}
 migrate(state);state.seed=Date.now()%100000;
}
function migrate(s){
 if(s.font==='hand')s.font='gveret';else if(s.font==='print')s.font='varela';
 if(s.font!=='auto'&&!FONT_BY[s.font])s.font='auto';
 if(!DESIGNS[s.design])s.design='classic';
 if(!PALETTES[s.palette])s.palette='rainbow';
 if(!LAYOUTS[s.layout])s.layout='std';
 if(s.count&&!s.pagesSet){s.pages=Math.max(1,Math.min(3,Math.round(s.count/8)));s.pagesSet=true;delete s.count;}
 if(!['p','ms','fs'].includes(s.signer))s.signer='p';
 if(s.sigChoice==='love')s.signature=LOVE_SIG[s.signer];
 if(!OCCASIONS.find(o=>o.id===s.occasion))s.occasion='everyday';
 if(!TONES.find(t=>t.id===s.tone))s.tone='mix';
 if(!['decorated','solid','none'].includes(s.backStyle))s.backStyle='decorated';
 if(typeof s.personal!=='string')s.personal='';
 ['hobbies','preserve','strengthen'].forEach(k=>{if(!Array.isArray(s[k]))s[k]=[];});
}
function getFav(){try{const f=JSON.parse(localStorage.getItem('kartiseiAl.fav'));return f&&typeof f==='object'&&DESIGNS[f.design]?f:null}catch(e){return null}}
function saveFav(){const f={};FAV_KEYS.forEach(k=>f[k]=state[k]);f.savedAt=Date.now();try{localStorage.setItem('kartiseiAl.fav',JSON.stringify(f));return true}catch(e){return false}}
function applyFav(f){FAV_KEYS.forEach(k=>{if(f[k]!==undefined)state[k]=JSON.parse(JSON.stringify(f[k]));});migrate(state);}
function favSummary(f){const fo=f.font&&FONT_BY[f.font]?FONT_BY[f.font].label:'לפי העיצוב';return DESIGNS[f.design].name+' · '+fo+' · '+LAYOUTS[f.layout||'std'].label}

const ageTier=()=>state.age==null?'mid':state.age<=8?'young':state.age>=13?'teen':'mid';
const design=()=>DESIGNS[state.design]||DESIGNS.classic;
const layout=()=>LAYOUTS[state.layout]||LAYOUTS.std;
function recFont(d){d=d||design();return state.age!=null&&state.age>=9?d.hand:d.font}
function curFont(){return FONT_BY[state.font==='auto'?recFont():state.font]||FONT_BY.varela}

/* ================= wizard ================= */
const STEPS=['name','gender','age','occasion','hobbies','preserve','strengthen','tone','design','font','signature','personal','back','layout'];
let stepIdx=-1;
function render(){
 const app=$('#app');
 if(stepIdx===-1){app.innerHTML=heroHTML();bindHero();bindTools();return;}
 if(stepIdx===99){app.innerHTML=previewHTML();bindPreview();bindTools();renderSheets();renderPreviewGrid();return;}
 app.innerHTML=stepHTML(STEPS[stepIdx]);bindStep(STEPS[stepIdx]);afterStepRender(STEPS[stepIdx]);
 window.scrollTo({top:0,behavior:'smooth'});
}
function heroHTML(){
 const fav=getFav();
 return `<div class="screen active hero">
  <span class="hero-badge">⭐ בחינם · בלי הרשמה · מוכן להדפסה</span>
  <h1>כרטיסי <span class="star">על</span> ⭐</h1>
  <p class="sub">כרטיסיות עידוד אישיות לילדים. עונים על כמה שאלות קצרות, מורידים PDF דו-צדדי ומדפיסים.</p>
  <div class="demo-card"><div class="emo">⭐</div><div class="cname">ליאן,</div><div class="csent">את מספיקה בדיוק כמו שאת.${RLM}</div><div class="csig">אוהבים אותך ❤️</div></div>
  ${fav?`<div class="fav-box"><div class="fav-t">⭐ המועדף שלך</div><div class="fav-d">${esc(favSummary(fav))}</div><button class="cta small" id="favStart">יוצרים עם המועדף</button><button class="link-btn" id="favDel">מחיקת המועדף</button></div>`:''}
  <button class="cta" id="startBtn">${fav?'מתחילים מחדש ✨':'מתחילים ✨'}</button>
  <div class="hero-feats"><span>🖨️ PDF דו-צדדי</span><span>🎨 ${DESIGN_ORDER.length} עיצובים</span><span>✍️ ${FONTS.length} סוגי כתב</span><span>🎂 ${OCCASIONS.length} ערכות לפי מצב</span><span>✏️ עריכת כל משפט</span><span>🔒 הכול נשאר אצלך</span></div>
  <p class="privacy"><b>פרטיות:</b> הכול קורה בתוך הדפדפן. השם, הבחירות והמועדף נשמרים רק במכשיר הזה (כדי שאפשר יהיה להמשיך אחר כך) ולא נשלחים לשום מקום. גם הגופנים ויצירת ה-PDF נטענים מהאתר עצמו, בלי שירותים חיצוניים. כדי למחוק, מנקים את נתוני האתר בדפדפן.</p>
  ${toolsHTML()}
 </div>`;
}
function bindHero(){
 $('#startBtn').onclick=()=>{stepIdx=0;render();};
 const fs=$('#favStart');if(fs)fs.onclick=()=>{resetChild();applyFav(getFav());save();stepIdx=0;render();};
 const fd=$('#favDel');if(fd)fd.onclick=()=>{try{localStorage.removeItem('kartiseiAl.fav')}catch(e){}render();};
}
function resetChild(){Object.assign(state,{name:'',gender:'',age:null,hobbies:[],preserve:[],strengthen:[],personal:'',occasion:'everyday',cards:null,textKey:null,seed:Date.now()%100000});}

function progressHTML(){
 return `<div class="progress-wrap"><div class="progress-top"><span>שאלה ${stepIdx+1} מתוך ${STEPS.length}</span><span>⭐ כרטיסי על</span></div><div class="progress"><i style="width:${((stepIdx+1)/STEPS.length)*100}%"></i></div></div>`;
}
function shell(title,hint,inner,canSkip){
 const last=stepIdx===STEPS.length-1;
 return `<div class="screen active">${progressHTML()}
  <div class="step-card"><h2>${title}</h2>${hint?`<p class="hint">${hint}</p>`:''}${inner}
  <div class="nav-row"><button class="btn-back" id="bBack">→ חזרה</button><button class="btn-next" id="bNext">${last?'יוצרים כרטיסיות! 🎉':'הבא ←'}</button></div>
  ${canSkip?'<button class="skip-link" id="bSkip">אפשר גם בלי, דלגו</button>':''}</div></div>`;
}
function chipList(items,selSet,key){
 return `<div class="chips">${items.map(it=>`<button class="chip${selSet.has(it.label)?' sel':''}" data-k="${key}" data-label="${esc(it.label)}" data-emoji="${it.emoji}" data-id="${it.id||''}">${it.emoji} ${esc(it.label)}</button>`).join('')}</div>`;
}
function customChips(arr,presetList,key){
 const extra=arr.filter(x=>!presetList.find(p=>p.label===x.label));
 return extra.length?`<div class="chips" style="margin-top:9px">${extra.map(x=>`<button class="chip sel" data-k="${key}" data-label="${esc(x.label)}" data-emoji="${x.emoji}" data-id="${esc(x.id)}">${x.emoji} ${esc(x.label)}</button>`).join('')}</div>`:'';
}
function addRowHTML(key,ph){return `<div class="add-row"><input id="add-${key}" placeholder="${ph}" maxlength="20"><button id="addBtn-${key}">הוספה</button></div>`}
function tileGrid(items,selId,attr){
 return `<div class="tile-grid">${items.map(o=>`<button class="tile${selId===o.id?' sel':''}" data-${attr}="${o.id}"><span class="t-emo">${o.emoji}</span><span class="t-lab">${o.label}</span><span class="t-desc">${o.desc}</span></button>`).join('')}</div>`;
}
function stepHTML(id){
 const f=state.gender==='f';
 switch(id){
  case 'name': return shell('איך קוראים לילד או לילדה?','השם יופיע על כל כרטיסיה, עם פנייה אישית.',`<input class="big-input" id="inName" maxlength="20" placeholder="למשל: ליאן" value="${esc(state.name)}">`,false);
  case 'gender': return shell('בת או בן?','כדי שהמשפטים יהיו בדיוק בלשון הנכונה.',`<div class="opt-row"><button class="opt-big${state.gender==='f'?' sel':''}" data-g="f"><span class="o-emo">👧</span>בת</button><button class="opt-big${state.gender==='m'?' sel':''}" data-g="m"><span class="o-emo">👦</span>בן</button></div>`,false);
  case 'age': return shell(state.gender==='f'?'בת כמה?':state.gender==='m'?'בן כמה?':'מה הגיל?','המשפטים והעיצוב יותאמו לגיל.',`<div class="age-grid">${Array.from({length:13},(_,k)=>k+4).map(a=>`<button data-age="${a}" class="${state.age===a?'sel':''}">${a}</button>`).join('')}</div>`,false);
  case 'occasion': return shell('לאיזה מצב הכרטיסיות?','נוסיף ערכת משפטים שמתאימה בדיוק לרגע הזה. אפשר להחליף גם בסוף.',tileGrid(OCCASIONS,state.occasion,'occ'),false);
  case 'hobbies':{const sel=new Set(state.hobbies.map(h=>h.label));
   return shell(f?'מה היא אוהבת?':state.gender==='m'?'מה הוא אוהב?':'מה הילד או הילדה אוהבים?','תחביבים, משחקים ודמויות. אפשר לבחור כמה, וגם להוסיף משהו אחר.',chipList(HOBBIES,sel,'hob')+customChips(state.hobbies,HOBBIES,'hob')+addRowHTML('hob','עוד תחביב...'),true);}
  case 'preserve':{const sel=new Set(state.preserve.map(t=>t.label));
   return shell('אילו תכונות כבר יש ורוצים לשמר?','הכרטיסיות יחזקו את מה שכבר יפה בו או בה.',chipList(TRAITS_PRESERVE,sel,'pre')+customChips(state.preserve,TRAITS_PRESERVE,'pre')+addRowHTML('pre','תכונה אחרת...'),true);}
  case 'strengthen':{const sel=new Set(state.strengthen.map(t=>t.label));
   return shell('ואילו תכונות רוצים לחזק?','הכרטיסיות יעודדו בדיוק שם.',chipList(TRAITS_STRENGTHEN,sel,'str')+customChips(state.strengthen,TRAITS_STRENGTHEN,'str')+addRowHTML('str','תכונה אחרת...'),true);}
  case 'tone': return shell('באיזה טון לכתוב?','המשפטים המתאימים לטון יופיעו ראשונים.',tileGrid(TONES,state.tone,'tone'),false);
  case 'design':{
   const fav=getFav();
   const favBtn=fav&&FAV_KEYS.some(k=>JSON.stringify(fav[k])!==JSON.stringify(state[k]))?`<button class="fav-apply" id="favApply">⭐ להחיל את המועדף שלי (${esc(DESIGNS[fav.design].name)})</button>`:'';
   return shell('איזה עיצוב?','לחיצה על עיצוב מציגה מיד איך ייראו הכרטיסייה והגב שלה.',favBtn+`<div class="live" id="live"></div>
    <div id="palWrap">${design().palette?paletteRow():''}</div>
    <div class="design-grid">${DESIGN_ORDER.map(k=>`<button class="dtile${state.design===k?' sel':''}" data-d="${k}"><div class="dthumb" data-thumb="${k}"></div><b>${DESIGNS[k].name}</b><span>${DESIGNS[k].desc}</span></button>`).join('')}</div>`,false);}
  case 'font':{
   const rec=recFont();const cur=curFont().id;
   const tiles=kind=>FONTS.filter(x=>x.kind===kind).map(x=>`<button class="ftile${cur===x.id?' sel':''}" data-font="${x.id}"><span class="fsample" style="font-family:'${x.family}';font-weight:${x.nw};font-size:${Math.round(25*x.fs)}px">${esc(state.name||'אגם')},</span><span class="fsample2" style="font-family:'${x.family}';font-weight:${x.tw};font-size:${Math.round(15*x.fs)}px">${f?'את מספיקה בדיוק כמו שאת.':'אתה מספיק בדיוק כמו שאתה.'}</span><span class="flabel">${x.label}${rec===x.id?' <em>מומלץ</em>':''}</span></button>`).join('');
   return shell('באיזה כתב נכתוב?','כל הגופנים מוטמעים באתר ועובדים גם בלי אינטרנט וגם ב-PDF.',`<div class="live" id="live"></div><h3 class="grp">✍️ כתב יד</h3><div class="font-grid">${tiles('hand')}</div><h3 class="grp">🔤 דפוס</h3><div class="font-grid">${tiles('print')}</div>`,false);}
  case 'signature': return shell('מי חותם על הכרטיסיות?','המשפטים ייכתבו בגוף המתאים: "אנחנו גאים בך" או "אני גאה בך".',`
   <div class="seg" id="signerSeg"><button data-signer="p" class="${state.signer==='p'?'on':''}">👨‍👩‍👧 אנחנו</button><button data-signer="fs" class="${state.signer==='fs'?'on':''}">👩 אני (אמא, סבתא...)</button><button data-signer="ms" class="${state.signer==='ms'?'on':''}">👨 אני (אבא, סבא...)</button></div>
   <h3 class="grp">ומה כתוב בתחתית?</h3>
   <div class="radio-col">
    <button class="radio-opt${state.sigChoice==='love'?' sel':''}" data-s="love"><span class="r-emo">❤️</span>${LOVE_SIG[state.signer].replace(' ❤️','')}</button>
    <button class="radio-opt${state.sigChoice==='custom'?' sel':''}" data-s="custom"><span class="r-emo">✏️</span>חתימה אחרת</button>
    <button class="radio-opt${state.sigChoice==='none'?' sel':''}" data-s="none"><span class="r-emo">🚫</span>בלי חתימה</button>
   </div><div id="sigCustomWrap" style="margin-top:12px;${state.sigChoice==='custom'?'':'display:none'}"><input class="big-input" id="inSig" maxlength="30" placeholder="${state.signer==='p'?'למשל: אוהבים, אמא ואבא':state.signer==='fs'?'למשל: אוהבת אותך, אמא':'למשל: אוהב אותך, אבא'}" value="${state.sigChoice==='custom'?esc(state.signature):''}"></div>`,false);
  case 'personal': return shell('רוצים להוסיף משפט משלכם?','כל שורה תהפוך לכרטיסייה משלה, ותופיע ראשונה. המשפט נכתב בדיוק כמו שהקלדתם. אפשר לערוך הכול גם בסוף.',`<textarea class="big-area" id="inPersonal" rows="4" maxlength="600" placeholder="למשל: זוכרת איך טיפסת לבד על הסלע הגבוה? ככה בדיוק נראה אומץ.">${esc(state.personal)}</textarea><div class="count-note" id="persNote"></div>`,true);
  case 'back': return shell('איך ייראה גב הכרטיסיה?','הגב מודפס על הצד השני של הדף.',`<div class="back-grid">
    <button class="bopt${state.backStyle==='decorated'?' sel':''}" data-b="decorated"><div class="bthumb" data-bt="decorated"></div><b>🎨 מעוצב</b><span>לפי העיצוב שבחרתם</span></button>
    <button class="bopt${state.backStyle==='solid'?' sel':''}" data-b="solid"><div class="bthumb" data-bt="solid"></div><b>🟦 חלק</b><span>צבע אחיד, בלי שום כיתוב</span></button>
    <button class="bopt${state.backStyle==='none'?' sel':''}" data-b="none"><div class="bthumb" data-bt="none"></div><b>📄 בלי גב</b><span>הדפסה חד-צדדית</span></button>
   </div>`,false);
  case 'layout': return shell('איזה גודל וכמה?','',`<div class="radio-col">${Object.entries(LAYOUTS).map(([k,l])=>`<button class="radio-opt${state.layout===k?' sel':''}" data-l="${k}"><span class="lay-ic" style="grid-template-columns:repeat(${l.cols},1fr)">${'<i></i>'.repeat(perPage(l))}</span><span><b>${l.label}</b><br><small>${l.desc}</small></span></button>`).join('')}</div>
   <h3 class="grp">כמה דפים?</h3><div class="seg" id="pagesSeg">${[1,2,3].map(p=>`<button data-pages="${p}" class="${state.pages===p?'on':''}">${p===1?'דף אחד':p+' דפים'}<br><small>${p*perPage(layout())} כרטיסיות</small></button>`).join('')}</div>`,false);
 }
}
function paletteRow(){return `<div class="pal-row">${Object.entries(PALETTES).map(([k,p])=>`<button class="pal${state.palette===k?' sel':''}" data-p="${k}"><span class="dots">${p.cards.slice(0,4).map(c=>`<i style="background:${c[0]}"></i>`).join('')}</span>${p.name}</button>`).join('')}</div>`}

function advance(delay){setTimeout(()=>{if(stepIdx>=STEPS.length-1){finishWizard();}else stepIdx++;save();render();},delay||230)}
function finishWizard(){buildCards();stepIdx=99;}
function bindStep(id){
 $('#bBack').onclick=()=>{if(stepIdx===0)stepIdx=-1;else stepIdx--;save();render();};
 const skip=$('#bSkip');if(skip)skip.onclick=()=>{if(id==='personal'){state.personal='';}if(stepIdx>=STEPS.length-1)finishWizard();else stepIdx++;save();render();};
 $('#bNext').onclick=()=>{if(!validateStep(id))return;if(stepIdx===STEPS.length-1)finishWizard();else stepIdx++;save();render();};
 switch(id){
  case 'name':{const inp=$('#inName');inp.focus();inp.addEventListener('input',()=>{state.name=inp.value.trim();inp.style.borderColor='';save();});
   inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&validateStep('name')){stepIdx++;save();render();}});break;}
  case 'gender':$$('.opt-big').forEach(b=>b.onclick=()=>{state.gender=b.dataset.g;save();render();advance();});break;
  case 'age':$$('[data-age]').forEach(b=>b.onclick=()=>{state.age=+b.dataset.age;save();render();advance();});break;
  case 'occasion':$$('[data-occ]').forEach(b=>b.onclick=()=>{state.occasion=b.dataset.occ;save();render();advance();});break;
  case 'tone':$$('[data-tone]').forEach(b=>b.onclick=()=>{state.tone=b.dataset.tone;save();render();advance();});break;
  case 'hobbies':bindChips('hob',state.hobbies);break;
  case 'preserve':bindChips('pre',state.preserve);break;
  case 'strengthen':bindChips('str',state.strengthen);break;
  case 'design':
   $$('.dtile').forEach(b=>b.onclick=()=>{state.design=b.dataset.d;save();$$('.dtile').forEach(x=>x.classList.toggle('sel',x===b));$('#palWrap').innerHTML=design().palette?paletteRow():'';bindPal();drawLive();});
   bindPal();
   {const fa=$('#favApply');if(fa)fa.onclick=()=>{applyFav(getFav());save();render();};}
   break;
  case 'font':$$('.ftile').forEach(b=>b.onclick=()=>{state.font=b.dataset.font;save();$$('.ftile').forEach(x=>x.classList.toggle('sel',x===b));drawLive();});break;
  case 'signature':
   $$('[data-signer]').forEach(b=>b.onclick=()=>{state.signer=b.dataset.signer;if(state.sigChoice==='love')state.signature=LOVE_SIG[state.signer];save();render();});
   $$('[data-s]').forEach(b=>b.onclick=()=>{state.sigChoice=b.dataset.s;
    if(state.sigChoice==='love')state.signature=LOVE_SIG[state.signer];
    if(state.sigChoice==='none')state.signature='';
    if(state.sigChoice==='custom'&&Object.values(LOVE_SIG).includes(state.signature))state.signature='';
    save();render();if(state.sigChoice==='custom')setTimeout(()=>$('#inSig').focus(),60);});
   {const si=$('#inSig');if(si)si.addEventListener('input',()=>{state.signature=si.value;si.style.borderColor='';save();});}break;
  case 'personal':{const ta=$('#inPersonal');const upd=()=>{state.personal=ta.value;save();const n=personalLines().length;$('#persNote').textContent=n?('✨ '+n+(n===1?' כרטיסייה אישית':' כרטיסיות אישיות')):'';};ta.addEventListener('input',upd);upd();break;}
  case 'back':$$('[data-b]').forEach(b=>b.onclick=()=>{state.backStyle=b.dataset.b;save();render();advance();});break;
  case 'layout':
   $$('[data-l]').forEach(b=>b.onclick=()=>{state.layout=b.dataset.l;save();render();});
   $$('[data-pages]').forEach(b=>b.onclick=()=>{state.pages=+b.dataset.pages;state.pagesSet=true;save();render();});break;
 }
}
function bindPal(){$$('.pal').forEach(b=>b.onclick=()=>{state.palette=b.dataset.p;save();$$('.pal').forEach(x=>x.classList.toggle('sel',x===b));drawLive();});}
function afterStepRender(id){
 if(id==='design'||id==='font')drawLive();
 if(id==='design')$$('[data-thumb]').forEach(el=>{const k=el.dataset.thumb;mountCard(el,sampleCard(0,k),'front',{design:k,layout:'std'});});
 if(id==='back')$$('[data-bt]').forEach(el=>{const bt=el.dataset.bt;if(bt==='none'){el.innerHTML='<div class="nothumb">צד אחד בלבד</div>';return;}mountCard(el,sampleCard(1),'back',{backStyle:bt,layout:'std'});});
}
function drawLive(){
 const live=$('#live');if(!live)return;
 live.innerHTML='<div class="live-l">תצוגה חיה</div><div class="live-row"><div class="lv" id="lvF"></div><div class="lv" id="lvB"></div></div><div class="live-cap"><span>קדימה</span><span>גב</span></div>';
 const c=sampleCard(0);
 mountCard($('#lvF'),c,'front',{});mountCard($('#lvB'),c,'back',{backStyle:state.backStyle==='none'?'decorated':state.backStyle});
}
function sampleCard(i,dk){
 const d=DESIGNS[dk||state.design];
 if(state.cards&&state.cards[i]&&!dk)return colorize(state.cards[i],i,d);
 const t=[state.occasion!=='everyday'&&LIB.OCCASION[state.occasion]?LIB.OCCASION[state.occasion][0][0]:'{אתה מספיק|את מספיקה} בדיוק כמו {שאתה|שאת}. לא צריך להיות {מישהו אחר|מישהי אחרת} כדי להיות {נפלא|נפלאה}.','גם כשקשה, יש בך כוח גדול יותר ממה {שאתה חושב|שאת חושבת}.'][i%2];
 return colorize({text:tpl(t),emoji:(OCC_EMOJI[state.occasion]||OCC_EMOJI.everyday)[i]},i,d);
}
function bindChips(key,arr){
 $$('.chip[data-k="'+key+'"]').forEach(ch=>ch.onclick=()=>{
  const label=ch.dataset.label;const ix=arr.findIndex(x=>x.label===label);
  if(ix>=0){arr.splice(ix,1);ch.classList.remove('sel');}
  else{arr.push({id:ch.dataset.id||('custom:'+label),label,emoji:ch.dataset.emoji||'⭐'});ch.classList.add('sel');}
  save();
 });
 const inp=$('#add-'+key),btn=$('#addBtn-'+key);
 const add=()=>{const v=inp.value.trim();if(!v)return;if(!arr.find(x=>x.label===v))arr.push({id:'custom:'+v,label:v,emoji:'⭐'});inp.value='';save();render();};
 btn.onclick=add;inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();add();}});
}
function validateStep(id){
 if(id==='name'&&!state.name){const inp=$('#inName');inp.style.borderColor='#E85C3A';inp.focus();return false;}
 if(id==='gender'&&!state.gender)return false;
 if(id==='age'&&state.age==null)return false;
 if(id==='signature'&&state.sigChoice==='custom'&&!state.signature.trim()){const si=$('#inSig');if(si){si.style.borderColor='#E85C3A';si.focus();}return false;}
 return true;
}

/* ================= sentences ================= */
function tpl(s,extra){
 extra=extra||{};const g=state.gender==='f'?1:0;const sg=state.signer;
 s=s.replace(/\{([^{}]*\|[^{}]*)\}/g,(m,a)=>{const p=a.split('|');return p[g]!==undefined?p[g]:p[0];});
 s=s.replace(/\[([^\[\]]*)\]/g,(m,a)=>{const p=a.split('|');if(sg==='p'||p.length===1)return p[0];if(p.length===2)return p[1];return sg==='fs'?p[2]:p[1];});
 return s.replace(/\{h\}/g,extra.h||'').replace(/\{t\}/g,extra.t||'').replace(/\{name\}/g,state.name);
}
function personalLines(){return (state.personal||'').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,8)}
function textKey(){return JSON.stringify([state.name,state.gender,ageTier(),state.occasion,state.tone,state.signer,state.personal,state.layout,state.hobbies.map(h=>h.label),state.preserve.map(h=>h.label),state.strengthen.map(h=>h.label)])}
function targetCount(){return perPage(layout())*state.pages}
function poolFrom(list,emojiFn,extra){
 const tier={young:'Y',mid:'M',teen:'T'}[ageTier()];
 return list.filter(e=>{const tags=e[1]||'';return !/[YMT]/.test(tags)||tags.includes(tier);})
  .map((e,i)=>({text:tpl(e[0],extra),tone:((e[1]||'').match(/[wpe]/)||[''])[0],emoji:emojiFn(i)}));
}
function rankPool(pool,rnd){
 shuffle(pool,rnd);
 const maxLen=layout().maxLen;
 const score=x=>(state.tone!=='mix'?(x.tone===state.tone?0:x.tone?2:1):0)+(x.text.length>maxLen?3:0);
 return pool.map((x,i)=>[score(x),i,x]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(a=>a[2]);
}
function generate(rnd,n,exclude){
 const ex=new Set(exclude||[]);
 const occ=state.occasion!=='everyday'?rankPool(poolFrom(LIB.OCCASION[state.occasion]||[],i=>OCC_EMOJI[state.occasion][i%6]),rnd):[];
 const hob=[];shuffle([...state.hobbies],rnd).slice(0,5).forEach(h=>{
  const list=LIB.HOBBY[h.label]||shuffle([...LIB.HOBBY_ANY],rnd).slice(0,2);
  hob.push(...rankPool(poolFrom(list,()=>h.emoji,{h:h.label}),rnd).slice(0,2));
 });
 const trait=[];
 [['pre',state.preserve,LIB.PRESERVE,LIB.CUSTOM_PRESERVE],['str',state.strengthen,LIB.STRENGTHEN,LIB.CUSTOM_STRENGTHEN]].forEach(([k,arr,dict,custom])=>{
  shuffle([...arr],rnd).forEach(tr=>{const list=dict[tr.id]||custom;trait.push(...rankPool(poolFrom(list,()=>tr.emoji,{t:tr.label}),rnd).slice(0,2));});
 });
 const tier=ageTier();
 const gen=rankPool(poolFrom([...LIB.GENERAL,...(tier==='young'?LIB.YOUNG:tier==='teen'?LIB.TEEN:LIB.MID)],i=>OCC_EMOJI.everyday[i%12]),rnd);
 const out=[];const used=new Set(ex);
 const take=(pool,q)=>{let k=0;for(const x of pool){if(out.length>=n||k>=q)break;if(used.has(x.text))continue;used.add(x.text);out.push(x);k++;}};
 take(occ,state.occasion!=='everyday'?Math.ceil(n*.45):0);
 take(rankPool(hob,rnd),Math.round(n*.22));
 take(rankPool(trait,rnd),Math.round(n*.28));
 take(gen,n);take(occ,n);take(hob,n);take(trait,n);
 shuffle(out,rnd);
 return out.map(x=>({text:x.text,emoji:x.emoji}));
}
function buildCards(force){
 const key=textKey();const target=targetCount();
 const rnd=mulberry32(state.seed*97+13);
 const pers=personalLines().map((t,i)=>({text:t,emoji:['💌','💖','⭐','🌟'][i%4],personal:true}));
 if(!force&&state.cards&&state.textKey===key){
  /* keep the parent's edits; only adjust the amount */
  if(state.cardsTarget!==target){
   if(state.cards.length>target)state.cards=state.cards.slice(0,target);
   else state.cards=state.cards.concat(generate(rnd,target-state.cards.length,state.cards.map(c=>c.text)));
  }
 }else{
  state.cards=pers.concat(generate(rnd,Math.max(0,target-pers.length),pers.map(c=>c.text)));
 }
 let k=0;while(state.cards.length<target){const src=state.cards[k%Math.max(1,state.cards.length)]||{text:'',emoji:'⭐'};state.cards.push({text:src.text,emoji:OCC_EMOJI.everyday[(k+3)%12]});k++;}
 state.textKey=key;state.cardsTarget=target;
}
function reshuffle(){
 state.seed++;const rnd=mulberry32(state.seed*97+13);
 const keep=state.cards.filter(c=>c.edited||c.personal).map(c=>c.text);
 const fresh=generate(rnd,state.cards.length,keep);let f=0;
 state.cards=state.cards.map(c=>(c.edited||c.personal)?c:(fresh[f++]||c));
}

/* ================= card rendering ================= */
function colorize(c,i,d){return Object.assign({},c,(d||design()).colors(i))}
function cardVars(c,font){
 return `--bg:${c.bg};--bg2:${c.bg2||c.bg};--ac:${c.ac};--ink:${c.ink};--soft:${c.soft};--ff:'${font.family}','Rubik',sans-serif;--nw:${font.nw};--tw:${font.tw};--fs:${font.fs}`;
}
function cardEl(c,side,o){
 o=o||{};const dk=o.design||state.design;const d=DESIGNS[dk];const font=o.font||(o.design&&o.design!==state.design&&state.font==='auto'?FONT_BY[recFont(d)]:curFont());
 const lay=LAYOUTS[o.layout||state.layout];
 const el=document.createElement('div');
 const rnd=mulberry32((state.seed||1)*31+(c.idx||0)*7+(side==='back'?5:3));
 el.style.cssText=cardVars(c,font)+';--u:'+lay.u+'mm';el.dataset.grow=lay.grow||1;
 if(side==='back'){
  const bs=o.backStyle||state.backStyle;
  if(bs==='solid'){el.className='fcard f-back solid';el.style.background=c.solid||c.bg;return el;}
  el.className='fcard f-back d-'+dk;el.innerHTML=d.back(c,c.idx||0,rnd);return el;
 }
 const f=d.front(c,c.idx||0,rnd);
 el.className='fcard f-front d-'+dk;
 const sig=state.signature?'<div class="g">'+rich(state.signature)+'</div>':'';
 const s='<div class="s">'+rich(c.text)+RLM+'</div>';
 el.innerHTML=f.deco+'<div class="ct">'+(f.hideEmoji?'':'<div class="e">'+emo(c.emoji)+'</div>')+'<div class="n">'+rich(state.name)+','+RLM+'</div>'+(f.rule?'<div class="rule"></div>':'')+(f.bubble?'<div class="bubble">'+s+'<i class="tail"></i></div>':s)+sig+'</div>';
 return el;
}
/* shrink text until it fits the card (never clip, never overflow) */
function fitCard(card){
 const ct=card.querySelector('.ct');if(!ct||card.classList.contains('solid'))return;
 let f=+(card.dataset.grow||1);card.style.setProperty('--fit',f);
 const n=card.querySelector('.n');if(n)n.style.setProperty('--nfit','1');
 for(let k=0;k<14&&ct.scrollHeight>ct.clientHeight+1;k++){f-=.05;card.style.setProperty('--fit',f.toFixed(2));}
 if(n){let nf=1;for(let k=0;k<14&&n.scrollWidth>n.clientWidth+1;k++){nf-=.06;n.style.setProperty('--nfit',nf.toFixed(2));}}
 const bn=card.querySelector('.bn');if(bn){let nf=1;bn.style.setProperty('--nfit','1');for(let k=0;k<14&&bn.scrollWidth>bn.clientWidth+1;k++){nf-=.06;bn.style.setProperty('--nfit',nf.toFixed(2));}}
}
function fitAll(root){$$('.fcard',root).forEach(fitCard)}
function fontsReady(){
 const f=curFont();
 return Promise.all([document.fonts.load(f.nw+' 20px "'+f.family+'"','אבג'),document.fonts.load(f.tw+' 20px "'+f.family+'"','אבג'),document.fonts.load('400 20px "Rubik"','אבג')]).catch(()=>{}).then(()=>document.fonts.ready);
}
const MM=96/25.4;
function mountCard(host,c,side,o){
 const lay=LAYOUTS[o.layout||state.layout];
 const w=host.clientWidth||140;const sc=w/(lay.w*MM);
 host.innerHTML='';host.style.height=Math.round(lay.h*MM*sc)+'px';
 const inner=document.createElement('div');inner.className='mc-scale';inner.style.cssText='width:'+lay.w+'mm;height:'+lay.h+'mm;transform:scale('+sc+')';
 const el=cardEl(c,side,o);inner.appendChild(el);host.appendChild(inner);
 fitCard(el);fontsReady().then(()=>fitCard(el));
}
function makeSheet(cards,back){
 const lay=layout();
 const sheet=document.createElement('div');sheet.className='sheet';
 sheet.style.cssText='grid-template-columns:repeat('+lay.cols+','+lay.w+'mm);grid-auto-rows:'+lay.h+'mm;column-gap:'+lay.cg+'mm;row-gap:'+lay.rg+'mm';
 for(let r=0;r<lay.rows;r++)for(let col=0;col<lay.cols;col++){
  /* the back is mirrored left-right so it lines up when the page flips on its long edge */
  const idx=back?r*lay.cols+(lay.cols-1-col):r*lay.cols+col;
  const c=cards[idx];
  const cell=document.createElement('div');cell.className='cell'+(c?'':' empty');
  if(c)cell.appendChild(cardEl(c,back?'back':'front'));
  sheet.appendChild(cell);
 }
 return sheet;
}
function chunks(){const pp=perPage(layout());const out=[];for(let i=0;i<state.cardsColored.length;i+=pp)out.push(state.cardsColored.slice(i,i+pp));return out}
function renderSheets(){
 const area=$('#printArea');area.innerHTML='';
 state.cardsColored=state.cards.map((c,i)=>colorize(Object.assign({idx:i},c),i));
 /* page order for duplex printing: front 1, back 1, front 2, back 2 ... */
 chunks().forEach(ch=>{area.appendChild(makeSheet(ch,false));if(state.backStyle!=='none')area.appendChild(makeSheet(ch,true));});
 fitAll(area);fontsReady().then(()=>fitAll(area));
}

/* ================= preview ================= */
let pvView='sheets';
function previewHTML(){
 const pages=Math.ceil(state.cards.length/perPage(layout()));
 const fav=getFav();
 return '<div class="screen active">'
 +'<div class="done-head"><h2>🎉 הכרטיסיות של '+esc(state.name)+' מוכנות!</h2><p id="pvSum">'+summaryText()+'</p></div>'
 +'<div class="sit-row"><label for="sitSel">ערכת משפטים:</label><select id="sitSel">'+OCCASIONS.map(o=>'<option value="'+o.id+'"'+(o.id===state.occasion?' selected':'')+'>'+o.emoji+' '+o.label+'</option>').join('')+'</select></div>'
 +'<div class="view-toggle"><button id="vSheets">📄 הדף להדפסה</button><button id="vCards">🃏 כרטיסיות</button><button id="vEdit">✏️ עריכה</button></div>'
 +'<div id="pvGrid"></div>'
 +'<div class="action-col">'
 +'<button class="btn-main" id="dlBtn">⬇️ הורדת PDF להדפסה</button>'
 +'<button class="btn-sec" id="prBtn">🖨️ הדפסה ישירה</button>'
 +'<button class="btn-sec" id="shBtn">🎲 ערבוב משפטים (המשפטים שערכתם נשארים)</button>'
 +'<button class="btn-sec" id="favBtn">⭐ '+(fav?'עדכון המועדף לעיצוב ולהגדרות האלה':'שמירת העיצוב וההגדרות כמועדף')+'</button>'
 +'<button class="btn-sec" id="edBtn">⚙️ שינוי התשובות</button>'
 +'<button class="btn-sec" id="newBtn">➕ כרטיסיות לילד נוסף</button>'
 +'</div><div class="toast" id="toast"></div>'
 +'<div class="print-tip"><b>איך מדפיסים?</b><br>נייר A4 רגיל או קצת קשיח · איכות גבוהה · קנה מידה 100% (לא "התאמה לעמוד") · '+(state.backStyle==='none'?'הדפסה חד-צדדית.':'דו-צדדי עם היפוך על הצד הארוך.')+' אחר כך גוזרים על הקווים המקווקווים ✂️</div>'
 +toolsHTML()
 +'</div>';
}
function summaryText(){const pages=Math.ceil(state.cards.length/perPage(layout()));return state.cards.length+' כרטיסיות · '+LAYOUTS[state.layout].label+' · '+(pages===1?'דף אחד':pages+' דפים')+(state.backStyle==='none'?' (צד אחד)':' דו-צדדיים')+' · '+design().name}
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('on'),2200);}
function bindPreview(){
 $('#dlBtn').onclick=downloadPDF;
 $('#prBtn').onclick=()=>{fontsReady().then(()=>{fitAll($('#printArea'));window.print();});};
 $('#shBtn').onclick=()=>{reshuffle();save();refreshAll();};
 $('#favBtn').onclick=()=>{if(saveFav()){toast('⭐ נשמר! בפעם הבאה אפשר להתחיל ישר מהמועדף.');$('#favBtn').textContent='⭐ עדכון המועדף לעיצוב ולהגדרות האלה';}};
 $('#edBtn').onclick=()=>{stepIdx=0;save();render();};
 $('#newBtn').onclick=()=>{resetChild();const f=getFav();if(f)applyFav(f);stepIdx=0;save();render();};
 $('#sitSel').onchange=e=>{state.occasion=e.target.value;state.seed++;buildCards();save();refreshAll();};
 $('#vSheets').onclick=()=>{pvView='sheets';renderPreviewGrid();};
 $('#vCards').onclick=()=>{pvView='cards';renderPreviewGrid();};
 $('#vEdit').onclick=()=>{pvView='edit';renderPreviewGrid();};
}
function refreshAll(){renderSheets();renderPreviewGrid();const s=$('#pvSum');if(s)s.textContent=summaryText();}
function renderPreviewGrid(){
 ['Sheets','Cards','Edit'].forEach(k=>$('#v'+k).classList.toggle('on',pvView===k.toLowerCase()));
 const g=$('#pvGrid');
 if(pvView==='edit'){renderEditor(g);return;}
 if(pvView==='cards'){
  g.className='pv-grid';g.innerHTML=state.cardsColored.map((c,i)=>'<div class="pvc" data-i="'+i+'"></div>').join('');
  $$('.pvc',g).forEach(h=>mountCard(h,state.cardsColored[+h.dataset.i],'front',{}));
  return;
 }
 g.className='pv-sheets';
 const ch=chunks();
 g.innerHTML=ch.map((c,ix)=>'<div class="pvA4Label">📄 דף '+(ix+1)+' · צד קדמי</div><div class="pvA4" data-chunk="'+ix+'" data-back="0"></div>'
  +(state.backStyle==='none'?'':'<div class="pvA4Label">🔄 דף '+(ix+1)+' · הגב · מדפיסים על הצד השני</div><div class="pvA4" data-chunk="'+ix+'" data-back="1"></div>')).join('');
 $$('#pvGrid .pvA4').forEach(w=>{
  const sheet=makeSheet(ch[+w.dataset.chunk],w.dataset.back==='1');
  const inner=document.createElement('div');inner.className='pvA4-scale';inner.appendChild(sheet);
  w.appendChild(inner);
  const sc=w.clientWidth/794;inner.style.transform='scale('+sc+')';w.style.height=Math.ceil(1123*sc)+'px';
  fitAll(sheet);fontsReady().then(()=>fitAll(sheet));
 });
}
const MAX_CARDS=48;
function renderEditor(g){
 g.className='editor';
 g.innerHTML='<p class="ed-hint">אפשר לשנות כל משפט, להחליף אימוג׳י בלחיצה, לסדר מחדש או למחוק. הטקסט נשמר כמו שכתבתם.</p>'
  +state.cards.map((c,i)=>'<div class="ed-row" data-i="'+i+'"><span class="ed-num">'+(i+1)+'</span><button class="ed-emo" title="החלפת אימוג׳י">'+emo(c.emoji)+'</button><textarea rows="2" maxlength="220" aria-label="משפט '+(i+1)+'">'+esc(c.text)+'</textarea><div class="ed-btns"><button data-act="up" title="למעלה" '+(i===0?'disabled':'')+'>▲</button><button data-act="down" title="למטה" '+(i===state.cards.length-1?'disabled':'')+'>▼</button><button data-act="del" title="מחיקה">✕</button></div></div>').join('')
  +'<button class="btn-sec" id="edAdd" '+(state.cards.length>=MAX_CARDS?'disabled':'')+'>➕ הוספת כרטיסייה</button>';
 let tmr;
 $$('.ed-row',g).forEach(row=>{
  const i=+row.dataset.i;
  const ta=row.querySelector('textarea');const grow=()=>{ta.style.height='auto';ta.style.height=(ta.scrollHeight+2)+'px';};grow();
  ta.addEventListener('input',e=>{grow();state.cards[i].text=e.target.value;state.cards[i].edited=true;save();clearTimeout(tmr);tmr=setTimeout(renderSheets,350);});
  row.querySelector('.ed-emo').onclick=e=>{const ix=EMOJI_CHOICES.indexOf(state.cards[i].emoji);state.cards[i].emoji=EMOJI_CHOICES[(ix+1)%EMOJI_CHOICES.length];e.currentTarget.innerHTML=emo(state.cards[i].emoji);save();renderSheets();};
  row.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{
   const a=b.dataset.act,arr=state.cards;
   if(a==='up'&&i>0)[arr[i-1],arr[i]]=[arr[i],arr[i-1]];
   if(a==='down'&&i<arr.length-1)[arr[i+1],arr[i]]=[arr[i],arr[i+1]];
   if(a==='del'){if(arr.length<=1)return;arr.splice(i,1);}
   save();refreshAll();
  });
 });
 $('#edAdd').onclick=()=>{state.cards.push({text:'',emoji:'⭐',edited:true});save();refreshAll();const tas=$$('.ed-row textarea');tas[tas.length-1].focus();};
}
async function downloadPDF(){
 const btn=$('#dlBtn');
 if(!window.jspdf||!window.html2canvas){alert('רכיב יצירת ה-PDF לא נטען. נסו לרענן את הדף.');return;}
 btn.disabled=true;const old=btn.textContent;
 const area=$('#printArea');
 area.style.cssText='position:absolute;left:0;top:0;z-index:-1';
 try{
  btn.textContent='⏳ טוען גופנים...';
  await fontsReady();fitAll(area);
  const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4',orientation:'portrait',compress:true});
  const sheets=$$('#printArea .sheet');
  for(let i=0;i<sheets.length;i++){
   btn.textContent='⏳ מכין PDF... '+(i+1)+'/'+sheets.length;
   const canvas=await html2canvas(sheets[i],{scale:2,backgroundColor:'#ffffff',logging:false});
   const img=canvas.toDataURL('image/jpeg',0.92);
   if(i>0)pdf.addPage();
   pdf.addImage(img,'JPEG',0,0,210,297);
   canvas.width=0;canvas.height=0;
   await new Promise(r=>setTimeout(r,60));
  }
  pdf.save('כרטיסי-על-'+state.name+'.pdf');
 }catch(e){console.error(e);alert('משהו השתבש ביצירת ה-PDF. נסו שוב.');}
 area.style.cssText='';
 btn.disabled=false;btn.textContent=old;
}

/* ================= fullscreen & add to home screen ================= */
let installEvt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;refreshTools();});
window.addEventListener('appinstalled',()=>{installEvt=null;refreshTools();});
const UA=navigator.userAgent||'';
const IS_IOS=/iPhone|iPad|iPod/.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const IS_ANDROID=/Android/i.test(UA);
/* installed app = standalone/minimal-ui window, iOS home-screen app, or fullscreen that the page did NOT request
   (Chrome also reports display-mode: fullscreen while the Fullscreen API is active) */
function isStandalone(){
 const mm=m=>window.matchMedia&&matchMedia('(display-mode: '+m+')').matches;
 return mm('standalone')||mm('minimal-ui')||navigator.standalone===true||(mm('fullscreen')&&!fsElement());
}
/* iPhone Safari has no page fullscreen at all, so the button is never offered there */
function fsSupported(){if(/iPhone|iPod/.test(UA))return false;return !!(document.fullscreenEnabled||document.webkitFullscreenEnabled)}
function fsElement(){return document.fullscreenElement||document.webkitFullscreenElement||null}
const ICON_FS='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
const ICON_FS_EXIT='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
const ICON_ADD='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
const ICON_SHARE='<svg class="share-ic" viewBox="0 0 24 24" fill="none" stroke="#1E7BF2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="כפתור השיתוף"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5v10h14V11h-1"/></svg>';
function toolsHTML(){return '<div class="app-tools" id="appTools" hidden><button class="tool-btn" id="fsBtn" hidden></button><button class="tool-btn" id="instBtn" hidden>'+ICON_ADD+'<span>הוספה למסך הבית</span></button></div>'}
function refreshTools(){
 const box=$('#appTools');if(!box)return;
 if(isStandalone()){box.hidden=true;return;}
 const fs=$('#fsBtn'),ib=$('#instBtn');
 fs.hidden=!fsSupported();
 if(!fs.hidden)fs.innerHTML=fsElement()?ICON_FS_EXIT+'<span>יציאה ממסך מלא</span>':ICON_FS+'<span>מסך מלא</span>';
 ib.hidden=false;
 box.hidden=fs.hidden&&ib.hidden;
}
function bindTools(){
 const fs=$('#fsBtn'),ib=$('#instBtn');if(!fs)return;
 fs.onclick=async()=>{
  try{
   if(fsElement()){await (document.exitFullscreen||document.webkitExitFullscreen).call(document);}
   else{const el=document.documentElement;await (el.requestFullscreen||el.webkitRequestFullscreen).call(el,{navigationUI:'hide'});}
  }catch(e){toast('הדפדפן לא אפשר מסך מלא כרגע.');}
  refreshTools();
 };
 ib.onclick=async()=>{
  if(installEvt){const e=installEvt;installEvt=null;try{await e.prompt();await e.userChoice;}catch(err){}refreshTools();return;}
  showInstallSheet();
 };
 refreshTools();
}
function showInstallSheet(){
 let body;
 if(IS_IOS){
  body='<h3>הוספה למסך הבית</h3><ol><li>לוחצים על כפתור השיתוף '+ICON_SHARE+' בסרגל הדפדפן.</li><li>גוללים ובוחרים <b>"הוספה למסך הבית"</b>.</li><li>לוחצים <b>"הוספה"</b>. האייקון של כרטיסי על יופיע במסך הבית.</li></ol><p>ב-iPhone וב-iPad ההוספה נעשית רק ידנית מתפריט השיתוף. אם האפשרות לא מופיעה, פותחים את האתר ב-Safari.</p>';
 }else if(IS_ANDROID){
  body='<h3>הוספה למסך הבית</h3><ol><li>פותחים את תפריט הדפדפן (⋮ או ☰).</li><li>בוחרים <b>"הוספה למסך הבית"</b> או <b>"התקנת אפליקציה"</b>.</li></ol><p>השם המדויק משתנה בין דפדפנים. אם האפשרות לא מופיעה, הדפדפן הזה לא תומך בהוספה, ואפשר לנסות ב-Chrome.</p>';
 }else{
  body='<h3>הוספה כאפליקציה במחשב</h3><p><b>Chrome או Edge:</b> בתפריט הדפדפן בוחרים "התקנת כרטיסי על" (או אייקון ההתקנה בשורת הכתובת), אם האפשרות מופיעה.</p><p><b>Safari ב-Mac:</b> בתפריט "קובץ" בוחרים "הוספה ל-Dock" (macOS Sonoma ומעלה).</p><p><b>Firefox במחשב:</b> אין אפשרות התקנה. אפשר לשמור סימנייה (Ctrl+D).</p>';
 }
 const back=document.createElement('div');back.className='inst-back';back.setAttribute('role','presentation');
 back.innerHTML='<div class="inst-sheet" role="dialog" aria-modal="true" aria-labelledby="sheetT">'+body.replace('<h3>','<h3 id="sheetT">')+'<button class="inst-close" id="sheetClose">הבנתי</button></div>';
 const close=()=>{back.remove();document.removeEventListener('keydown',esc_);ib&&ib.focus();};
 const ib=$('#instBtn');const esc_=e=>{if(e.key==='Escape')close();};
 back.addEventListener('click',e=>{if(e.target===back)close();});
 document.addEventListener('keydown',esc_);
 document.body.appendChild(back);$('#sheetClose').onclick=close;$('#sheetClose').focus();
}
document.addEventListener('fullscreenchange',refreshTools);document.addEventListener('webkitfullscreenchange',refreshTools);
if(window.matchMedia)['standalone','fullscreen','minimal-ui'].forEach(m=>{const q=matchMedia('(display-mode: '+m+')');q.addEventListener&&q.addEventListener('change',refreshTools);});
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
 window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});});
}

window.addEventListener('resize',()=>{clearTimeout(window._rz);window._rz=setTimeout(()=>{if(stepIdx===99&&pvView!=='edit')renderPreviewGrid();else if(stepIdx>=0&&stepIdx<99)afterStepRender(STEPS[stepIdx]);},200);});
load();
stepIdx=-1;
render();
