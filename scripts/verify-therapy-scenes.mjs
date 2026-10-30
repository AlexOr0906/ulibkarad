import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const out='work/verification/therapy-scenes',base='http://localhost:4207/';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||path.join(process.env.ProgramFiles,'Google/Chrome/Application/chrome.exe')});
const reports=[];
const cases=[[1440,1000,'normal'],[768,1024,'normal'],[390,844,'normal'],[320,568,'normal'],[844,390,'normal'],[390,844,'reduced'],[390,844,'nojs'],[390,844,'reading']];
try{for(const audience of (process.env.SCENE_AUDIENCES||'adult,children').split(','))for(const [width,height,mode]of cases.filter(c=>!process.env.SCENE_WIDTHS||process.env.SCENE_WIDTHS.split(',').includes(String(c[0])))){
 const ctx=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768,javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
 await ctx.addInitScript(()=>{Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));});
 let step='initial load';const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push({message:e.message,step,url:page.url()}));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 if(mode==='normal'&&width===390)await page.route('**/therapy-scenes/*.webp',async route=>{await new Promise(resolve=>setTimeout(resolve,700));await route.continue();});
 await page.goto(`${base}${audience}-therapy-scene-preview/`);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);
 if(mode!=='nojs')await page.waitForFunction(()=>document.querySelector('[data-ts-track]')?.dataset.tsReady==='true');
 if(mode==='reading'){await page.evaluate(()=>document.documentElement.dataset.reading='on');await page.waitForTimeout(80);}
 assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('main').count(),1);assert.equal(await page.locator('.hn-header').count(),1);assert.equal(await page.locator('.cf-footer').count(),1);assert.equal(await page.locator('[data-ts-track]').count(),1);
 if(audience==='children')assert.equal(await page.locator('.ts-child-stage').evaluate(e=>getComputedStyle(e).overflow),mode==='reading'?'visible':'hidden');
 const fit=()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);assert.ok(await fit());
 assert.equal(await page.locator('.ts-image-motion').evaluate(e=>getComputedStyle(e).visibility),'visible');
 await page.screenshot({path:`${out}/${audience}-${width}-${mode}-opening.png`});
 const range=await page.locator('[data-ts-track]').evaluate(e=>({start:+(e.dataset.tsStart||0),span:+(e.dataset.tsSpan||1),mode:e.dataset.tsMode||'nojs'}));
 const samples=[];
 for(const p of [0,.25,.5,.8,1,.5,0]){
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),range.start+range.span*p);await page.waitForTimeout(75);
  const state=await page.locator('[data-ts-track]').evaluate(e=>({p:+(e.dataset.tsProgress||1),camera:e.querySelector('[data-ts-camera]')?.getAttribute('transform'),window:e.querySelector('[data-ts-window]')?.getAttribute('width'),leaves:[...e.querySelectorAll('[data-ts-leaf]')].map(x=>x.style.transform)}));samples.push(state);
  assert.ok(await fit());if(mode==='normal')assert.ok(Math.abs(state.p-p)<.015,JSON.stringify({audience,width,p,state,range}));
  if([0,.5,1].includes(p))await page.screenshot({path:`${out}/${audience}-${width}-${mode}-scene-${p}.png`});
 }
 if(mode==='normal'){
  assert.ok(range.span>200);assert.deepEqual(samples[2],samples[5]);
  assert.notEqual(audience==='adult'?samples[0].camera:samples[0].leaves[0],audience==='adult'?samples[4].camera:samples[4].leaves[0]);
  assert.equal(audience==='adult'?samples[3].camera:samples[3].leaves[0],audience==='adult'?samples[4].camera:samples[4].leaves[0]);
  if(width===390){await page.evaluate(y=>scrollTo(0,y),range.start+range.span*.5);await page.waitForTimeout(70);const before=await page.locator('[data-ts-track]').getAttribute('data-ts-progress');await page.setViewportSize({width,height:height-70});await page.waitForTimeout(70);assert.equal(await page.locator('[data-ts-track]').getAttribute('data-ts-progress'),before);await page.setViewportSize({width,height});}
 }else{assert.ok(range.mode==='static'||mode==='nojs');if(mode!=='nojs')assert.equal(samples[0].p,1);}
 step='anchor';await page.locator('.ts-link').focus();await page.keyboard.press('Enter');await page.waitForTimeout(800);
 const target=page.locator(`#sv-${audience}-therapy-description`),targetTop=await target.evaluate(e=>e.getBoundingClientRect().top),header=await page.locator('.hn-bar').evaluate(e=>e.getBoundingClientRect().bottom);assert.ok(targetTop>=header-2||mode==='reading');
 step='comparison navigation';await page.locator('.ts-preview-links a').first().focus();await Promise.all([page.waitForURL(`${base}${audience}-therapy/`),page.keyboard.press('Enter')]);assert.equal(await page.locator('.th-introduction').count(),1);
 step='back';await page.goBack();await page.waitForURL(`**/${audience}-therapy-scene-preview/**`);await page.waitForTimeout(1000);assert.equal(await page.locator('[data-ts-track]').count(),1);
 step='reload';await page.reload();await page.waitForTimeout(1000);if(mode!=='nojs')await page.waitForFunction(()=>document.querySelector('[data-ts-track]')?.dataset.tsReady==='true');assert.ok(await fit());
 step='synthetic lifecycle';if(mode!=='nojs'){await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));assert.equal(await page.locator('[data-ts-track]').getAttribute('data-ts-ready'),'true');await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false})));assert.equal(await page.locator('[data-ts-track]').getAttribute('data-ts-ready'),null);}
 assert.deepEqual(errors,[]);reports.push({audience,width,height,mode,range,samples,passed:true});console.log('PASS therapy scene',audience,width,height,mode);await ctx.close();
}await fs.writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));}finally{await browser.close();}
