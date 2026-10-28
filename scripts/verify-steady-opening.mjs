import {chromium} from 'playwright-core';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const out=process.env.STEADY_OUTPUT_DIR||'work/verification/steady-opening';await fs.mkdir(out,{recursive:true});const b=await chromium.launch({executablePath:process.env.SCROLLCRAFT_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const report=[];
try{for(const[width,height,mode]of [[1920,1080,'normal'],[1440,1000,'normal'],[1280,720,'normal'],[1024,768,'normal'],[768,1024,'normal'],[600,800,'normal'],[430,932,'normal'],[390,844,'normal'],[320,568,'normal'],[844,390,'normal'],[1440,1000,'reduced'],[390,844,'reduced'],[390,844,'nojs']]){
 const c=await b.newContext({viewport:{width,height},javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'});await c.addInitScript(()=>{Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));});const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});await p.goto(process.env.COMPLETE_PREVIEW_URL||'http://localhost:4181/orthofamily-combined/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 const initial=await p.evaluate(()=>{const r=document.querySelector('.of-photo-main').getBoundingClientRect(),cta=document.querySelector('.of-lead .of-button').getBoundingClientRect(),bar=document.querySelector('.hn-bar').getBoundingClientRect();return{frame:r.toJSON(),cta:cta.toJSON(),header:bar.bottom,image:document.querySelector('.of-photo-main img').currentSrc,fit:getComputedStyle(document.querySelector('.of-photo-main img')).objectFit,overflow:getComputedStyle(document.querySelector('.of-scene-stage')).overflow};});
 assert.match(initial.image,/mirror-object-v1/);assert.equal(initial.fit,'contain');assert.notEqual(initial.overflow,'clip');assert.ok(initial.frame.top>=initial.header-1&&initial.frame.bottom<=height+1,JSON.stringify({width,height,initial}));assert.ok(initial.cta.bottom<=height&&initial.cta.top>=initial.header,JSON.stringify({width,height,initial}));
 if(width<768&&mode==='normal'){
  await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),height*.55);await p.waitForTimeout(180);
  const held=await p.locator('.of-photo-main').evaluate(e=>e.getBoundingClientRect().toJSON());assert.ok(held.top>=initial.header-1&&held.bottom<=height+1,JSON.stringify({width,held}));
  await p.screenshot({path:`${out}/${width}-${mode}-hold.jpg`,quality:90});
  await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(180);
 }
 const span=await p.locator('[data-of-intro]').evaluate(e=>Number(e.dataset.ofSpan)||e.offsetHeight-innerHeight);const samples=[];
 if(width>=768&&mode==='normal')assert.ok(span>=height,`Mirror must remain through at least one viewport of scroll: ${span}`);
 for(let i=0;i<=20;i++){
  await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),span*i/20);await p.waitForTimeout(40);const state=await p.evaluate(()=>{const root=document.querySelector('[data-of-intro]'),r=document.querySelector('.of-photo-main').getBoundingClientRect();return{y:scrollY,p:Number(root.dataset.ofProgress||0),scale:parseFloat(root.style.getPropertyValue('--of-object-scale'))||1,offset:parseFloat(root.style.getPropertyValue('--of-object-y'))||0,frame:r.toJSON(),overflow:document.documentElement.scrollWidth>innerWidth,header:document.querySelector('.hn-bar').getBoundingClientRect().bottom};});
  assert.equal(state.overflow,false);if(width>=768){assert.ok(state.frame.top>=state.header-1&&state.frame.bottom<=height+1,JSON.stringify({width,height,state}));}
  if(samples.length&&mode==='normal'){const prev=samples.at(-1);assert.ok(Math.abs(state.offset-prev.offset)<=1.1);assert.ok(Math.abs(state.scale-prev.scale)<=.005);}
  samples.push(state);if([0,10,20].includes(i)){await p.waitForTimeout(150);await p.screenshot({path:`${out}/${width}-${mode}-${i}.jpg`,quality:90});}
 }
 await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),span*.25);await p.waitForTimeout(180);if(mode!=='nojs'){const actual=await p.locator('[data-of-intro]').getAttribute('data-of-progress');assert.ok(Math.abs(Number(actual)-.25)<.01);}
 assert.deepEqual(errors,[]);report.push({width,height,mode,passed:true,initial,samples,errors});console.log('PASS steady',width,height,mode);await c.close();
}await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));}finally{await b.close()}
