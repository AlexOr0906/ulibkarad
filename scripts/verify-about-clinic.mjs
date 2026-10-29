import {chromium} from 'playwright-core';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const out='work/verification/about-clinic';await fs.mkdir(out,{recursive:true});const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const report=[];
const url=process.env.ABOUT_PREVIEW_URL||'http://localhost:4184/about-clinic-preview/';
try{for(const [width,height,mode]of [[1440,1000,'normal'],[1024,768,'normal'],[768,1024,'normal'],[390,844,'normal'],[320,568,'normal'],[844,390,'normal'],[390,844,'reduced'],[390,844,'nojs']]){
 const js=mode!=='nojs',c=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768,javaScriptEnabled:js,reducedMotion:mode==='reduced'?'reduce':'no-preference'});
 await c.addInitScript(()=>{Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));});
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});await p.goto(url);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
 assert.equal(await p.locator('h1').count(),1);assert.equal(await p.locator('main').count(),1);assert.equal(await p.locator('.hn-header').count(),1);assert.equal(await p.locator('.cf-footer').count(),1);assert.equal(await p.locator('[data-about-page]').count(),1);
 const geometry=await p.evaluate(()=>{const shell=document.querySelector('.ac-hero').getBoundingClientRect(),heading=document.querySelector('.ac-hero h1'),r=document.createRange();r.selectNodeContents(heading);return{shell:shell.toJSON(),heading:[...r.getClientRects()].map(x=>x.toJSON()),overflow:document.documentElement.scrollWidth>innerWidth,header:document.querySelector('.hn-bar').getBoundingClientRect().bottom,crumb:document.querySelector('.ac-crumb').getBoundingClientRect().top};});
 assert.equal(geometry.overflow,false);assert.ok(geometry.crumb>=geometry.header);for(const rect of geometry.heading)assert.ok(rect.left>=geometry.shell.left-1&&rect.right<=geometry.shell.right+1,JSON.stringify({width,geometry}));
 await p.screenshot({path:`${out}/${width}-${mode}-hero.png`});
 for(const selector of ['#ac-approach','.ac-facts','.ac-next']){
  await p.locator(selector).evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-110,behavior:'instant'}));await p.waitForTimeout(1400);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(js)assert.equal(await p.locator(selector).evaluate(e=>[...e.querySelectorAll('[data-ac-reveal]')].every(t=>t.dataset.acState==='complete')),true);
  await p.screenshot({path:`${out}/${width}-${mode}-${selector.replace(/[.#]/g,'')}.png`});
 }
 await p.locator('.cf-back-top').click();await p.waitForTimeout(1500);assert.ok(await p.evaluate(()=>scrollY)<5);
 if(width<1100){await p.locator('.hn-toggle').focus();await p.keyboard.press('Enter');await p.waitForTimeout(270);assert.equal(await p.locator('.hn-disclosure').evaluate(e=>e.open),true);if(js){await p.keyboard.press('Escape');await p.waitForTimeout(180);assert.equal(await p.locator('.hn-toggle').evaluate(e=>document.activeElement===e),true);}else await p.locator('.hn-toggle').press('Enter');}
 await p.locator('.ac-hero .ac-link').focus();await p.keyboard.press('Enter');await p.waitForTimeout(1300);const top=await p.locator('#ac-approach').evaluate(e=>e.getBoundingClientRect().top);assert.ok(top>=geometry.header-1);
 if(js){await p.reload();await p.waitForTimeout(800);assert.equal(await p.locator('#ac-approach [data-ac-reveal]').first().getAttribute('data-ac-state'),'complete');await p.goBack();await p.waitForTimeout(500);await p.goForward();await p.waitForTimeout(600);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 assert.ok(await p.locator('.ac-next .ac-button').getAttribute('href').then(h=>h.endsWith('/#doctors')));assert.ok(await p.locator('.ac-next .ac-link').getAttribute('href').then(h=>h.endsWith('/#contacts')));
 if(mode==='reduced')assert.equal(await p.locator('[data-about-page]').evaluate(e=>e.getAnimations({subtree:true}).length),0);
 assert.deepEqual(errors,[]);report.push({width,height,mode,geometry,passed:true});console.log('PASS About',width,height,mode);await c.close();
}await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));}finally{await browser.close()}
