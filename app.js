'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

const HOBBIES=[
 {label:'כדורגל',emoji:'⚽'},{label:'כדורסל',emoji:'🏀'},{label:'כדורעף',emoji:'🏐'},
 {label:'טניס',emoji:'🎾'},{label:'שחייה',emoji:'🏊‍♀️'},{label:'אופניים',emoji:'🚲'},
 {label:'ריקוד',emoji:'💃'},{label:'שירה',emoji:'🎤'},{label:'מוזיקה',emoji:'🎸'},
 {label:'אומנות וציור',emoji:'🎨'},{label:'לגו',emoji:'🧱'},{label:'רובלוקס',emoji:'🎮'},
 {label:'מיינקרפט',emoji:'⛏️'},{label:'רובוטיקה',emoji:'🤖'},{label:'מדע',emoji:'🔬'},
 {label:'חלל',emoji:'🚀'},{label:'קריאה',emoji:'📚'},{label:'בישול ואפייה',emoji:'🧁'},
 {label:'חיות',emoji:'🐶'},{label:'חתולים',emoji:'🐱'},{label:'סוסים',emoji:'🐴'},
 {label:'יוניקורן',emoji:'🦄'},{label:'דינוזאורים',emoji:'🦕'},{label:'פרפרים',emoji:'🦋'},
 {label:'שחמט',emoji:'♟️'},{label:'ג׳ודו',emoji:'🥋'}
];
const TRAITS_PRESERVE=[
 {id:'kindness',label:'אדיבות',emoji:'💖'},
 {id:'curiosity',label:'סקרנות',emoji:'🔍'},
 {id:'humor',label:'חוש הומור',emoji:'😄'},
 {id:'responsibility',label:'אחריות',emoji:'🌟'},
 {id:'creativity',label:'יצירתיות',emoji:'🎨'},
 {id:'helping',label:'עזרה לאחרים',emoji:'🤝'},
 {id:'persistence',label:'נחישות',emoji:'💪'},
 {id:'friendship',label:'חברות',emoji:'🫂'}
];
const TRAITS_STRENGTHEN=[
 {id:'confidence',label:'ביטחון עצמי',emoji:'🦁'},
 {id:'perseverance',label:'התמדה',emoji:'🐢'},
 {id:'reading',label:'קריאה',emoji:'📖'},
 {id:'organization',label:'סדר וארגון',emoji:'🗂️'},
 {id:'calm',label:'הרגעה וסבלנות',emoji:'🧘'},
 {id:'trying',label:'לנסות דברים חדשים',emoji:'🚀'},
 {id:'sharing',label:'שיתוף',emoji:'🫶'},
 {id:'listening',label:'הקשבה',emoji:'👂'}
];
const PALETTES={
 rainbow:{name:'קשת 🌈',cards:[['#FFD6E0','#C2456E'],['#FFE9C7','#B87714'],['#FFF7AE','#8A7D00'],['#D8F3DC','#2E7D4F'],['#CDE7FF','#2B62A3'],['#E5DBFF','#6A4FC0']]},
 candy:{name:'ורוד וסגול 💜',cards:[['#FFD9EC','#C0447E'],['#F3D9FF','#8B4FC0'],['#FFE0F0','#C23A6B'],['#EAD9FF','#7A4FB8'],['#FFD3E0','#C2456E'],['#F7E1FF','#9A5BC0']]},
 ocean:{name:'ים 🌊',cards:[['#CDEFFF','#1E7FA8'],['#BDE8F5','#1E88A0'],['#D6F5EF','#1E9078'],['#A8D8FF','#2B62A3'],['#C9F0FF','#2B88A8'],['#B5EAEA','#1E9080']]},
 forest:{name:'יער 🌲',cards:[['#D9F2D0','#3A7D2C'],['#C7ECD4','#2E7D4F'],['#EAF7C0','#7D8F1E'],['#CDEBC5','#3E8D3E'],['#D0F0E0','#2E8D6E'],['#E3F4C9','#6E8D1E']]},
 space:{name:'חלל 🌌',cards:[['#E3DBFF','#6A4FC0'],['#D6E0FF','#4F62C0'],['#F0DBFF','#9A4FC0'],['#CFE3FF','#3A6FC0'],['#E0E5FF','#5A5AC0'],['#EFD9F2','#8A4FA0']]},
 sun:{name:'שמש ☀️',cards:[['#FFF1B8','#A8871E'],['#FFE3A3','#B87714'],['#FFD9B0','#C26A2E'],['#FFECC7','#B89014'],['#FFF6CC','#A89A1E'],['#FFE0C2','#C2792E']]}
};
const GENERAL_EMOJI=['⭐','🌟','💖','🌈','☀️','🎈','🍀','💫','🌸','🦋','🎯','🧸'];

/* Sentence library: {m:'...',f:'...'} or {b:'...'}. {name} and {h} are placeholders. */
const GENERAL=[
 {m:'{name}, אתה מדהים בדיוק כמו שאתה',f:'{name}, את מדהימה בדיוק כמו שאת'},
 {m:'מספיק להשתדל. לא צריך להיות מושלם',f:'מספיק להשתדל. לא צריך להיות מושלמת'},
 {b:'יש בך כוחות שעוד לא גילית'},
 {b:'טעות היא לא סוף העולם. היא דרך ללמוד'},
 {m:'אתה יכול לעשות דברים קשים',f:'את יכולה לעשות דברים קשים'},
 {b:'גאים בך. היום וכל יום'},
 {m:'מי שמנסה כבר מנצח',f:'מי שמנסה כבר מנצחת'},
 {b:'רגע קטן של שמחה. מגיע לך'},
 {b:'החיוך שלך מאיר יום שלם'},
 {m:'כל יום אתה גדל ולומד משהו חדש',f:'כל יום את גדלה ולומדת משהו חדש'},
 {b:'חלום קטן ועוד צעד קטן שווים דרך גדולה'},
 {m:'היום הוא יום טוב להיות אתה',f:'היום הוא יום טוב להיות את'},
 {m:'אתה שווה מיליון!',f:'את שווה מיליון!'},
 {b:'תודה שיש אותך'},
 {b:'גם יום רגיל יכול להפוך ליום מעולה'},
 {m:'אתה מספיק, בדיוק כמו שאתה',f:'את מספיקה, בדיוק כמו שאת'}
];
const GENERAL_YOUNG=[
 {m:'{name}, אתה גיבור על!',f:'{name}, את גיבורת על!'},
 {b:'יום טוב מתחיל בחיוך שלך'}
];
const GENERAL_TEEN=[
 {m:'{name}, אתה יודע מה אתה שווה. אל תשכח את זה',f:'{name}, את יודעת מה את שווה. אל תשכחי את זה'},
 {b:'הקצב שלך הוא הקצב הנכון בשבילך'}
];
const PRESERVE_SENT={
 kindness:[{m:'הטוב שאתה מפזר תמיד חוזר אלייך',f:'הטוב שאת מפזרת תמיד חוזר אלייך'},{b:'הלב הטוב שלך הוא כוח העל שלך'}],
 curiosity:[{m:'תמשיך לשאול שאלות. ככה מגלים עולמות',f:'תמשיכי לשאול שאלות. ככה מגלים עולמות'},{b:'הסקרנות שלך היא סופרפאוור אמיתי'}],
 humor:[{m:'הצחוק שלך מדבק. אל תפסיק אותו',f:'הצחוק שלך מדבק. אל תפסיקי אותו'},{b:'עם ההומור שלך אין רגע משעמם'}],
 responsibility:[{m:'אפשר לסמוך עליך, וזה דבר ענק',f:'אפשר לסמוך עלייך, וזה דבר ענק'},{m:'אתה אחד שסומכים עליו',f:'את אחת שסומכים עליה'}],
 creativity:[{m:'הרעיונות שלך מיוחדים. תמשיך ליצור',f:'הרעיונות שלך מיוחדים. תמשיכי ליצור'},{b:'הדמיון שלך הוא המעבדה הכי טובה שיש'}],
 helping:[{b:'הלב הגדול שלך עושה את העולם טוב יותר'},{m:'כשאתה עוזר לאחרים, אתה עושה קסם',f:'כשאת עוזרת לאחרים, את עושה קסם'}],
 persistence:[{m:'אתה לא מוותר, וזה כוח על',f:'את לא מוותרת, וזה כוח על'},{b:'הנחישות שלך תיקח אותך רחוק'}],
 friendship:[{m:'חבר טוב כמוך הוא מתנה',f:'חברה טובה כמוך היא מתנה'},{m:'אתה יודע איך להיות חבר אמיתי',f:'את יודעת איך להיות חברה אמיתית'}]
};
const STRENGTHEN_SENT={
 confidence:[{m:'תאמין בעצמך כמו שאנחנו מאמינים בך',f:'תאמיני בעצמך כמו שאנחנו מאמינים בך'},{m:'הקול שלך חשוב. תגיד מה שאתה חושב',f:'הקול שלך חשוב. תגידי מה שאת חושבת'}],
 perseverance:[{b:'עוד ניסיון אחד, ואז עוד אחד. ככה מצליחים'},{b:'לא וויתרת? אז עוד לא הפסדת'}],
 reading:[{b:'עמוד אחד ביום, והדמיון פורח'},{b:'ספר טוב הוא חבר לכל החיים'}],
 organization:[{b:'צעד קטן של סדר שווה יום שלם של נחת'},{b:'קצת סדר עכשיו, הרבה פנאי אחר כך'}],
 calm:[{m:'נשום עמוק, תספור עד חמש, ותנסה שוב',f:'נשמי עמוק, תספרי עד חמש, ותנסי שוב'},{m:'ברגע קשה: עצור, נשום, ואז תמשיך',f:'ברגע קשה: עצרי, נשמי, ואז תמשיכי'}],
 trying:[{m:'היום תנסה משהו חדש',f:'היום תנסי משהו חדש'},{b:'הקסם מתחיל צעד אחד מחוץ לאזור הנוח'}],
 sharing:[{b:'כשמשתפים, הכיף מכפיל את עצמו'},{b:'לב שמשתף הוא לב שגדל'}],
 listening:[{m:'מי שמקשיב באמת, שומע גם בין המילים',f:'מי שמקשיבה באמת, שומעת גם בין המילים'},{b:'אוזן קשבת היא כוח על שקט'}]
};
const HOBBY_SENT=[
 {m:'{name}, אלוף העל של {h}',f:'{name}, אלופת העל של {h}'},
 {b:'היום יום מושלם בשביל {h}'},
 {m:'ב{h} אתה מזהיר. תמשיך ככה',f:'ב{h} את מזהירה. תמשיכי ככה'}
];

const state={name:'',gender:'',age:null,hobbies:[],font:'auto',preserve:[],strengthen:[],palette:'rainbow',sigChoice:'love',signature:'אוהבים אותך ❤️',count:16,seed:1};
let stepIdx=0;
const STEPS_TOTAL=10;
function save(){try{localStorage.setItem('kartiseiAl',JSON.stringify(state))}catch(e){}}
function load(){try{const s=JSON.parse(localStorage.getItem('kartiseiAl'));if(s&&typeof s==='object')Object.assign(state,s);state.seed=Date.now()%100000;}catch(e){}}

function render(){
 const app=$('#app');
 if(stepIdx===-1){app.innerHTML=heroHTML();bindHero();return;}
 if(stepIdx===99){app.innerHTML=previewHTML();bindPreview();renderPreviewGrid();renderSheets();return;}
 app.innerHTML=stepHTML(stepIdx);bindStep(stepIdx);
 window.scrollTo({top:0,behavior:'smooth'});
}
function heroHTML(){
 return `<div class="screen active hero">
  <span class="hero-badge">⭐ בחינם · בלי הרשמה · מוכן להדפסה</span>
  <h1>כרטיסי <span class="star">על</span> ⭐</h1>
  <p class="sub">כרטיסיות עידוד אישיות לילדים. עונים על כמה שאלות קצרות, מורידים PDF דו-צדדי ומדפיסים.</p>
  <div class="demo-card"><div class="emo">⭐</div><div class="cname">ליאן,</div><div class="csent">את מדהימה בדיוק כמו שאת</div><div class="csig">אוהבים אותך ❤️</div></div>
  <button class="cta" id="startBtn">מתחילים ✨</button>
  <div class="hero-feats"><span>🖨️ PDF דו-צדדי</span><span>✍️ כתב יד או דפוס</span><span>🎨 6 ערכות צבע</span><span>🔒 בלי שמירת פרטים</span></div>
  <p class="privacy"><b>פרטיות:</b> כל הפרטים נשארים בדפדפן שלך. שום דבר לא נשלח לשום שרת.</p>
 </div>`;
}
function bindHero(){$('#startBtn').onclick=()=>{stepIdx=0;render();}}

function progressHTML(){
 return `<div class="progress-wrap"><div class="progress-top"><span>שאלה ${stepIdx+1} מתוך ${STEPS_TOTAL}</span><span>⭐ כרטיסי על</span></div><div class="progress"><i style="width:${((stepIdx+1)/STEPS_TOTAL)*100}%"></i></div></div>`;
}
function shell(title,hint,inner,canSkip){
 const last=stepIdx===STEPS_TOTAL-1;
 return `<div class="screen active">${progressHTML()}
  <div class="step-card"><h2>${title}</h2>${hint?`<p class="hint">${hint}</p>`:''}${inner}
  <div class="nav-row"><button class="btn-back" id="bBack">→ חזרה</button><button class="btn-next" id="bNext">${last?'יוצרים כרטיסיות! 🎉':'הבא ←'}</button></div>
  ${canSkip?'<button class="skip-link" id="bSkip">אפשר גם בלי, דלגו</button>':''}</div></div>`;
}
function chipList(items,selSet,key){
 return `<div class="chips">${items.map(it=>`<button class="chip${selSet.has(it.label)?' sel':''}" data-k="${key}" data-label="${esc(it.label)}" data-emoji="${it.emoji}" data-id="${it.id||''}">${it.emoji} ${esc(it.label)}</button>`).join('')}</div>`;
}
function addRowHTML(key,ph){
 return `<div class="add-row"><input id="add-${key}" placeholder="${ph}" maxlength="20"><button id="addBtn-${key}">הוספה</button></div>`;
}
function stepHTML(i){
 switch(i){
  case 0: return shell('איך קוראים לילד או לילדה?','השם יופיע על כל כרטיסיה, עם פנייה אישית.',`<input class="big-input" id="inName" maxlength="20" placeholder="למשל: ליאן" value="${esc(state.name)}">`,false);
  case 1: return shell('בת או בן?','כדי שהמשפטים יהיו בדיוק בלשון הנכונה.',`<div class="opt-row"><button class="opt-big${state.gender==='f'?' sel':''}" data-g="f"><span class="o-emo">👧</span>בת</button><button class="opt-big${state.gender==='m'?' sel':''}" data-g="m"><span class="o-emo">👦</span>בן</button></div>`,false);
  case 2: return shell('בן או בת כמה?','המשפטים והעיצוב יותאמו לגיל.',`<div class="age-grid">${Array.from({length:13},(_,k)=>k+4).map(a=>`<button data-age="${a}" class="${state.age===a?'sel':''}">${a}</button>`).join('')}</div>`,false);
  case 3: {
   const sel=new Set(state.hobbies.map(h=>h.label));
   return shell('מה הילד או הילדה אוהבים?','תחביבים, משחקים ודמויות. אפשר לבחור כמה, וגם להוסיף משהו אחר.',chipList(HOBBIES,sel,'hob')+addRowHTML('hob','עוד תחביב...'),true);
  }
  case 4: {
   const rec=state.age!=null&&state.age>=9?'hand':'print';
   if(state.font==='auto')state.font=rec;
   return shell('באיזה כתב נכתוב?','',`<div class="opt-row">
    <button class="opt-big${state.font==='hand'?' sel':''}" data-f="hand"><span style="font-family:var(--font-hand);font-size:34px;display:block;margin-bottom:6px">${esc(state.name||'אגם')},</span>כתב יד${rec==='hand'?'<span class="rec">מומלץ לגיל הזה</span>':''}</button>
    <button class="opt-big${state.font==='print'?' sel':''}" data-f="print"><span style="font-family:var(--font-print);font-size:24px;display:block;margin-bottom:6px">${esc(state.name||'אגם')},</span>דפוס${rec==='print'?'<span class="rec">מומלץ לגיל הזה</span>':''}</button>
   </div>`,false);
  }
  case 5: {
   const sel=new Set(state.preserve.map(t=>t.label));
   return shell('אילו תכונות שמים ורוצים לשמר?','הכרטיסיות יחזקו את מה שכבר יפה בו או בה.',chipList(TRAITS_PRESERVE,sel,'pre')+addRowHTML('pre','תכונה אחרת...'),true);
  }
  case 6: {
   const sel=new Set(state.strengthen.map(t=>t.label));
   return shell('ואילו תכונות רוצים לחזק?','הכרטיסיות יעודדו בדיוק שם.',chipList(TRAITS_STRENGTHEN,sel,'str')+addRowHTML('str','תכונה אחרת...'),true);
  }
  case 7: {
   return shell('איזה צבעים הכי מתאימים?','',`<div class="palette-grid">${Object.entries(PALETTES).map(([k,p])=>`<button class="pal${state.palette===k?' sel':''}" data-p="${k}"><span class="dots">${p.cards.slice(0,4).map(c=>`<i style="background:${c[0]}"></i>`).join('')}</span>${p.name}</button>`).join('')}</div>`,false);
  }
  case 8: {
   return shell('חתימה בתחתית הכרטיסיות?','',`<div class="radio-col">
    <button class="radio-opt${state.sigChoice==='love'?' sel':''}" data-s="love"><span class="r-emo">❤️</span>אוהבים אותך</button>
    <button class="radio-opt${state.sigChoice==='custom'?' sel':''}" data-s="custom"><span class="r-emo">✏️</span>חתימה אחרת</button>
    <button class="radio-opt${state.sigChoice==='none'?' sel':''}" data-s="none"><span class="r-emo">🚫</span>בלי חתימה</button>
   </div><div id="sigCustomWrap" style="margin-top:12px;${state.sigChoice==='custom'?'':'display:none'}"><input class="big-input" id="inSig" maxlength="30" placeholder="למשל: אוהבת אותך, אמא" value="${state.sigChoice==='custom'?esc(state.signature):''}"></div>`,false);
  }
  case 9: {
   return shell('כמה כרטיסיות נכין?','כל דף A4 מכיל 8 כרטיסיות.',`<div class="radio-col">
    <button class="radio-opt${state.count===8?' sel':''}" data-c="8"><span class="r-emo">📄</span>8 כרטיסיות · דף אחד דו-צדדי</button>
    <button class="radio-opt${state.count===16?' sel':''}" data-c="16"><span class="r-emo">📄📄</span>16 כרטיסיות · 2 דפים דו-צדדי</button>
    <button class="radio-opt${state.count===24?' sel':''}" data-c="24"><span class="r-emo">📄📄📄</span>24 כרטיסיות · 3 דפים דו-צדדי</button>
   </div>`,false);
  }
 }
}

function bindStep(i){
 $('#bBack').onclick=()=>{if(stepIdx===0)stepIdx=-1;else stepIdx--;save();render();};
 const skip=$('#bSkip');if(skip)skip.onclick=()=>{stepIdx++;save();render();};
 $('#bNext').onclick=()=>{if(!validateStep(i))return;if(stepIdx===STEPS_TOTAL-1){buildCards();stepIdx=99;}else stepIdx++;save();render();};
 switch(i){
  case 0:{const inp=$('#inName');inp.focus();inp.addEventListener('input',()=>{state.name=inp.value.trim();inp.style.borderColor='';save();});
   inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&validateStep(0)){stepIdx=1;save();render();}});break;}
  case 1:$$('.opt-big').forEach(b=>b.onclick=()=>{state.gender=b.dataset.g;save();render();setTimeout(()=>{stepIdx=2;save();render();},230);});break;
  case 2:$$('[data-age]').forEach(b=>b.onclick=()=>{state.age=+b.dataset.age;save();render();setTimeout(()=>{stepIdx=3;save();render();},230);});break;
  case 3:bindChips('hob',state.hobbies);break;
  case 5:bindChips('pre',state.preserve);break;
  case 6:bindChips('str',state.strengthen);break;
  case 4:$$('[data-f]').forEach(b=>b.onclick=()=>{state.font=b.dataset.f;save();render();setTimeout(()=>{stepIdx=5;save();render();},230);});break;
  case 7:$$('.pal').forEach(b=>b.onclick=()=>{state.palette=b.dataset.p;save();render();setTimeout(()=>{stepIdx=8;save();render();},230);});break;
  case 8:$$('[data-s]').forEach(b=>b.onclick=()=>{state.sigChoice=b.dataset.s;
   if(state.sigChoice==='love')state.signature='אוהבים אותך ❤️';
   if(state.sigChoice==='none')state.signature='';
   if(state.sigChoice==='custom'&&(!state.signature||state.signature==='אוהבים אותך ❤️'))state.signature='';
   save();render();if(state.sigChoice==='custom')setTimeout(()=>$('#inSig').focus(),60);});
   {const si=$('#inSig');if(si)si.addEventListener('input',()=>{state.signature=si.value;si.style.borderColor='';save();});}break;
  case 9:$$('[data-c]').forEach(b=>b.onclick=()=>{state.count=+b.dataset.c;save();render();setTimeout(()=>{buildCards();stepIdx=99;save();render();},230);});break;
 }
}
function bindChips(key,arr){
 $$('.chip[data-k="'+key+'"]').forEach(ch=>ch.onclick=()=>{
  const label=ch.dataset.label;
  const ix=arr.findIndex(x=>x.label===label);
  if(ix>=0){arr.splice(ix,1);ch.classList.remove('sel');}
  else{arr.push({id:ch.dataset.id||('custom:'+label),label,emoji:ch.dataset.emoji||'⭐'});ch.classList.add('sel');}
  save();
 });
 const inp=$('#add-'+key),btn=$('#addBtn-'+key);
 const add=()=>{const v=inp.value.trim();if(!v)return;if(!arr.find(x=>x.label===v))arr.push({id:'custom:'+v,label:v,emoji:'⭐'});inp.value='';save();render();};
 btn.onclick=add;inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();add();}});
}
function validateStep(i){
 if(i===0&&!state.name){const inp=$('#inName');inp.style.borderColor='#E85C3A';inp.focus();return false;}
 if(i===1&&!state.gender)return false;
 if(i===2&&state.age==null)return false;
 if(i===8&&state.sigChoice==='custom'&&!state.signature.trim()){const si=$('#inSig');if(si){si.style.borderColor='#E85C3A';si.focus();}return false;}
 return true;
}

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuffle(arr,rnd){for(let i=arr.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));const t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr}
function pick(arr,rnd){return arr[Math.floor(rnd()*arr.length)]}
function S(t){const g=state.gender;const s=t[g]||t.b||t.m||'';return s.replaceAll('{name}',state.name)}
function allTrait(tr,kind){
 const dict=kind==='pre'?PRESERVE_SENT:STRENGTHEN_SENT;
 if(tr.id&&tr.id.indexOf('custom:')!==0&&dict[tr.id])return dict[tr.id].map(S);
 return [kind==='pre'?'יש בך '+tr.label+' — וזה נפלא':'אתגר קטן להיום: '+tr.label];
}
function buildCards(){
 const rnd=mulberry32(state.seed*97+13);
 const tier=state.age<=8?'young':state.age>=13?'teen':'mid';
 const cand=[];const used=new Set();
 const add=(text,emoji)=>{if(text&&!used.has(text)){used.add(text);cand.push({text,emoji});}};
 shuffle([...state.hobbies],rnd).slice(0,3).forEach(h=>{shuffle([...HOBBY_SENT],rnd).slice(0,2).forEach(t=>add(S(t).replaceAll('{h}',h.label),h.emoji));});
 shuffle([...state.preserve],rnd).forEach(tr=>allTrait(tr,'pre').forEach(t=>add(t,tr.emoji)));
 shuffle([...state.strengthen],rnd).forEach(tr=>allTrait(tr,'str').forEach(t=>add(t,tr.emoji)));
 const gen=[...GENERAL,...(tier==='young'?GENERAL_YOUNG:[]),...(tier==='teen'?GENERAL_TEEN:[])];
 shuffle([...gen],rnd).forEach((t,i)=>add(S(t),GENERAL_EMOJI[i%GENERAL_EMOJI.length]));
 const items=shuffle(cand,rnd).slice(0,state.count);
 let k=0;
 while(items.length<state.count){items.push({text:items[k%items.length].text,emoji:GENERAL_EMOJI[(k+3)%GENERAL_EMOJI.length]});k++;}
 state.cards=items;
}
function frontCardEl(c){
 const d=document.createElement('div');
 d.className='fcard'+(state.font==='hand'?' hand':'');
 d.style.background=c.bg;
 const sig=state.signature?'<div class="g">'+esc(state.signature)+'</div>':'';
 d.innerHTML='<div class="e">'+c.emoji+'</div><div class="n" style="color:'+c.accent+'">'+esc(state.name)+',</div><div class="s">'+esc(c.text)+'</div>'+sig;
 return d;
}
function backCardEl(c){
 const d=document.createElement('div');
 d.className='fcard back';
 d.style.background=c.bg;
 d.innerHTML='<div class="pat">'+'<span>'+c.emoji+'</span>'.repeat(9)+'</div><div class="big">'+c.emoji+'</div><div class="bn">'+esc(state.name)+'</div><div class="brand">כרטיסי על ⭐</div>';
 return d;
}
function makeSheet(cards,back){
 const sheet=document.createElement('div');sheet.className='sheet';
 for(let i=0;i<8;i++){
  const srcIdx=back?(Math.floor(i/2))*2+(1-(i%2)):i;
  const c=cards[srcIdx];
  const cell=document.createElement('div');cell.className='cell';
  cell.appendChild(back?backCardEl(c):frontCardEl(c));
  sheet.appendChild(cell);
 }
 return sheet;
}
function renderSheets(){
 const area=$('#printArea');area.innerHTML='';
 const pal=PALETTES[state.palette].cards;
 state.cardsColored=state.cards.map((c,i)=>Object.assign({},c,{bg:pal[i%pal.length][0],accent:pal[i%pal.length][1]}));
 const chunks=[];for(let i=0;i<state.cardsColored.length;i+=8)chunks.push(state.cardsColored.slice(i,i+8));
 chunks.forEach(ch=>area.appendChild(makeSheet(ch,false)));
 chunks.forEach(ch=>area.appendChild(makeSheet(ch,true)));
}
let pvView='front';
function previewHTML(){
 return '<div class="screen active">'
 +'<div class="done-head"><h2>🎉 הכרטיסיות של '+esc(state.name)+' מוכנות!</h2><p>'+state.count+' כרטיסיות · '+(state.count/8)+' דפים דו-צדדי (A4)</p></div>'
 +'<div class="view-toggle"><button id="vFront" class="on">הכרטיסיות</button><button id="vBack">הגב</button></div>'
 +'<div class="pv-grid" id="pvGrid"></div>'
 +'<div class="action-col">'
 +'<button class="btn-main" id="dlBtn">⬇️ הורדת PDF להדפסה</button>'
 +'<button class="btn-sec" id="prBtn">🖨️ הדפסה ישירה</button>'
 +'<button class="btn-sec" id="shBtn">🎲 ערבוב משפטים</button>'
 +'<button class="btn-sec" id="edBtn">✏️ עריכת הפרטים</button>'
 +'<button class="btn-sec" id="newBtn">➕ כרטיסיות לילד נוסף</button>'
 +'</div>'
 +'<div class="print-tip"><b>איך מדפיסים?</b><br>נייר A4 רגיל או קצת קשיח · איכות גבוהה · קנה מידה 100% (לא "התאמה לעמוד") · דו-צדדי עם היפוך על הצד הארוך. אחר כך גוזרים על הקווים המקווקווים ✂️</div>'
 +'</div>';
}
function bindPreview(){
 $('#dlBtn').onclick=downloadPDF;
 $('#prBtn').onclick=()=>window.print();
 $('#shBtn').onclick=()=>{state.seed++;save();buildCards();renderSheets();renderPreviewGrid();};
 $('#edBtn').onclick=()=>{stepIdx=0;save();render();};
 $('#newBtn').onclick=()=>{Object.assign(state,{name:'',gender:'',age:null,hobbies:[],font:'auto',preserve:[],strengthen:[],palette:'rainbow',sigChoice:'love',signature:'אוהבים אותך ❤️',count:16,seed:Date.now()%100000});stepIdx=0;save();render();};
 $('#vFront').onclick=()=>{pvView='front';renderPreviewGrid();};
 $('#vBack').onclick=()=>{pvView='back';renderPreviewGrid();};
}
function renderPreviewGrid(){
 $('#vFront').classList.toggle('on',pvView==='front');
 $('#vBack').classList.toggle('on',pvView==='back');
 const g=$('#pvGrid');
 g.innerHTML=state.cardsColored.map(c=>pvView==='front'
  ?'<div class="pv-card'+(state.font==='hand'?' hand':'')+'" style="background:'+c.bg+'"><div class="e">'+c.emoji+'</div><div class="n" style="color:'+c.accent+'">'+esc(state.name)+',</div><div class="s">'+esc(c.text)+'</div>'+(state.signature?'<div class="g">'+esc(state.signature)+'</div>':'')+'</div>'
  :'<div class="pv-card back-card" style="background:'+c.bg+'"><div class="be">'+c.emoji+'</div><div class="bn">'+esc(state.name)+'</div></div>').join('');
}
async function downloadPDF(){
 const btn=$('#dlBtn');
 if(!window.jspdf||!window.html2canvas){alert('צריך חיבור לאינטרנט כדי לייצר את ה-PDF');return;}
 btn.disabled=true;const old=btn.textContent;
 try{
  await document.fonts.ready;
  const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4',orientation:'portrait',compress:true});
  const sheets=$$('#printArea .sheet');
  for(let i=0;i<sheets.length;i++){
   btn.textContent='⏳ מכין PDF... '+(i+1)+'/'+sheets.length;
   const canvas=await html2canvas(sheets[i],{scale:2.3,backgroundColor:'#ffffff',useCORS:true,logging:false});
   const img=canvas.toDataURL('image/jpeg',0.92);
   if(i>0)pdf.addPage();
   pdf.addImage(img,'JPEG',0,0,210,297);
  }
  pdf.save('כרטיסי-על-'+state.name+'.pdf');
 }catch(e){alert('משהו השתבש ביצירת ה-PDF. נסו שוב.');}
 btn.disabled=false;btn.textContent=old;
}
load();
stepIdx=-1;
render();
