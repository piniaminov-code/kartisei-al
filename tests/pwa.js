// Install / fullscreen / offline checks. Serves a copy of the site under /kartisei-al/ (like GitHub Pages)
// on :8766 so relative manifest/worker paths are tested on a subpath. Run: node tests/pwa.js
const {chromium,devices}=require('playwright');const fs=require('fs');const os=require('os');const path=require('path');const {spawn}=require('child_process');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1;};
const ROOT=path.join(__dirname,'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'kartisei-pwa-'));const site=path.join(tmp,'kartisei-al');
fs.cpSync(ROOT,site,{recursive:true,filter:s=>!/[\\/](\.git|docs|tests)([\\/]|$)/.test(s.slice(ROOT.length))});
const srv=spawn('python3',['-m','http.server','8766','--bind','127.0.0.1'],{cwd:tmp,stdio:'ignore'});
const BASE='http://localhost:8766/kartisei-al/';
const pngSize=b=>({w:b.readUInt32BE(16),h:b.readUInt32BE(20)});
(async()=>{
 await new Promise(r=>setTimeout(r,800));
 const b=await chromium.launch();
 try{
 // ---- manifest + icons ----
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto(BASE);
 const mUrl=await p.evaluate(()=>document.querySelector('link[rel=manifest]').href);
 const mRes=await p.request.get(mUrl);const man=JSON.parse(await mRes.text());
 ok(mRes.status()===200,'manifest 200 at '+mUrl);
 ok(man.lang==='he'&&man.dir==='rtl'&&/כרטיסי על/.test(man.name)&&man.short_name==='כרטיסי על','manifest name/short_name in Hebrew, lang he, dir rtl');
 ok(!/^\//.test(man.start_url)&&!/^\//.test(man.scope),'start_url and scope are relative ('+man.start_url+', '+man.scope+')');
 const start=new URL(man.start_url,mUrl).href,scope=new URL(man.scope,mUrl).href;
 ok(start.startsWith(scope)&&scope===BASE,'start_url '+start+' is inside scope '+scope);
 ok(man.display==='standalone'&&JSON.stringify(man.display_override)==='["fullscreen","standalone","minimal-ui"]','display standalone + display_override');
 ok(/^#/.test(man.theme_color)&&/^#/.test(man.background_color),'theme_color '+man.theme_color+' background_color '+man.background_color);
 const want={'192x192:any':0,'512x512:any':0,'512x512:maskable':0};
 for(const ic of man.icons){const r=await p.request.get(new URL(ic.src,mUrl).href);const s=pngSize(await r.body());
  const [w,h]=ic.sizes.split('x').map(Number);ok(r.status()===200&&s.w===w&&s.h===h,`icon ${ic.src} 200, ${s.w}x${s.h} (${ic.purpose})`);want[ic.sizes+':'+ic.purpose]=1;}
 ok(Object.values(want).every(Boolean),'icons 192, 512 and maskable 512 present');
 for(const sel of ['link[rel=apple-touch-icon]','link[rel=icon][type="image/png"]']){const u=await p.evaluate(s=>document.querySelector(s).href,sel);const r=await p.request.get(u);const s=pngSize(await r.body());ok(r.status()===200,sel+' 200 '+s.w+'x'+s.h);}
 const metas=await p.evaluate(()=>['apple-mobile-web-app-capable','apple-mobile-web-app-title','apple-mobile-web-app-status-bar-style','theme-color'].map(n=>!!document.querySelector('meta[name="'+n+'"]')).every(Boolean)&&/viewport-fit=cover/.test(document.querySelector('meta[name=viewport]').content));
 ok(metas,'apple meta tags, theme-color, viewport-fit=cover');
 // ---- Chrome's own installability check ----
 const cdp=await ctx.newCDPSession(p);
 await p.waitForFunction(()=>navigator.serviceWorker&&navigator.serviceWorker.controller,null,{timeout:15000}).catch(()=>{});
 const inst=await cdp.send('Page.getInstallabilityErrors');
 ok(inst.installabilityErrors.length===0,'Chrome installability errors: '+(JSON.stringify(inst.installabilityErrors.map(e=>e.errorId))||'none'));
 const am=await cdp.send('Page.getAppManifest');ok(am.errors.length===0,'Chrome parsed manifest without errors');
 // ---- service worker + offline + cache contents ----
 const sw=await p.evaluate(async()=>{const r=await navigator.serviceWorker.ready;const keys=await caches.keys();const c=await caches.open(keys[0]);const reqs=(await c.keys()).map(r=>new URL(r.url).pathname);return{scope:r.scope,keys,n:reqs.length,reqs}});
 ok(sw.scope===BASE,'service worker registered with scope '+sw.scope);
 ok(sw.keys.length===1&&/^kartisei-v\d+$/.test(sw.keys[0]),'one versioned cache: '+sw.keys.join(','));
 ok(sw.reqs.every(u=>/\.(html|js|css|woff2|png|webmanifest)$|\/$/.test(u)),'cache holds only shipped static files ('+sw.n+' entries)');
 // personal data: fill in a child, go to preview, make sure nothing new lands in Cache Storage
 await p.evaluate(()=>{Object.assign(state,{name:'פרטי מאוד',gender:'f',age:9,design:'night'});state.cards=null;buildCards(true);stepIdx=99;render();});
 await p.waitForTimeout(800);
 const after=await p.evaluate(async()=>{const out=[];for(const k of await caches.keys()){const c=await caches.open(k);for(const r of await c.keys()){out.push(r.url);const t=await (await c.match(r)).clone().text().catch(()=>'');if(t.includes('פרטי מאוד'))out.push('LEAK '+r.url);}}return out});
 ok(!after.some(u=>u.startsWith('LEAK')),'no child data in Cache Storage after filling the form');
 await ctx.setOffline(true);await p.goto(BASE);
 ok(await p.locator('#startBtn').count()===1,'offline second load serves the app shell');
 ok(await p.evaluate(()=>document.fonts.check('20px "Gveret Levin"','א')||document.fonts.load('20px "Gveret Levin"','א').then(f=>f.length>0)),'offline: fonts come from the cache');
 await ctx.setOffline(false);
 // ---- update to a new cache version replaces the old ----
 const swPath=path.join(site,'sw.js');const old=fs.readFileSync(swPath,'utf8');const oldV=old.match(/kartisei-v(\d+)/)[1];
 fs.writeFileSync(swPath,old.replace(/kartisei-v\d+/,'kartisei-v'+(+oldV+1)));
 const keys2=await p.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();
  await new Promise(res=>{const t=setInterval(async()=>{const k=await caches.keys();if(k.length===1&&!k[0].endsWith(document.currentScript?'':''))res();},200);setTimeout(res,8000);});
  for(let i=0;i<40;i++){const k=await caches.keys();if(k.length===1&&k[0]!=='kartisei-v'+0)if(navigator.serviceWorker.controller&&navigator.serviceWorker.controller.scriptURL)break;await new Promise(r=>setTimeout(r,200));}
  return caches.keys();});
 fs.writeFileSync(swPath,old);
 ok(keys2.length===1&&keys2[0]==='kartisei-v'+(+oldV+1),'new worker activated, old cache deleted: '+keys2.join(','));
 // ---- fullscreen ----
 await p.goto(BASE);await p.waitForTimeout(300);
 ok(await p.locator('#fsBtn').isVisible(),'desktop Chrome: fullscreen button visible');
 await p.click('#fsBtn');await p.waitForTimeout(300);
 ok(await p.evaluate(()=>document.fullscreenElement===document.documentElement),'fullscreen button → document.fullscreenElement is set');
 ok(/יציאה/.test(await p.locator('#fsBtn').innerText()),'button switches to "יציאה ממסך מלא"');
 await p.click('#fsBtn');await p.waitForTimeout(300);
 ok(await p.evaluate(()=>!document.fullscreenElement),'second press exits fullscreen');
 // install button on desktop: prompt if Chrome offered one, otherwise the honest fallback sheet
 const hadPrompt=await p.evaluate(()=>!!installEvt);
 if(!hadPrompt){await p.click('#instBtn');ok(/Firefox במחשב/.test(await p.locator('.inst-sheet').innerText()),'desktop without install prompt: fallback text shown');await p.click('#sheetClose');}
 else ok(true,'desktop Chrome fired beforeinstallprompt; button uses it');
 ok(errs.length===0,'no console errors '+errs.join(' | '));
 // ---- layout shift on existing screens ----
 const cls=await p.evaluate(async()=>{let s=0;new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)s+=e.value})).observe({type:'layout-shift',buffered:true});
  await new Promise(r=>setTimeout(r,600));stepIdx=0;render();await new Promise(r=>setTimeout(r,600));stepIdx=99;state.cards=null;buildCards(true);render();await new Promise(r=>setTimeout(r,1200));return s;});
 ok(cls<0.01,'cumulative layout shift on hero/step/preview: '+cls.toFixed(4));
 await ctx.close();
 // ---- iPhone emulation ----
 const ip=await b.newContext({...devices['iPhone 13']});const q=await ip.newPage();const qe=[];q.on('pageerror',e=>qe.push(e.message));
 await q.goto(BASE);await q.waitForTimeout(400);
 ok(!(await q.locator('#fsBtn').isVisible()),'iPhone UA: fullscreen button hidden');
 ok(await q.locator('#instBtn').isVisible(),'iPhone UA: add-to-home-screen button visible');
 await q.click('#instBtn');const t=await q.locator('.inst-sheet').innerText();
 ok(/השיתוף/.test(t)&&/הוספה למסך הבית/.test(t),'iPhone UA: manual Share → "הוספה למסך הבית" instructions');
 await q.waitForTimeout(500);ok(await q.locator('.inst-sheet').isVisible(),'iPhone: instruction sheet visible on screen');await q.screenshot({path:path.join(tmp,'iphone-sheet.png')});
 ok(qe.length===0,'iPhone: no page errors');await ip.close();
 // ---- standalone emulation (navigator.standalone + display-mode media) ----
 for(const how of ['navigator.standalone (iOS home screen)','matchMedia display-mode: standalone']){
  const sc=await b.newContext({viewport:{width:390,height:844}});const s=await sc.newPage();
  if(how==='navigator.standalone')await s.addInitScript(()=>Object.defineProperty(Navigator.prototype,'standalone',{get:()=>true}));
  // Chrome's CDP cannot emulate display-mode, so matchMedia is overridden to answer like an installed app
  else await s.addInitScript(()=>{const real=window.matchMedia.bind(window);window.matchMedia=q=>/display-mode:\s*standalone/.test(q)?{matches:true,media:q,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}:real(q);});
  await s.goto(BASE);await s.waitForTimeout(300);
  ok(!(await s.locator('#fsBtn').isVisible())&&!(await s.locator('#instBtn').isVisible()),'standalone ('+how+'): both buttons hidden');
  await sc.close();
 }
 // ---- print never shows the controls ----
 const pc=await b.newContext();const pp=await pc.newPage();await pp.goto(BASE);await pp.emulateMedia({media:'print'});
 ok(!(await pp.locator('#appTools').isVisible()),'print media: controls hidden');await pc.close();
 console.log('screenshot of the iPhone sheet: '+path.join(tmp,'iphone-sheet.png'));
 }finally{await b.close();srv.kill();}
})();
