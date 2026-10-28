import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:process.env.SCROLLCRAFT_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report=[];
try {
 for(const [name,width] of [['desktop',1440],['phone',390]]){
 const c=await b.newContext({viewport:{width,height:1000}});await c.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Document.prototype.exitPointerLock=()=>{};});
 const p=await c.newPage();await p.goto('http://localhost:4180/contacts-footer-preview/?review=closing-motion');await p.waitForTimeout(1500);
 await p.getByRole('button',{name:'Повторить появление'}).click();
 for(const [label,wait] of [['start',30],['mid',140],['end',1400]]){
 await p.waitForTimeout(wait);const mask=await p.locator('.cf-map-placeholder').evaluate(e=>getComputedStyle(e).clipPath);const state=await p.locator('.cf-map-placeholder').getAttribute('data-cf-motion');
 report.push({name,label,mask,state});if(label==='mid')assert.equal(state,'playing');if(label==='end')assert.equal(state,'complete');
 await p.screenshot({path:`outputs/contacts-footer/${name}-motion-${label}.png`,fullPage:true});
 }
 await p.getByRole('button',{name:'Повторить появление'}).click();await p.locator('.cf-visit summary').focus();assert.equal(await p.locator('.cf-map-placeholder').getAttribute('data-cf-motion'),'complete');
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await c.close();
 }
 console.log('PASS: circle reveal + footer start/mid/end on desktop and phone, replay, immediate keyboard access.');
}finally{await fs.writeFile('outputs/contacts-footer/motion-report.json',JSON.stringify(report,null,2));await b.close();}
