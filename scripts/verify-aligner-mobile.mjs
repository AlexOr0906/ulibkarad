import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='work/verification/aligner-mobile';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report=[];
try{
 for(const [width,height,mode] of [[1920,1080,'normal'],[1440,1000,'normal'],[1280,720,'normal'],[768,1024,'normal'],[600,800,'normal'],[430,932,'normal'],[390,844,'normal'],[360,740,'normal'],[320,568,'normal'],[844,390,'normal'],[390,844,'reduced'],[320,568,'nojs']]){
  const context=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768,javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  await context.addInitScript(()=>{Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
  await page.goto('http://localhost:4181/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
  assert.match(await page.locator('.of-photo-main img').getAttribute('src'),/aligner-object/);
  assert.equal(await page.locator('.of-lead .of-button svg').count(),1);
  assert.equal(await page.evaluate(()=>/[↗↘↑↓→←]/u.test(document.body.innerText)),false,'No font-dependent arrow glyphs in visible text');
  const span=await page.locator('[data-of-intro]').evaluate(e=>Number(e.dataset.ofSpan)||e.offsetHeight-innerHeight);
  const samples=[];
  for(let i=0;i<=20;i++){
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),span*i/20);await page.waitForTimeout(220);
   const state=await page.evaluate(()=>{
    const rect=e=>e.getBoundingClientRect().toJSON(),photo=rect(document.querySelector('.of-photo-main')),header=document.querySelector('.hn-bar').getBoundingClientRect().bottom;
    const overlap=r=>Math.min(photo.right,r.right)-Math.max(photo.left,r.left)>2&&Math.min(photo.bottom,r.bottom)-Math.max(photo.top,r.top,header)>2;
    return {y:scrollY,progress:Number(document.querySelector('[data-of-intro]').dataset.ofProgress||0),photo,header,overflow:document.documentElement.scrollWidth>innerWidth,collisions:[...document.querySelectorAll('.of-title,.of-lead,.of-about-copy')].filter(e=>overlap(rect(e))).map(e=>e.className)};
   });
   assert.equal(state.overflow,false);assert.deepEqual(state.collisions,[],JSON.stringify({width,height,i,state}));
   if(i===0){assert.ok(state.photo.top>=state.header-1&&state.photo.bottom<=height+1,JSON.stringify({width,height,state}));assert.ok(await page.locator('.of-lead .of-button').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight));}
   samples.push(state);
   if([0,10,20].includes(i))await page.screenshot({path:`${out}/${width}-${mode}-${i}.png`});
  }
  if(width<768&&mode==='normal'){
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),height*.55);await page.waitForTimeout(350);
   const held=await page.locator('.of-photo-main').evaluate(e=>e.getBoundingClientRect().toJSON());assert.ok(held.top>70&&held.bottom<=height+1);
   await page.screenshot({path:`${out}/${width}-${mode}-hold.png`});
  }
  if(mode!=='nojs'){
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(350);
   await page.locator('.of-lead .of-button').click();assert.equal(await page.locator('#of-visit-dialog').evaluate(e=>e.open),true);await page.keyboard.press('Escape');
   assert.equal(await page.locator('.of-lead .of-button').evaluate(e=>e===document.activeElement),true);
  }
  assert.deepEqual(errors,[]);report.push({width,height,mode,span,samples,errors,passed:true});console.log('PASS aligner',width,height,mode);await context.close();
 }
 await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
}finally{await browser.close()}
