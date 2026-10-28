import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const c=await b.newContext({viewport:{width:1440,height:1000}});
await c.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Document.prototype.exitPointerLock=()=>{};});
const p=await c.newPage();await p.goto('http://localhost:4173/?review=doctors-entry#doctors');await p.waitForTimeout(1000);
const btn=p.getByRole('button',{name:'Повторить появление'});await btn.click();
await p.waitForTimeout(180);
const state=await p.locator('[data-team-rail]').getAttribute('data-team-entrance');assert.equal(state,'playing');
// An ordinary wheel delta triggers the OLD shared motion-fast guard; the local
// entrance must continue, rather than being cancelled by that shared state.
await p.mouse.wheel(0,180);await p.waitForTimeout(100);
assert.equal(await p.locator('[data-team-rail]').getAttribute('data-team-entrance'),'playing');
await p.screenshot({path:'outputs/doctors/entrance/replay-mid.png'});
await p.waitForTimeout(1300);assert.equal(await p.locator('[data-team-rail]').getAttribute('data-team-entrance'),'complete');
console.log('PASS: replay visibly animates; ordinary wheel does not cancel it.');await b.close();
