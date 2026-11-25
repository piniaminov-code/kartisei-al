// Resolves every sentence template for boy/girl x we/I(m)/I(f) and fails on leftover template syntax or missing final punctuation.
// Serve the repo root on :8765, then: node tests/check-sentences.js
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:8765/');
const r=await p.evaluate(()=>{
 const all=[];const L=window.SENTENCES;
 const push=(k,e,ex)=>all.push([k,e[0],ex||{}]);
 ['GENERAL','YOUNG','MID','TEEN','CUSTOM_PRESERVE','CUSTOM_STRENGTHEN','HOBBY_ANY'].forEach(k=>L[k].forEach(e=>push(k,e,{h:'כדורגל',t:'סבלנות'})));
 ['PRESERVE','STRENGTHEN','HOBBY','OCCASION'].forEach(k=>Object.entries(L[k]).forEach(([kk,v])=>v.forEach(e=>push(k+'.'+kk,e,{h:kk,t:'סבלנות'}))));
 const out=[],bad=[];
 for(const [k,t,ex] of all){for(const g of ['m','f'])for(const sg of ['p','ms','fs']){state.gender=g;state.signer=sg;const s=tpl(t,ex);
   if(/[{}\[\]|]/.test(s)||/  /.test(s)||!/[.!?]$/.test(s))bad.push(k+' '+g+sg+': '+s);
   out.push(k+'\t'+g+sg+'\t'+s);}}
 return {n:all.length,out,bad};});
console.log('templates',r.n,'bad',r.bad.length);console.log(r.bad.slice(0,20).join('\n'));if(r.bad.length)process.exitCode=1;await b.close();})();
