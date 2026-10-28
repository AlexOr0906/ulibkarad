import {chromium} from 'playwright-core';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const out='outputs/opening-transition';const b=await chromium.launch({executablePath:process.env.SCROLLCRAFT_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const report=[];
try{for(const [width,height,mode] of [[1440,1000,'normal'],[768,1024,'normal'],[390,844,'normal'],[320,568,'normal'],[844,390,'normal'],[1440,1000,'reduced'],[390,844,'reduced'],[390,844,'nojs']]){
 const c=await b.newContext({viewport:{width,height},javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'});await c.addInitScript(()=>{Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));});
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});await p.goto(process.env.OPENING_PREVIEW_URL||'http://localhost:4200/orthofamily-combined/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(250);
 const span=await p.locator('[data-of-intro]').evaluate(e=>Math.max(1,e.offsetHeight-innerHeight));const samples=[];
 for(const [i,v] of [0,.12,.25,.4,.58,.78,1].entries()){
  await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),span*v);await p.waitForTimeout(500);
  const state=await p.evaluate(()=>{const intro=document.querySelector('[data-of-intro]'),photo=document.querySelector('.of-photo-main'),r=photo.getBoundingClientRect(),head=document.querySelector('.hn-bar').getBoundingClientRect();return {p:Number(intro.dataset.ofProgress||0),mirror:r.toJSON(),header:head.bottom,transform:getComputedStyle(photo).transform,paper:getComputedStyle(document.querySelector('.of-scene-ground'),'::before').transform,orbit:getComputedStyle(document.querySelector('.of-scene-stage'),'::before').transform,overflow:document.documentElement.scrollWidth>innerWidth,fit:getComputedStyle(photo.querySelector('img')).objectFit};});
  assert.equal(state.overflow,false);assert.equal(state.fit,'contain');
  if(mode==='normal')assert.ok(Math.abs(state.p-v)<.015,JSON.stringify({width,v,state}));
  samples.push(state);await p.screenshot({path:`${out}/${width}-${mode}-${i}.jpg`,quality:90});
 }
 if(mode==='normal'){assert.notEqual(samples[0].transform,samples[4].transform);assert.notEqual(samples[0].paper,samples[4].paper);assert.notEqual(samples[0].orbit,samples[4].orbit);}
 if(mode!=='nojs'){
  for(const y of [span,0,span*.7,0]) {await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await p.waitForTimeout(160);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
  if(mode==='normal')assert.ok(await p.locator('[data-of-intro]').evaluate(e=>Number(e.dataset.ofProgress))<.015);
  await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(350);await p.locator('.of-lead .of-button').click();assert.equal(await p.locator('#of-visit-dialog').evaluate(d=>d.open),true);await p.keyboard.press('Escape');assert.equal(await p.locator('.of-lead .of-button').evaluate(e=>document.activeElement===e),true);
  await p.evaluate(()=>scrollTo({top:document.querySelector('#contacts').offsetTop,behavior:'instant'}));await p.waitForTimeout(250);assert.equal(await p.locator('.cf-visit summary').isVisible(),true);
  await p.locator('[data-doctor-open]').first().click();await p.waitForTimeout(800);assert.equal(await p.locator('#doctor-demo').evaluate(d=>d.open),true);await p.keyboard.press('Escape');await p.waitForTimeout(800);assert.equal(await p.locator('#doctor-demo').evaluate(d=>d.open),false);assert.equal(await p.locator('[data-doctor-open]').first().evaluate(e=>document.activeElement===e),true);
  await p.locator('[data-team-next]').click();await p.waitForTimeout(600);
  if(width>=1024)assert.equal(await p.locator('[data-doctor-card]').nth(1).getAttribute('data-active'),'true');
  else assert.ok(await p.locator('[data-team-rail]').evaluate(e=>e.scrollLeft)>0);
 }
 assert.deepEqual(errors,[]);report.push({width,height,mode,samples,pass:true});console.log('PASS opening',width,height,mode);await c.close();
}await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));}finally{await b.close();}
