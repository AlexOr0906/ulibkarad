import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const url=process.env.CONTACTS_PREVIEW_URL||'http://localhost:4180/contacts-footer-preview/';
const out='outputs/contacts-footer';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.SCROLLCRAFT_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report=[];
try {
 for(const [label,width,reducedMotion,javaScriptEnabled] of [['desktop',1440,'no-preference',true],['phone',390,'no-preference',true],['compact',320,'no-preference',true],['tablet',768,'no-preference',true],['reduced',390,'reduce',true],['no-js',390,'no-preference',false]]){
  const context=await browser.newContext({viewport:{width,height:width>1000?1000:844},reducedMotion,javaScriptEnabled});
  await context.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.reject(Error('Disabled during tests'));Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Document.prototype.exitPointerLock=()=>{};});
  const p=await context.newPage();const errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>requests.push(r.url()));
  await p.goto(url);await p.evaluate(()=>document.fonts.ready);
  assert.equal(await p.locator('iframe,form,input,a[href^="tel:"],a[href^="mailto:"]').count(),0);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.ok(requests.every(r=>new URL(r).origin===new URL(url).origin),'Third-party request');
  for(const image of await p.locator('.cf-brand img').all()){await image.scrollIntoViewIfNeeded();assert.equal(await image.evaluate(i=>i.complete&&i.naturalWidth>0),true);}
  await p.screenshot({path:`${out}/${label}.png`,fullPage:true});
  const visit=p.locator('.cf-visit summary');await visit.focus();await p.keyboard.press('Enter');assert.equal(await p.locator('.cf-visit').getAttribute('open'),'');
  assert.ok(await visit.evaluate(e=>getComputedStyle(e).outlineStyle!=='none'));await p.keyboard.press('Space');assert.equal(await p.locator('.cf-visit').getAttribute('open'),null);
  const legal=p.locator('.cf-legal summary');await legal.focus();await p.keyboard.press('Enter');assert.equal(await p.locator('.cf-legal details').getAttribute('open'),'');
  await p.keyboard.press('Space');assert.equal(await p.locator('.cf-legal details').getAttribute('open'),null);
  for(const a of await p.locator('.cf-footer a').all()){
   const dest=new URL(await a.getAttribute('href'),url);assert.equal(dest.origin,new URL(url).origin);
   const response=await context.request.get(dest.href.split('#')[0]);assert.equal(response.status(),200);
   if(dest.hash){assert.ok((await response.text()).includes(`id="${dest.hash.slice(1)}"`),`Missing anchor ${dest.href}`);}
  }
  if(reducedMotion==='reduce')assert.equal(await visit.evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
  // Stress layout using clearly synthetic long strings, never source content.
  await p.locator('[data-cf-contact]').evaluateAll(nodes=>nodes.forEach(n=>n.textContent='ТестПереносаДлиннойСтроки'.repeat(10)));
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.screenshot({path:`${out}/${label}-long-content.png`,fullPage:true});
  assert.deepEqual(errors,[]);report.push({label,width,pass:true,thirdPartyRequests:0,errors});await context.close();
 }
 console.log('PASS: desktop/390/320/768, keyboard, native details, links, reduced motion, no-JS, long strings, no overflow or external map requests.');
}finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();}
