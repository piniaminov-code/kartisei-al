// Checks that cards never need the device's emoji or symbol font.
// Runs in a Chromium that has no emoji font (see bare-browser.js). Serve the repo on :8765, then: node tests/no-system-emoji.js
const {launch}=require('./bare-browser');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1;};
(async()=>{
 const b=await launch(true);const p=await b.newPage({viewport:{width:1280,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto(process.env.URL||'http://localhost:8765/');
 // 1. every emoji the app can put on a card has a bundled image
 const missing=await p.evaluate(()=>{
  const all=[...HOBBIES,...TRAITS_PRESERVE,...TRAITS_STRENGTHEN].map(x=>x.emoji)
   .concat(Object.values(OCC_EMOJI).flat(),EMOJI_CHOICES,['💌','💖','⭐','🌟'],Object.values(LOVE_SIG).join(' ').match(EMOJI_RE));
  return [...new Set(all)].filter(e=>!window.EMOJI_IMG[emoKey(e)]);});
 ok(missing.length===0,'every card emoji has a bundled image '+missing.join(' '));
 // 2. sentence library has no emoji at all
 ok(await p.evaluate(()=>!/\p{Extended_Pictographic}/u.test(JSON.stringify(window.SENTENCES))),'sentence library contains no emoji');
 // 3. render every design, every back, with emoji typed by the parent in the signature, name and an edited card
 const designs=await p.evaluate(()=>DESIGN_ORDER);
 const BAD=/\p{Extended_Pictographic}|[←-⯿️‍\u{1F000}-\u{1FFFF}]/u;
 for(const d of designs)for(const back of ['decorated','solid'])for(const lay of ['std','big','mini']){
  const r=await p.evaluate(async([d,back,lay])=>{
   Object.assign(state,{name:'ליאן ⭐',gender:'f',age:8,occasion:'birthday',design:d,backStyle:back,layout:lay,pages:1,font:'auto',
    signer:'fs',sigChoice:'custom',signature:'אוהבת, סבתא 🌸💕✌️',hobbies:[{label:'ריקוד',emoji:'💃'},{label:'מדע',emoji:'🔬'}],
    preserve:[{id:'kindness',label:'אדיבות',emoji:'💖'}],strengthen:[{id:'calm',label:'הרגעה וסבלנות',emoji:'🧘'}],personal:'',seed:3});
   state.cards=null;buildCards(true);state.cards[1].text='שלום 🦖 גיבורה ✌️❤️!';state.cards[1].edited=true;
   stepIdx=99;render();
   await new Promise(r=>setTimeout(r,250));
   const area=document.querySelector('#printArea');
   const imgs=[...area.querySelectorAll('img')];
   await Promise.all(imgs.map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));
   const w=document.createTreeWalker(area,NodeFilter.SHOW_TEXT);const bad=[];let n;
   while((n=w.nextNode())){if(/\p{Extended_Pictographic}|[←-⯿️‍\u{1F000}-\u{1FFFF}]/u.test(n.nodeValue))bad.push(n.nodeValue);}
   return {bad,imgs:imgs.length,broken:imgs.filter(i=>!i.naturalWidth).length,cards:area.querySelectorAll('.fcard').length};
  },[d,back,lay]);
  ok(r.bad.length===0&&r.broken===0&&r.cards>0,`${d}/${back}/${lay}: ${r.cards} cards, ${r.imgs} icons, no emoji/symbol text${r.bad.length?' BAD: '+r.bad.join(' | '):''}${r.broken?' broken images '+r.broken:''}`);
 }
 // 4. typed emoji: known ones become images, unknown ones are dropped
 const t=await p.evaluate(()=>{const h=document.createElement('div');h.innerHTML=rich('שלום 🦖 ❤️ 🌸!');return{text:h.textContent,imgs:h.querySelectorAll('img').length}});
 ok(t.imgs===2&&!BAD.test(t.text),'typed emoji: known become images, unknown are dropped ('+JSON.stringify(t.text)+')');
 ok(errs.length===0,'no console errors '+errs.join(' | '));
 await b.close();
})();
