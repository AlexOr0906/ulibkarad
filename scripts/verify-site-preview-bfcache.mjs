import {chromium} from 'playwright-core';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
// Playwright normally disables bfcache. Restore the browser default for this dedicated check.
const browser=await chromium.launch({executablePath:process.env.SCROLLCRAFT_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,ignoreDefaultArgs:['--disable-back-forward-cache']});
const base=process.env.SITE_PREVIEW_URL||'http://localhost:4211/site-preview/';const results=[];
try{for(const width of [1440,390]){
 const c=await browser.newContext({viewport:{width,height:1000}});await c.addInitScript(()=>{
  window.__bf={token:crypto.randomUUID(),shown:[],ready:0};addEventListener('pageshow',event=>window.__bf.shown.push(event.persisted));
  new MutationObserver(records=>records.forEach(record=>{if(record.target.hasAttribute('data-ac-ready'))window.__bf.ready++;})).observe(document,{subtree:true,attributes:true,attributeFilter:['data-ac-ready']});
 });const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(new URL('about/',base).href);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1600);
 await p.locator('.ac-hero .ac-link').click();await p.waitForTimeout(1300);const before=await p.evaluate(()=>({...window.__bf,y:scrollY}));
 if(width<1100){await p.locator('.hn-toggle').click();await p.waitForTimeout(270);await p.locator('.hn-panel nav a').filter({hasText:'Пациентам'}).click();}else await p.locator('.hn-desktop a').filter({hasText:'Пациентам'}).click();
 await p.waitForURL(new URL('patients/',base).href);await p.waitForTimeout(650);
 // A restored bfcache document emits pageshow, not a new load event.
 await p.evaluate(()=>history.back());await p.waitForFunction(path=>location.pathname===path&&window.__bf.shown.includes(true),new URL('about/',base).pathname);await p.waitForTimeout(200);const after=await p.evaluate(()=>({...window.__bf,y:scrollY}));
 assert.equal(after.token,before.token,'Browser must restore the same document, not load a new copy');assert.deepEqual(after.shown,[false,true]);assert.equal(after.ready,1);assert.ok(Math.abs(after.y-before.y)<25);assert.equal(await p.locator('[data-about-page]').getAttribute('data-ac-ready'),'true');assert.deepEqual(errors,[]);
 results.push({width,before,after,pass:true});console.log('PASS real bfcache',width);await c.close();
}await fs.writeFile('outputs/site-preview/bfcache.json',JSON.stringify(results,null,2));}finally{await browser.close()}
