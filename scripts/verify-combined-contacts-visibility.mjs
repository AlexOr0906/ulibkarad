import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';

const url=process.env.COMPLETE_PREVIEW_URL||'http://localhost:4181/orthofamily-combined/';
const browser=await chromium.launch({executablePath:process.env.SCROLLCRAFT_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 for(const [width,height,mode] of [[1280,720,'normal'],[1440,1000,'normal'],[390,844,'normal'],[320,568,'normal'],[390,844,'reduced'],[390,844,'nojs']]) {
  const js=mode!=='nojs';
  const context=await browser.newContext({viewport:{width,height},javaScriptEnabled:js,reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  await context.addInitScript(()=>{Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('Disabled during verification'));});
  const page=await context.newPage();await page.goto(url);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(200);
  if(width>=1100) await page.locator('.hn-desktop a[href="#contacts"]').click();
  else {await page.locator('.hn-toggle').click();await page.waitForTimeout(270);await page.locator('.hn-panel nav a[href="#contacts"]').click();if(!js){await page.locator('.hn-toggle').click();}}
  await page.waitForTimeout(1400);
  assert.equal(await page.locator('#cf-contacts-title').evaluate(e=>getComputedStyle(e).clipPath),'none');
  assert.equal(await page.locator('#cf-contacts-title').evaluate(e=>e.classList.contains('cf-motion-pending')),false);
  if(js)assert.equal(await page.locator('#cf-contacts-title').getAttribute('data-cf-motion'),'complete');
  await page.locator('.cf-footer').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));await page.waitForTimeout(1400);
  assert.equal(await page.locator('.cf-brand > span').evaluate(e=>getComputedStyle(e).clipPath),'none');
  await page.locator('.cf-back-top').click();await page.waitForTimeout(1200);assert.ok(await page.evaluate(()=>scrollY)<5);
  if(mode==='normal'&&width===1280){
   // Ordinary incremental reading must still animate, rather than universally disabling the effect.
   await page.goto(url);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(200);
   const before=await page.locator('#cf-contacts-title').evaluate(e=>e.getBoundingClientRect().top+scrollY-innerHeight-120);
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),before);await page.waitForTimeout(100);
   let played=false;
   for(let i=0;i<32;i++){await page.evaluate(()=>scrollBy({top:16,behavior:'instant'}));await page.waitForTimeout(25);if(await page.locator('#cf-contacts-title').getAttribute('data-cf-motion')==='playing'){played=true;break;}}
   assert.ok(played,'Ordinary entry did not animate');await page.waitForTimeout(900);assert.equal(await page.locator('#cf-contacts-title').evaluate(e=>getComputedStyle(e).clipPath),'none');
  }
  console.log('PASS contacts visibility',width,mode);await context.close();
 }
} finally {await browser.close();}
