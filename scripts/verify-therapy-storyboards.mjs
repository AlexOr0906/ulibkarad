import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='work/verification/storyboards';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.ProgramFiles+'/Google/Chrome/Application/chrome.exe'}),reports=[];
try{for(const audience of ['adult','children'])for(const [width,height,mode] of [[1440,1000,'normal'],[768,1024,'normal'],[390,844,'normal'],[320,568,'normal'],[844,390,'normal'],[390,844,'reduced'],[390,844,'nojs'],[390,844,'reading']]){
const ctx=await browser.newContext({viewport:{width,height},javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference',isMobile:width<768,hasTouch:width<768});await ctx.addInitScript(()=>{Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));});
const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
await page.goto(`http://localhost:4207/${audience}-therapy-story-preview/`);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(900);
if(mode!=='nojs')await page.waitForFunction(()=>document.querySelector('[data-sb-story]')?.dataset.sbReady==='true');
if(mode==='reading'){await page.evaluate(()=>document.documentElement.dataset.reading='on');await page.waitForTimeout(100);}
assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.sb-shot').count(),3);assert.equal(await page.locator('.sb-loader').evaluate(e=>e.complete&&e.naturalWidth>0),true);
const info=await page.locator('[data-sb-story]').evaluate(e=>({start:+e.dataset.sbStart,span:+e.dataset.sbSpan,mode:e.dataset.sbMode}));
if(mode==='normal'&&info.mode==='scroll'){
for(const [p,index] of [[0,0],[.48,1],[.9,2],[.48,1],[0,0]]){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),info.start+info.span*p);await page.waitForTimeout(120);assert.equal(await page.locator('.sb-shot:not([aria-hidden=true])').count(),1);assert.equal(await page.locator('.sb-shot:not([aria-hidden=true])').getAttribute('data-sb-shot'),String(index));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`${out}/${audience}-${width}-${p}.png`});}
if(width===390){const before=await page.locator('[data-sb-story]').getAttribute('data-sb-progress');await page.setViewportSize({width,height:height-70});await page.waitForTimeout(100);assert.equal(await page.locator('[data-sb-story]').getAttribute('data-sb-progress'),before);}
}else{assert.ok(mode==='nojs'||info.mode==='static');for(let i=0;i<3;i++){const shot=page.locator('.sb-shot').nth(i);await shot.scrollIntoViewIfNeeded();assert.ok(await shot.isVisible());}await page.screenshot({path:`${out}/${audience}-${mode}.png`});}
assert.deepEqual(errors,[]);reports.push({audience,width,height,mode,passed:true});console.log('PASS',audience,width,mode);await ctx.close();
}await fs.writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));}finally{await browser.close();}
