import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin=process.env.INTERNAL_PREVIEW_URL||'http://localhost:4210/';
const url=path=>new URL(path,origin).href;
const out='outputs/internal-pages';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.SCROLLCRAFT_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report=[];
try{for(const [width,height,mode]of [[320,568,'normal'],[390,844,'normal'],[768,1024,'normal'],[1024,768,'normal'],[1440,1000,'normal'],[390,844,'reduced'],[1440,1000,'reduced'],[390,844,'nojs']]){
 const context=await browser.newContext({viewport:{width,height},javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
 await context.addInitScript(()=>{
  Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled in verification'));
  window.addEventListener('pagereveal',event=>{window.__qaTransition=Boolean(event.viewTransition);});
 });
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(url('internal-layout-preview/'));await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(650);
 assert.equal(await page.locator('main').count(),1);assert.equal(await page.locator('h1').count(),1);
 await page.locator('.il-preview header .ip-link').click();await page.waitForURL('**/patients-preview/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);
 const nativeTransition=await page.evaluate(()=>window.__qaTransition??null);
 assert.equal(await page.title(),'Пациентам · OrthoFamily');assert.equal(await page.locator('main').count(),1);assert.equal(await page.locator('h1').count(),1);
 assert.equal(await page.locator('a[download]').count(),0);assert.equal(await page.locator('form,input,textarea').count(),0);
 assert.equal(await page.locator('.pa-documents a').count(),0);assert.equal(await page.locator('.pa-documents li').count(),3);
 const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 assert.equal(await overflow(),false);
 await page.screenshot({path:`${out}/${width}-${mode}-hero.jpg`,quality:90});
 const anchors=[];
 for(const hash of ['#pa-clinic','#pa-license','#pa-rules','#pa-documents','#pa-prices','#pa-appeals']){
  await page.locator(`.pa-index a[href="${hash}"]`).click();await page.waitForTimeout(mode==='reduced'?100:1000);
  const anchor=await page.evaluate(hash=>({hash,top:document.querySelector(`${hash} h2`).getBoundingClientRect().top,header:document.querySelector('.hn-bar').getBoundingClientRect().bottom,focus:document.activeElement.id}),hash);
  anchors.push(anchor);assert.ok(anchor.top>=anchor.header-1,JSON.stringify(anchor));assert.ok(anchor.top<height);assert.equal(await overflow(),false);
  if(['#pa-license','#pa-documents','#pa-appeals'].includes(hash))await page.screenshot({path:`${out}/${width}-${mode}-${hash.slice(4)}.jpg`,quality:90});
 }
 // Back/forward keeps native history, URL and scroll position, not a simulated SPA.
 for(let i=0;i<6;i++)await page.goBack();await page.waitForTimeout(500);assert.equal(new URL(page.url()).hash,'');
 await page.goBack();await page.waitForTimeout(500);assert.equal(new URL(page.url()).pathname,new URL(url('internal-layout-preview/')).pathname);
 await page.goForward();await page.waitForTimeout(500);assert.equal(new URL(page.url()).pathname,new URL(url('patients-preview/')).pathname);
 if(mode!=='nojs'){
  await page.locator('.hn-brand').focus();await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle),'solid');
  if(width<1100){await page.locator('.hn-toggle').focus();await page.keyboard.press('Enter');await page.waitForTimeout(270);assert.equal(await page.locator('.hn-disclosure').evaluate(e=>e.open),true);await page.keyboard.press('Escape');await page.waitForTimeout(200);assert.equal(await page.locator('.hn-disclosure').evaluate(e=>e.open),false);assert.equal(await page.locator('.hn-toggle').evaluate(e=>e===document.activeElement),true);}
  await page.locator('.pa-index a[href="#pa-documents"]').focus();await page.keyboard.press('Enter');await page.waitForTimeout(1000);assert.equal(await page.locator('#pa-documents').evaluate(e=>e===document.activeElement),true);
  await page.evaluate(()=>{scrollTo({top:document.body.scrollHeight,behavior:'instant'});scrollTo({top:0,behavior:'instant'});});await page.waitForTimeout(600);
  await page.locator('#pa-documents').evaluate(e=>e.scrollIntoView({behavior:'instant'}));await page.waitForTimeout(100);const y=await page.evaluate(()=>scrollY);await page.reload();await page.waitForTimeout(500);assert.ok(Math.abs(await page.evaluate(()=>scrollY)-y)<20);
  if(mode==='reduced')assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
 }
 await page.locator('.pa-contact-link').click();await page.waitForURL(u=>u.hash==='#contacts');await page.waitForTimeout(1300);assert.equal(await page.locator('#cf-contacts-title').isVisible(),true);assert.equal(await page.locator('[data-patients-page]').count(),0);
 // Regression: no internal layout/style opt-in on the approved home.
 assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('ip-document')),false);
 assert.equal(await page.locator('[data-of-direction][open]').count(),0);assert.equal(await overflow(),false);
 assert.deepEqual(errors,[]);report.push({width,height,mode,nativeTransition,anchors,pass:true});await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log('PASS internal',width,mode,'native transition:',nativeTransition);await context.close();
}}finally{await browser.close();}
