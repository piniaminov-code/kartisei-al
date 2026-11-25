// End-to-end checks at phone and desktop sizes. Serve the repo root on :8765 first, e.g. `python3 -m http.server 8765`, then `node tests/e2e.js`.
const {chromium,devices}=require('playwright');const fs=require('fs');const os=require('os');const path=require('path');
const TMP=fs.mkdtempSync(path.join(os.tmpdir(),'kartisei-'));
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1;};
async function run(name,ctxOpts){
 const b=await chromium.launch();const ctx=await b.newContext({...ctxOpts,acceptDownloads:true});const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const ext=[];p.on('request',r=>{if(!r.url().startsWith('http://localhost')&&!r.url().startsWith('data:'))ext.push(r.url())});
 await p.goto('http://localhost:8765/');
 const noHScroll=async(tag)=>{const w=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);ok(w<=0,name+' no horizontal scroll '+tag+' ('+w+')');};
 await noHScroll('hero');
 await p.click('#startBtn');await p.fill('#inName','יואב');await p.click('#bNext');
 await p.click('[data-g=m]');await p.waitForTimeout(350);await p.click('[data-age="7"]');await p.waitForTimeout(350);
 await p.click('[data-occ=hardmorning]');await p.waitForTimeout(350);
 await p.click('[data-label="לגו"]');await p.fill('#add-hob','קפיצה על טרמפולינה');await p.click('#addBtn-hob');await p.click('#bNext');
 await p.click('#bNext');await p.click('#bSkip');
 await p.click('[data-tone=p]');await p.waitForTimeout(350);
 await noHScroll('design');
 await p.click('[data-d=comic]');await p.waitForTimeout(300);
 ok(await p.locator('#lvF .d-comic').count()===1,name+' live preview follows design');
 await p.screenshot({path:TMP+'/'+name+'-design.png',fullPage:true});
 await p.click('#bNext');await p.click('[data-font=fredoka]');await p.waitForTimeout(300);
 ok((await p.locator('#lvF .fcard').getAttribute('style')).includes('Fredoka'),name+' live preview follows font');
 await noHScroll('font');
 await p.click('#bNext');
 await p.click('[data-signer=fs]');await p.click('[data-s=custom]');await p.fill('#inSig','אוהבת, סבתא רותי');await p.click('#bNext');
 await p.fill('#inPersonal','זוכר איך בנית לבד את המגדל הכי גבוה?\nאתה הנכד הכי מתוק שיש!');await p.click('#bNext');
 await p.click('[data-b=solid]');await p.waitForTimeout(400);
 await p.click('[data-l=mini]');await p.click('[data-pages="1"]');await p.click('#bNext');await p.waitForTimeout(1000);
 await noHScroll('preview');
 const st=await p.evaluate(()=>({n:state.cards.length,c0:state.cards[0].text,c1:state.cards[1].text,texts:state.cards.map(c=>c.text)}));
 ok(st.n===12,name+' mini layout 1 page = 12 cards ('+st.n+')');
 ok(st.c0.startsWith('זוכר איך')&&st.c1.startsWith('אתה הנכד'),name+' personal lines first');
 ok(!st.texts.some(t=>/אנחנו|לנו\b|מאיתנו/.test(t)),name+' single signer: no plural "we" forms');
 ok(st.texts.some(t=>t.includes('טרמפולינה')),name+' custom hobby used');
 ok(new Set(st.texts).size===st.texts.length,name+' no duplicate sentences');
 // solid back really plain
 const solid=await p.evaluate(()=>[...document.querySelectorAll('#printArea .f-back')].every(e=>e.classList.contains('solid')&&e.innerHTML===''&&e.innerText===''));
 ok(solid,name+' plain back has no content at all');
 // page order front/back interleaved
 await p.evaluate(()=>{state.backStyle='decorated';state.layout='std';state.pages=2;buildCards();refreshAll();});
 const order=await p.evaluate(()=>[...document.querySelectorAll('#printArea .sheet')].map(s=>s.querySelector('.fcard').classList.contains('f-back')?'B':'F').join(''));
 ok(order==='FBFB',name+' duplex page order '+order);
 // back mirroring: first back cell shows card index 1
 // editor
 await p.click('#vEdit');await p.waitForTimeout(200);
 const ta=p.locator('.ed-row textarea').nth(2);await ta.fill('משפט שכתבתי בעצמי!');await p.waitForTimeout(500);
 ok(await p.evaluate(()=>state.cards[2].text==='משפט שכתבתי בעצמי!'&&state.cards[2].edited),name+' inline edit saved');
 ok(await p.evaluate(()=>document.querySelector('#printArea').innerText.includes('משפט שכתבתי בעצמי!')),name+' edit reaches print sheets');
 const before=await p.evaluate(()=>state.cards.map(c=>c.text));
 await p.locator('.ed-row').nth(2).locator('[data-act=up]').click();
 ok(await p.evaluate(()=>state.cards[1].text==='משפט שכתבתי בעצמי!'),name+' reorder up');
 await p.locator('.ed-row').nth(0).locator('[data-act=down]').click();
 ok(await p.evaluate(()=>state.cards[1].text.startsWith('זוכר איך')),name+' reorder down');
 const n0=await p.evaluate(()=>state.cards.length);
 await p.locator('.ed-row').nth(5).locator('[data-act=del]').click();
 ok(await p.evaluate(n=>state.cards.length===n-1,n0),name+' delete card');
 await p.click('#edAdd');await p.locator('.ed-row textarea').last().fill('כרטיסייה חדשה שהוספתי.');await p.waitForTimeout(500);
 ok(await p.evaluate(n=>state.cards.length===n&&state.cards[n-1].text==='כרטיסייה חדשה שהוספתי.',n0),name+' add card');
 await p.locator('.ed-emo').first().click();
 await p.screenshot({path:TMP+'/'+name+'-editor.png',fullPage:true});
 // shuffle keeps edits
 await p.click('#shBtn');await p.waitForTimeout(300);
 const after=await p.evaluate(()=>state.cards.map(c=>c.text));
 ok(after.includes('משפט שכתבתי בעצמי!')&&after.includes('כרטיסייה חדשה שהוספתי.')&&after.includes('זוכר איך בנית לבד את המגדל הכי גבוה?')&&after.includes('אתה הנכד הכי מתוק שיש!'),name+' shuffle keeps edited & personal cards');
 ok(after.filter((t,i)=>t!==before[i]).length>3,name+' shuffle changed other cards');
 // situation picker
 await p.selectOption('#sitSel','birthday');await p.waitForTimeout(300);
 ok(await p.evaluate(()=>state.occasion==='birthday'&&state.cards.some(c=>/הולדת|מזל טוב|נולדת/.test(c.text))),name+' situation picker switches set');
 // favorites
 await p.click('#favBtn');await p.waitForTimeout(200);
 const fav=await p.evaluate(()=>JSON.parse(localStorage.getItem('kartiseiAl.fav')));
 ok(fav&&fav.design==='comic'&&fav.font==='fredoka'&&fav.signer==='fs'&&!('name' in fav),name+' favorite saved (settings only, no child data)');
 await p.click('#vSheets');await p.waitForTimeout(400);
 await p.screenshot({path:TMP+'/'+name+'-preview.png',fullPage:true});
 // single-sided
 await p.evaluate(()=>{state.backStyle='none';refreshAll();});
 ok(await p.evaluate(()=>[...document.querySelectorAll('#printArea .f-back')].length===0),name+' no-back option prints fronts only');
 // PDF download works
 const [dl]=await Promise.all([p.waitForEvent('download',{timeout:60000}),p.click('#dlBtn')]);
 await dl.saveAs(TMP+'/'+name+'-e2e.pdf');ok(fs.statSync(TMP+'/'+name+'-e2e.pdf').size>50000,name+' PDF downloaded');
 // reload: favorite offered on hero
 await p.reload();await p.waitForTimeout(300);
 ok(await p.locator('#favStart').count()===1,name+' favorite offered on next visit');
 await p.screenshot({path:TMP+'/'+name+'-hero-fav.png'});
 await p.click('#favStart');
 ok(await p.evaluate(()=>state.name===''&&state.design==='comic'&&state.font==='fredoka'),name+' start from favorite resets child, keeps style');
 ok(errs.length===0,name+' no console errors '+errs.join(' | '));
 ok(ext.length===0,name+' no external requests '+ext.join(' '));
 await b.close();
}
(async()=>{await run('mobile',{...devices['iPhone 13']});await run('desktop',{viewport:{width:1280,height:900}});})();
