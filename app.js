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
 {m:'{name}, אתה מספיק בדיוק כמו שאתה. אין צורך להיות מישהו אחר',f:'{name}, את מספיקה בדיוק כמו שאת. אין צורך להיות מישהי אחרת'},
 {b:'טעות היא לא כישלון. היא הדרך ללמוד משהו חדש'},
 {m:'לא חייבים להיות הכי טוב בכול. מספיק שניסית בלב שלם',f:'לא חייבים להיות הכי טובה בכול. מספיק שניסית בלב שלם'},
 {m:'גאים בך. לא בגלל ציונים, בגלל מי שאתה',f:'גאים בך. לא בגלל ציונים, בגלל מי שאת'},
 {b:'גם כשקשה, יש בך כוח. אנחנו יודעים את זה'},
 {b:'לבקש עזרה זה לא חולשה. זה אומץ אמיתי'},
 {m:'מבחן לא קובע מי אתה. אתה הרבה יותר מזה',f:'מבחן לא קובע מי את. את הרבה יותר מזה'},
 {m:'אל תשווה את עצמך לאחרים. לכל אחד יש קצב וכישרון משלו',f:'אל תשווי את עצמך לאחרות. לכל אחת יש קצב וכישרון משלה'},
 {b:'היה יום לא קל? מחר מתחילים דף חדש'},
 {m:'אין עוד אחד בדיוק כמוך. זה כוח העל שלך',f:'אין עוד אחת בדיוק כמוך. זה כוח העל שלך'},
 {m:'תדבר אל עצמך יפה, כמו שהיית מדבר אל חבר טוב',f:'תדברי אל עצמך יפה, כמו שהיית מדברת אל חברה טובה'},
 {b:'אנחנו איתך בכל שעה בכל יום, גם כשאנחנו לא לידך'},
 {m:'כשמשהו לא נעים לך, מותר לעצור ולהגיד לא',f:'כשמשהו לא נעים לך, מותר לעצור ולהגיד לא'},
 {m:'גם ביום עמוס, מותר לעצור לרגע ולעשות משהו שאתה אוהב',f:'גם ביום עמוס, מותר לעצור לרגע ולעשות משהו שאת אוהבת'},
 {m:'טעות היא משהו שקרה, לא מי שאתה',f:'טעות היא משהו שקרה, לא מי שאת'},
 {m:'החיוך שלך מאיר יום שלם. אל תשכח לחייך גם לעצמך',f:'החיוך שלך מאיר יום שלם. אל תשכחי לחייך גם לעצמך'}
];
const GENERAL_YOUNG=[
 {m:'{name}, אתה גיבור על! וכל יום אתה מתחזק עוד קצת',f:'{name}, את גיבורת על! וכל יום את מתחזקת עוד קצת'},
 {b:'יום טוב מתחיל בחיוך שלך. חיוך קטן עובד קסמים גדולים'},
 {m:'כל יום אתה לומד משהו חדש. ככה גדלים להיות גדולים',f:'כל יום את לומדת משהו חדש. ככה גדלים להיות גדולים'}
];
const GENERAL_TEEN=[
 {m:'אתה לא צריך להספיק כמו כולם. הדרך שלך נבנית צעד אחר צעד',f:'את לא צריכה להספיק כמו כולן. הדרך שלך נבנית צעד אחר צעד'},
 {m:'ציון מספר על מבחן אחד, לא על כל מי שאתה',f:'ציון מספר על מבחן אחד, לא על כל מי שאת'},
 {m:'גם אם אתה חושב אחרת, יש מקום לדעה שלך',f:'גם אם את חושבת אחרת, יש מקום לדעה שלך'},
 {m:'אתה ראוי לאהבה ולכבוד, גם כשלא הכול הולך כמו שרצית',f:'את ראויה לאהבה ולכבוד, גם כשלא הכול הולך כמו שרצית'}
];
const PRESERVE_SENT={
 kindness:[{m:'החסד שאתה נותן לאחרים מגיע גם לך. אל תשכח את זה',f:'החסד שאת נותנת לאחרות מגיע גם לך. אל תשכחי את זה'},{b:'מילה טובה או עזרה קטנה שלך יכולות לשנות למישהו את היום'}],
 curiosity:[{m:'תמשיך לשאול שאלות. שאלה טובה פותחת דלתות שלמות',f:'תמשיכי לשאול שאלות. שאלה טובה פותחת דלתות שלמות'},{b:'הסקרנות שלך היא סופרפאוור אמיתי. ככה מגלים עולמות'}],
 humor:[{m:'הצחוק שלך מדבק ומאיר כל חדר. אל תפסיק אותו',f:'הצחוק שלך מדבק ומאיר כל חדר. אל תפסיקי אותו'},{b:'ההומור שלך הוא מתנה. איתו אין רגע משעמם'}],
 responsibility:[{m:'אפשר לסמוך עליך, וזה דבר ענק. זה לא מובן מאליו',f:'אפשר לסמוך עלייך, וזה דבר ענק. זה לא מובן מאליו'},{m:'אתה האחד שכולם סומכים עליו. זו מתנה אמיתית',f:'את האחת שכולם סומכים עליה. זו מתנה אמיתית'}],
 creativity:[{m:'הרעיונות שלך מיוחדים. תמשיך ליצור, העולם צריך אותם',f:'הרעיונות שלך מיוחדים. תמשיכי ליצור, העולם צריך אותם'},{m:'הדמיון שלך הוא מעבדה מדהימה. תמשיך להמציא',f:'הדמיון שלך הוא מעבדה מדהימה. תמשיכי להמציא'}],
 helping:[{m:'כשאתה עוזר לאחרים, אתה עושה קסם אמיתי',f:'כשאת עוזרת לאחרות, את עושה קסם אמיתי'},{b:'הלב הגדול שלך הופך את העולם למקום טוב יותר'}],
 persistence:[{m:'אתה לא מוותר, וזה כוח על שמגיע רחוק',f:'את לא מוותרת, וזה כוח על שמגיע רחוק'},{b:'הנחישות שלך תיקח אותך למקומות שעוד לא דמיינת'}],
 friendship:[{m:'חבר טוב כמוך הוא מתנה. אתה יודע להיות שם בשביל אחרים',f:'חברה טובה כמוך היא מתנה. את יודעת להיות שם בשביל אחרות'},{m:'חברות אמיתית גורמת להרגיש טוב. אתה ראוי לחברות כאלה',f:'חברות אמיתית גורמת להרגיש טוב. את ראויה לחברות כאלה'}]
};
const STRENGTHEN_SENT={
 confidence:[{m:'תאמין בעצמך כמו שאנחנו מאמינים בך. יש לך את כל הסיבות',f:'תאמיני בעצמך כמו שאנחנו מאמינים בך. יש לך את כל הסיבות'},{m:'הקול שלך חשוב. תגיד מה שאתה חושב, יש מקום לדעה שלך',f:'הקול שלך חשוב. תגידי מה שאת חושבת, יש מקום לדעה שלך'}],
 perseverance:[{b:'עוד ניסיון אחד, ואז עוד אחד. ככה נראית הצלחה באמת'},{b:'לא וויתרת? אז עוד לא הפסדת. נקודה'}],
 reading:[{b:'עמוד אחד ביום, והדמיון פורח לכיוונים שלא הכרת'},{m:'ספר טוב הוא חבר לכל החיים. פתח אחד היום',f:'ספר טוב הוא חבר לכל החיים. פתחי אחד היום'}],
 organization:[{b:'צעד קטן של סדר שווה יום שלם של נחת'},{b:'קצת סדר עכשיו, הרבה פנאי אחר כך. שווה את זה'}],
 calm:[{m:'נשום עמוק, תספור עד חמש, ותנסה שוב. אתה יכול',f:'נשמי עמוק, תספרי עד חמש, ותנסי שוב. את יכולה'},{m:'ברגע קשה: עצור, נשום, ואז תמשיך. זה עובד',f:'ברגע קשה: עצרי, נשמי, ואז תמשיכי. זה עובד'}],
 trying:[{m:'לא חייבים להרגיש מוכן לגמרי כדי לנסות משהו חדש',f:'לא חייבים להרגיש מוכנה לגמרי כדי לנסות משהו חדש'},{m:'הקסם מתחיל צעד אחד מחוץ לאזור הנוח. צא לשם',f:'הקסם מתחיל צעד אחד מחוץ לאזור הנוח. צאי לשם'}],
 sharing:[{m:'כשמשתפים, הכיף מכפיל את עצמו. נסה את זה היום',f:'כשמשתפים, הכיף מכפיל את עצמו. נסי את זה היום'},{b:'לב שמשתף הוא לב שגדל. ושלך כבר גדול'}],
 listening:[{m:'מי שמקשיב באמת שומע גם בין המילים, כמוך',f:'מי שמקשיבה באמת שומעת גם בין המילים, כמוך'},{b:'אוזן קשבת היא כוח על שקט שמחבר אנשים'}]
};
const HOBBY_SENT=[
 {m:'{name}, אלוף העל של {h}. כל ניסיון קטן שלך משתלם',f:'{name}, אלופת העל של {h}. כל ניסיון קטן שלך משתלם'},
 {m:'ב{h} אתה מזהיר. כל כך שמח לראות כמה אתה נהנה',f:'ב{h} את מזהירה. כל כך שמח לראות כמה את נהנית',mp:'ב{h} אתה מזהיר. כל כך שמחים לראות כמה אתה נהנה',fp:'ב{h} את מזהירה. כל כך שמחים לראות כמה את נהנית'},
 {b:'היום יום מושלם בשביל {h}. קדימה, לעשות את מה שאוהבים'}
];

const state={name:'',gender:'',age:null,hobbies:[],font:'auto',preserve:[],strengthen:[],palette:'rainbow',backStyle:'decorated',sigChoice:'love',signature:'אוהבים אותך ❤️',count:16,seed:1};
let stepIdx=0;
const STEPS_TOTAL=11;
function save(){try{localStorage.setItem('kartiseiAl',JSON.stringify(state))}catch(e){}}
function load(){try{const s=JSON.parse(localStorage.getItem('kartiseiAl'));if(s&&typeof s==='object')Object.assign(state,s);state.seed=Date.now()%100000;}catch(e){}}

function render(){
 const app=$('#app');
 if(stepIdx===-1){app.innerHTML=heroHTML();bindHero();return;}
 if(stepIdx===99){app.innerHTML=previewHTML();bindPreview();renderSheets();renderPreviewGrid();return;}
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
   return shell('איך ייראה גב הכרטיסיה?','הגב מודפס על הצד השני של הדף.',`<div class="radio-col">
    <button class="radio-opt${state.backStyle==='decorated'?' sel':''}" data-b="decorated"><span class="r-emo">🎨</span>מעוצב · צורות ואימוג׳י בצבע הכרטיסיה</button>
    <button class="radio-opt${state.backStyle==='solid'?' sel':''}" data-b="solid"><span class="r-emo">🟦</span>חלק · רקע אחיד בצבע הכרטיסיה</button>
   </div>`,false);
  }
  case 10: {
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
  case 9:$$('[data-b]').forEach(b=>b.onclick=()=>{state.backStyle=b.dataset.b;save();render();setTimeout(()=>{stepIdx=10;save();render();},230);});break;
  case 10:$$('[data-c]').forEach(b=>b.onclick=()=>{state.count=+b.dataset.c;save();render();setTimeout(()=>{buildCards();stepIdx=99;save();render();},230);});break;
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
function sigIsPlural(){if(state.sigChoice==='love')return true;const s=(state.signature||'').trim();if(!s)return false;return /\sו\S/.test(s)||/(אוהבים|אוהבות|מכולם|משפחה|שניכם|שנינו)/.test(s)}
function S(t){const g=state.gender;let s='';if(sigIsPlural()&&t[g+'p'])s=t[g+'p'];if(!s)s=t[g]||t.b||t.m||'';return s.replaceAll('{name}',state.name)}
function allTrait(tr,kind){
 const dict=kind==='pre'?PRESERVE_SENT:STRENGTHEN_SENT;
 if(tr.id&&tr.id.indexOf('custom:')!==0&&dict[tr.id])return dict[tr.id].map(S);
 const t=kind==='pre'
  ?{m:'יש בך '+tr.label+', וזו מתנה אמיתית. תמשיך לתת לה מקום',f:'יש בך '+tr.label+', וזו מתנה אמיתית. תמשיכי לתת לה מקום'}
  :{m:'אתגר קטן להיום: '+tr.label+'. צעד אחד קטן, ואתה בדרך',f:'אתגר קטן להיום: '+tr.label+'. צעד אחד קטן, ואת בדרך'};
 return [S(t)];
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
function backPattern(c,ix){
 if(state.backStyle==='solid')return '';
 const tier=state.age<=8?'young':state.age>=13?'teen':'mid';
 const glyphs=tier==='young'?['♥','★','●','♦']:tier==='teen'?['✦','★','♥']:['★','♥','✿','●'];
 const rnd=mulberry32(state.seed*31+ix*7+3);
 let out='';
 for(let i=0;i<12;i++){const g=pick(glyphs,rnd);const sz=(4.5+rnd()*5).toFixed(1);out+='<span style="font-size:'+sz+'mm">'+g+'</span>';}
 return '<div class="pat" style="color:'+c.accent+'">'+out+'</div>';
}
function backCardEl(c,ix){
 const d=document.createElement('div');
 d.className='fcard back'+(state.backStyle==='solid'?' solid':'');
 d.style.background=c.bg;
 if(state.backStyle==='solid'){d.innerHTML='<div class="brand">כרטיסי על ⭐</div>';return d;}
 d.innerHTML=backPattern(c,ix||0)+'<div class="big">'+c.emoji+'</div><div class="bn" style="color:'+c.accent+'">'+esc(state.name)+'</div><div class="brand">כרטיסי על ⭐</div>';
 return d;
}
function makeSheet(cards,back){
 const sheet=document.createElement('div');sheet.className='sheet';
 for(let i=0;i<8;i++){
  const srcIdx=back?(Math.floor(i/2))*2+(1-(i%2)):i;
  const c=cards[srcIdx];
  const cell=document.createElement('div');cell.className='cell';
  cell.appendChild(back?backCardEl(c,srcIdx):frontCardEl(c));
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
let pvView='sheets';
function previewHTML(){
 return '<div class="screen active">'
 +'<div class="done-head"><h2>🎉 הכרטיסיות של '+esc(state.name)+' מוכנות!</h2><p>'+state.count+' כרטיסיות · '+(state.count/8)+' דפים דו-צדדי (A4)</p></div>'
 +'<div class="view-toggle"><button id="vSheets" class="on">📄 הדף להדפסה</button><button id="vCards">🃏 כל הכרטיסיות</button></div>'
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
 $('#newBtn').onclick=()=>{Object.assign(state,{name:'',gender:'',age:null,hobbies:[],font:'auto',preserve:[],strengthen:[],palette:'rainbow',sigChoice:'love',signature:'אוהבים אותך ❤️',backStyle:'decorated',count:16,seed:Date.now()%100000});stepIdx=0;save();render();};
 $('#vSheets').onclick=()=>{pvView='sheets';renderPreviewGrid();};
 $('#vCards').onclick=()=>{pvView='cards';renderPreviewGrid();};
}
function renderPreviewGrid(){
 $('#vSheets').classList.toggle('on',pvView==='sheets');
 $('#vCards').classList.toggle('on',pvView==='cards');
 const g=$('#pvGrid');
 if(pvView==='cards'){
  g.className='pv-grid';
  g.innerHTML=state.cardsColored.map(c=>'<div class="pv-card'+(state.font==='hand'?' hand':'')+'" style="background:'+c.bg+'"><div class="e">'+c.emoji+'</div><div class="n" style="color:'+c.accent+'">'+esc(state.name)+',</div><div class="s">'+esc(c.text)+'</div>'+(state.signature?'<div class="g">'+esc(state.signature)+'</div>':'')+'</div>').join('');
  return;
 }
 g.className='pv-sheets';
 const chunks=[];
 for(let i=0;i<state.cardsColored.length;i+=8)chunks.push(state.cardsColored.slice(i,i+8));
 g.innerHTML=chunks.map((ch,ix)=>'<div class="pvA4Label">📄 דף '+(ix+1)+' · צד קדמי</div><div class="pvA4" data-chunk="'+ix+'" data-back="0"></div>'
  +'<div class="pvA4Label">🔄 דף '+(ix+1)+' · הגב · מדפיסים על הצד השני</div><div class="pvA4" data-chunk="'+ix+'" data-back="1"></div>').join('');
 $$('#pvGrid .pvA4').forEach(w=>{
  const sheet=makeSheet(chunks[+w.dataset.chunk],w.dataset.back==='1');
  const inner=document.createElement('div');inner.className='pvA4-scale';inner.appendChild(sheet);
  w.appendChild(inner);
  const sc=w.clientWidth/794;
  inner.style.transform='scale('+sc+')';
  w.style.height=Math.ceil(1123*sc)+'px';
 });
}
async function downloadPDF(){
 const btn=$('#dlBtn');
 if(!window.jspdf||!window.html2canvas){alert('צריך חיבור לאינטרנט כדי לייצר את ה-PDF');return;}
 btn.disabled=true;const old=btn.textContent;
 const area=$('#printArea');
 area.style.cssText='position:absolute;left:0;top:0;z-index:-1';
 try{
  await document.fonts.ready;
  const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4',orientation:'portrait',compress:true});
  const sheets=$$('#printArea .sheet');
  for(let i=0;i<sheets.length;i++){
   btn.textContent='⏳ מכין PDF... '+(i+1)+'/'+sheets.length;
   const canvas=await html2canvas(sheets[i],{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false});
   const img=canvas.toDataURL('image/jpeg',0.9);
   if(i>0)pdf.addPage();
   pdf.addImage(img,'JPEG',0,0,210,297);
   canvas.width=0;canvas.height=0;
   await new Promise(r=>setTimeout(r,80));
  }
  pdf.save('כרטיסי-על-'+state.name+'.pdf');
 }catch(e){alert('משהו השתבש ביצירת ה-PDF. נסו שוב.');}
 area.style.cssText='';
 btn.disabled=false;btn.textContent=old;
}
load();
stepIdx=-1;
render();
