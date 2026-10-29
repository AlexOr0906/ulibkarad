import {chromium} from 'playwright-core';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const out='work/verification/phone-choreography';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const report=[];
try{for(const [width,height]of [[390,844],[320,568]]){
 const c=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});await c.addInitScript(()=>{Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));});
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.PHONE_PREVIEW_URL||'http://localhost:4181/');await p.evaluate(()=>document.fonts.ready);
 await p.waitForFunction(()=>document.querySelector('[data-of-intro]').dataset.ofPhoneReveal==='entered');
 const start=await p.locator('.of-photo-main img').evaluate(e=>({transform:getComputedStyle(e).transform,animations:e.getAnimations().map(a=>({name:a.animationName,duration:a.effect.getTiming().duration}))}));assert.ok(start.animations.some(a=>a.name==='of-phone-arrival'&&a.duration===1200));
 await p.waitForTimeout(250);await p.screenshot({path:`${out}/${width}-aligner-enter.png`});await p.waitForTimeout(1600);
 const pose1=await p.locator('.of-object-surface').evaluate(e=>getComputedStyle(e).transform);await p.waitForTimeout(650);const pose2=await p.locator('.of-object-surface').evaluate(e=>getComputedStyle(e).transform);assert.notEqual(pose1,pose2,'Visible ambient movement must actually advance');
 const swipe=[];for(const fraction of [0,.25,.5,.25,0]){
  await p.evaluate(f=>scrollTo({top:document.querySelector('.of-hero').offsetHeight*f,behavior:'instant'}),fraction);await p.waitForTimeout(80);
  swipe.push(await p.locator('.of-swipe-plane').evaluate(e=>({transform:getComputedStyle(e).transform,turn:parseFloat(e.closest('[data-of-intro]').style.getPropertyValue('--of-swipe-turn')),scale:parseFloat(e.closest('[data-of-intro]').style.getPropertyValue('--of-swipe-scale'))})));
  if([.25,.5].includes(fraction))await p.screenshot({path:`${out}/${width}-swipe-${fraction}.png`});
 }
 assert.ok(swipe[2].turn<-24&&swipe[2].scale<.91,'Swipe must visibly turn and recede, not only zoom');assert.equal(swipe[1].transform,swipe[3].transform,'Reverse swipe must restore the same pose');assert.equal(swipe[0].transform,swipe[4].transform);
 const first=p.locator('[data-doctor-card]').nth(0),second=p.locator('[data-doctor-card]').nth(1);
 assert.equal(await first.getAttribute('data-phone-reveal'),'armed');assert.equal(await second.getAttribute('data-phone-reveal'),'armed');
 await first.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight*.32,behavior:'instant'}));
 await p.waitForFunction(()=>document.querySelector('[data-doctor-card]').dataset.phoneReveal==='playing');
 await p.locator('#doctors').evaluate(e=>e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'})));
 await first.evaluate(card=>{window.__touchProof=[];for(const name of ['pointerdown','pointermove','pointerup'])document.querySelector('#doctors').addEventListener(name,event=>queueMicrotask(()=>window.__touchProof.push({state:card.dataset.phoneReveal,target:event.target.outerHTML?.slice(0,180),focus:document.activeElement.outerHTML?.slice(0,120)})));});
 const touch=await c.newCDPSession(p),x=Math.round(width*.6),y=Math.round(height*.6);
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 await p.waitForTimeout(40);
 await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-30}]});
 await p.waitForTimeout(40);
 await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const touchProof=await p.evaluate(()=>window.__touchProof);assert.ok(touchProof.some(e=>e.state==='playing'),`Touch must preserve a running appearance: ${JSON.stringify(touchProof)}`);
 await p.waitForTimeout(180);const early=await first.locator('.doctor-portrait').evaluate(e=>({clip:getComputedStyle(e).clipPath,transform:getComputedStyle(e).transform}));await p.screenshot({path:`${out}/${width}-portrait-enter.png`});
 await p.waitForFunction(()=>document.querySelector('[data-doctor-card]').dataset.phoneReveal==='complete');assert.equal(await second.getAttribute('data-phone-reveal'),'armed','Offscreen portrait must wait for its own entry');await p.screenshot({path:`${out}/${width}-portrait-complete.png`});
 await second.evaluate(e=>{scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight*.32,behavior:'instant'});const rail=e.closest('[data-team-rail]'),first=rail.querySelector('[data-doctor-card]');rail.scrollTo({left:e.offsetLeft-first.offsetLeft,behavior:'instant'});});
 await p.waitForFunction(()=>document.querySelectorAll('[data-doctor-card]')[1].dataset.phoneReveal==='playing');await p.waitForTimeout(180);await p.screenshot({path:`${out}/${width}-second-portrait-enter.png`});
 await p.waitForFunction(()=>document.querySelectorAll('[data-doctor-card]')[1].dataset.phoneReveal==='complete');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 report.push({width,height,start,pose1,pose2,swipe,early,passed:true});console.log('PASS visible phone choreography',width,height);await c.close();
}
 const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage();await p.goto(process.env.PHONE_PREVIEW_URL||'http://localhost:4181/');await p.waitForTimeout(200);assert.equal(await p.locator('.of-object-surface').evaluate(e=>e.getAnimations().length),0);assert.equal(await p.locator('[data-doctor-card][data-phone-reveal="complete"]').count(),4);await c.close();
 await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
}finally{await browser.close()}
