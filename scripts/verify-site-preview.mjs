import {chromium} from 'playwright-core';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const base=process.env.SITE_PREVIEW_URL||'http://localhost:4210/site-preview/';const out='outputs/site-preview';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.SCROLLCRAFT_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const report=[];
try{for(const [width,height,mode]of [[1440,1000,'normal'],[1024,768,'normal'],[768,1024,'normal'],[390,844,'normal'],[320,568,'normal'],[390,844,'reduced'],[1440,1000,'reduced'],[390,844,'nojs']].filter(([, , m])=>!process.env.SITE_QA_MODE||m===process.env.SITE_QA_MODE)){
 const c=await browser.newContext({viewport:{width,height},javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
 await c.addInitScript(()=>{
  Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled during verification'));
  window.__qa={readyWrites:0,reveals:[],transitions:[],pageshow:[]};
  new MutationObserver(records=>records.forEach(r=>{if(r.attributeName==='data-ac-ready'&&r.target.hasAttribute('data-ac-ready'))window.__qa.readyWrites++;})).observe(document,{subtree:true,attributes:true,attributeFilter:['data-ac-ready']});
  const original=Element.prototype.animate;Element.prototype.animate=function(frames,options){if(this.closest?.('[data-about-page]'))window.__qa.reveals.push({duration:options?.duration,delay:options?.delay});return original.call(this,frames,options)};
  addEventListener('pagereveal',e=>window.__qa.transitions.push(Boolean(e.viewTransition)));addEventListener('pageshow',e=>window.__qa.pageshow.push(e.persisted));
 });
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 const wait=ms=>p.waitForTimeout(ms);const overflow=()=>p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 async function nav(label){if(width<1100){const toggle=p.locator('.hn-toggle');if(!(await p.locator('.hn-disclosure').evaluate(e=>e.open)))await toggle.click();await wait(280);await p.locator('.hn-panel nav a').filter({hasText:label}).click();}else await p.locator('.hn-desktop a').filter({hasText:label}).click();}
 async function active(path){for(const selector of ['.hn-desktop','.hn-panel nav','.cf-footer nav'])assert.equal(await p.locator(`${selector} a[aria-current="page"]`).getAttribute('href'),path);}
 async function landmarks(title){assert.equal(await p.title(),title);for(const selector of ['main','h1','.hn-header','.cf-footer'])assert.equal(await p.locator(selector).count(),1);assert.equal(await overflow(),false);}
 await p.goto(base);await p.evaluate(()=>document.fonts.ready);await wait(1300);await landmarks('OrthoFamily — Стоматология для всей семьи · Демо');assert.equal(await p.locator('.hn-brand').getAttribute('aria-current'),'page');await p.screenshot({path:`${out}/${width}-${mode}-home.jpg`,quality:85});
 await nav('О клинике');await p.waitForURL(new URL('about/',base).href);await p.evaluate(()=>document.fonts.ready);
 if(mode==='normal')await p.waitForFunction(()=>document.querySelector('[data-ac-reveal]')?.getAttribute('data-ac-state')==='playing');
 else await wait(200);
 const intermediate=await p.locator('[data-about-page]').evaluate(root=>({state:root.querySelector('[data-ac-reveal]')?.getAttribute('data-ac-state'),running:root.getAnimations({subtree:true}).filter(a=>a.playState==='running').length,auto:root.hasAttribute('data-ac-auto-motion')}));
 assert.equal(intermediate.auto,false);if(mode==='normal')assert.ok(intermediate.running>0,JSON.stringify(intermediate));
 await p.screenshot({path:`${out}/${width}-${mode}-about-enter.jpg`,quality:85});await wait(1250);await landmarks('О клинике · OrthoFamily');await active(new URL('about/',base).pathname);
 const aboutGeometry=await p.evaluate(()=>({crumb:document.querySelector('.ac-crumb').getBoundingClientRect().top,header:document.querySelector('.hn-bar').getBoundingClientRect().bottom}));assert.ok(aboutGeometry.crumb>=aboutGeometry.header);assert.ok(aboutGeometry.crumb<aboutGeometry.header+70,JSON.stringify(aboutGeometry));
 if(mode!=='nojs'){const proof=await p.evaluate(()=>window.__qa);assert.equal(proof.readyWrites,1);assert.equal(await p.locator('[data-about-page]').getAttribute('data-ac-ready'),'true');}
 await p.locator('.of-skip').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#ip-main').evaluate(e=>e===document.activeElement),true);
 await p.screenshot({path:`${out}/${width}-${mode}-about.jpg`,quality:85});
 if(width<1100&&mode!=='nojs'){await p.locator('.hn-toggle').focus();await p.keyboard.press('Enter');await wait(280);await p.keyboard.press('Escape');await wait(200);assert.equal(await p.locator('.hn-disclosure').evaluate(e=>e.open),false);assert.equal(await p.locator('.hn-toggle').evaluate(e=>e===document.activeElement),true);}
 await p.locator('.ac-hero .ac-link').focus();await p.keyboard.press('Enter');await wait(1200);const approachTop=await p.locator('#ac-approach').evaluate(e=>e.getBoundingClientRect().top);assert.ok(approachTop>=aboutGeometry.header-1);const aboutY=await p.evaluate(()=>scrollY);await p.screenshot({path:`${out}/${width}-${mode}-approach.jpg`,quality:85});
 await nav('Пациентам');await p.waitForURL(new URL('patients/',base).href);await wait(700);await landmarks('Пациентам · OrthoFamily');await active(new URL('patients/',base).pathname);
 const firstTransition=mode!=='nojs'?await p.evaluate(()=>window.__qa.transitions):null;
 await p.screenshot({path:`${out}/${width}-${mode}-patients.jpg`,quality:85});
 await p.goBack();await wait(650);assert.equal(new URL(p.url()).pathname,new URL('about/',base).pathname);assert.equal(new URL(p.url()).hash,'#ac-approach');assert.ok(Math.abs(await p.evaluate(()=>scrollY)-aboutY)<25);await active(new URL('about/',base).pathname);
 const restoredProof=mode!=='nojs'?await p.evaluate(()=>window.__qa):null;if(restoredProof)assert.equal(restoredProof.readyWrites,1);
 assert.equal(await p.evaluate(()=>document.activeElement===document.body||document.activeElement.getClientRects().length>0),true);
 await p.goForward();await wait(650);assert.equal(new URL(p.url()).pathname,new URL('patients/',base).pathname);await active(new URL('patients/',base).pathname);
 await p.locator('.pa-index a[href="#pa-documents"]').focus();await p.keyboard.press('Enter');await wait(1000);const documentsTop=await p.locator('#pa-documents h2').evaluate(e=>e.getBoundingClientRect().top);assert.ok(documentsTop>=aboutGeometry.header-1);
 if(mode!=='nojs')assert.equal(await p.locator('#pa-documents').evaluate(e=>document.activeElement===e),true);
 const patientsY=await p.evaluate(()=>scrollY);await p.reload();await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(y=>Math.abs(scrollY-y)<25,patientsY,{timeout:3500});await landmarks('Пациентам · OrthoFamily');
 if(mode==='reduced')assert.equal(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
 await p.locator('.pa-contact-link').click();await p.waitForURL(u=>u.pathname===new URL(base).pathname&&u.hash==='#contacts');await wait(1200);assert.ok(await p.locator('#cf-contacts-title').evaluate(e=>e.getBoundingClientRect().top)>=aboutGeometry.header-1);
 await p.locator('.cf-back-top').click();await wait(1400);assert.ok(await p.evaluate(()=>scrollY)<5);
 // The approved home remains outside native internal transitions and retains its existing scenes.
 assert.equal(await p.locator('.of-opening-transition').count(),1);assert.equal(await p.locator('html').evaluate(e=>e.classList.contains('ip-document')),false);assert.equal(await overflow(),false);
 assert.deepEqual(errors,[]);report.push({width,height,mode,intermediate,aboutGeometry,aboutY,patientsY,firstTransition,restoredProof,pass:true});await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log('PASS site family',width,mode);await c.close();
}}finally{await browser.close()}
