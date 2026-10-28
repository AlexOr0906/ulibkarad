import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out = 'outputs/doctors/entrance'; await fs.mkdir(out,{recursive:true});
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
async function context(options={}) {
 const c=await browser.newContext({viewport:{width:1440,height:1000},...options});
 await c.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.reject(Error('Disabled in tests'));Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Document.prototype.exitPointerLock=()=>{};});
 return c;
}
async function sample(p,label){
 const value=await p.evaluate(()=>({heading:document.querySelector('[data-team-heading]').dataset.teamEntrance,rail:document.querySelector('[data-team-rail]').dataset.teamEntrance,masks:[...document.querySelectorAll('.doctor-portrait')].map(x=>getComputedStyle(x).clipPath),words:[...document.querySelectorAll('#doctors .heading-word')].map(x=>getComputedStyle(x).transform),overflow:document.documentElement.scrollWidth>innerWidth}));
 results.push({label,...value});
 const clip=await p.locator('#doctors').evaluate(e=>{const r=e.getBoundingClientRect();return {x:0,y:r.top+scrollY,width:document.documentElement.clientWidth,height:r.height}});
 await p.screenshot({path:`${out}/${label}.png`,clip,fullPage:true}); return value;
}
async function slowEnter(p,selector){
 const before=await p.locator(selector).evaluate(e=>e.getBoundingClientRect().top+scrollY-innerHeight-110);
 await p.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),before); await p.waitForTimeout(100);
 for(let i=0;i<26;i++){
  await p.evaluate(()=>window.scrollBy({top:16,behavior:'instant'})); await p.waitForTimeout(28);
  if(await p.locator(selector).getAttribute('data-team-entrance')==='playing') return;
 }
 throw Error(`No entrance started for ${selector}`);
}
try {
 for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
  const c=await context({viewport}); const p=await c.newPage(); const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://localhost:4173/'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(200);
  assert.equal(await p.locator('[data-team-rail]').getAttribute('data-team-entrance'),'armed');
  await slowEnter(p,'[data-team-heading]'); await sample(p,`${name}-heading-start`);await p.waitForTimeout(160);await sample(p,`${name}-heading-mid`);await p.waitForTimeout(700);
  await slowEnter(p,'[data-team-rail]'); const start=await sample(p,`${name}-portrait-start`);assert.equal(start.rail,'playing');
  await p.waitForTimeout(150);await sample(p,`${name}-portrait-mid`);await p.waitForTimeout(1400); const end=await sample(p,`${name}-portrait-end`);assert.equal(end.rail,'complete');assert.equal(end.overflow,false);
  await p.locator('[data-team-rail]').press('End');await p.waitForTimeout(900);assert.equal(await p.locator('[data-team-next]').isDisabled(),true);
  await p.locator('[data-team-rail]').press('Home');await p.waitForTimeout(800);
  for(let i=1;i<=4;i++){
   const button=p.getByRole('button',{name:`Посмотреть макет карточки ${i}`,exact:true});await button.focus();await button.press('Enter');await p.waitForTimeout(750);assert.equal(await p.locator('#doctor-demo').evaluate(d=>d.open),true);assert.match(await p.locator('[data-doctor-dialog-image]').getAttribute('src'),new RegExp(`demo-${i}-800`));
   await p.keyboard.press('Escape');await p.waitForTimeout(750);assert.equal(await button.evaluate(b=>b===document.activeElement),true);
  }
  assert.deepEqual(errors,[]);results.push({label:`${name}-interactions`,pass:true});await c.close();
 }
 for(const mode of ['fast','reduced','no-js']){
  const c=await context({reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});const p=await c.newPage();await p.goto('http://localhost:4173/');await p.waitForTimeout(250);
  await p.evaluate(()=>window.scrollTo({top:document.querySelector('#doctors').offsetTop,behavior:'instant'}));await p.waitForTimeout(180);
  const state=await sample(p,mode); if(mode!=='no-js')assert.equal(state.rail,'complete'); assert.ok(state.masks.every(m=>m==='none'||m==='inset(0% 0px 0px)'));assert.equal(state.overflow,false);await c.close();
 }
 console.log('PASS: desktop/mobile start-mid-end, all 4 profiles, focus/Escape, Home/End, fast/reduced/no-JS.');
} finally {await fs.writeFile(`${out}/report.json`,JSON.stringify(results,null,2));await browser.close();}
