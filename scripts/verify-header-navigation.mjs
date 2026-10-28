import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:process.env.SCROLLCRAFT_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const url=process.env.HEADER_PREVIEW_URL||'http://localhost:4190/header-navigation-preview/';
const out='outputs/header-navigation';await fs.mkdir(out,{recursive:true});const results=[];
try {
 for(const [label,width,reducedMotion,javaScriptEnabled] of [['desktop',1440,'no-preference',true],['tablet',768,'no-preference',true],['phone',390,'no-preference',true],['compact',320,'no-preference',true],['reduced',390,'reduce',true],['no-js',390,'no-preference',false]]){
  const c=await b.newContext({viewport:{width,height:900},reducedMotion,javaScriptEnabled});
  await c.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Document.prototype.exitPointerLock=()=>{};});
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.evaluate(()=>document.fonts.ready);
  const disclosure=p.locator('.hn-disclosure'),toggle=p.locator('.hn-toggle');
  const layout=async()=>p.evaluate(()=>{
   const brand=document.querySelector('.hn-brand').getBoundingClientRect(),cta=document.querySelector('.hn-cta').getBoundingClientRect(),head=document.querySelector('.hn-header').getBoundingClientRect(),main=document.querySelector('main').getBoundingClientRect();
   return {overflow:document.documentElement.scrollWidth>innerWidth,overlap:brand.right>cta.left+.1,covered:head.bottom>main.top+.1};
  });
  assert.deepEqual(await layout(),{overflow:false,overlap:false,covered:false});
  await p.screenshot({path:`${out}/${label}-light.png`});
  assert.equal(await p.locator('a[href^="tel:"]').count(),0);
  assert.equal(await p.locator('.hn-brand img').evaluate(i=>i.complete&&i.naturalWidth>0),true);
  if(width<1100){
   await toggle.focus();await p.keyboard.press('Enter');await p.waitForTimeout(270);assert.equal(await disclosure.evaluate(d=>d.open),true);
   assert.deepEqual(await layout(),{overflow:false,overlap:false,covered:false});await p.screenshot({path:`${out}/${label}-open.png`});
   await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement?.getAttribute('href')),'#approach');
   if(javaScriptEnabled){await p.keyboard.press('Escape');await p.waitForTimeout(210);assert.equal(await disclosure.evaluate(d=>d.open),false);assert.equal(await toggle.evaluate(t=>t===document.activeElement),true);
    for(const id of ['approach','services','doctors','contacts']){
     await toggle.click();await p.waitForTimeout(260);await p.locator(`.hn-panel nav a[href="#${id}"]`).click();await p.waitForTimeout(650);
     assert.equal(await disclosure.evaluate(d=>d.open),false);assert.equal(await p.evaluate(()=>document.activeElement?.id),id);assert.equal(new URL(p.url()).hash,`#${id}`);
    }
    await toggle.click();await p.waitForTimeout(270);await p.locator('.hn-panel nav ul').evaluate(ul=>{const item=ul.firstElementChild;for(let i=0;i<12;i++){const x=item.cloneNode(true);x.querySelector('a').firstChild.textContent='ОченьДлинноеНазваниеРаздела'.repeat(6);ul.append(x);}});
    assert.equal((await layout()).overflow,false);assert.ok(await p.locator('.hn-panel').evaluate(x=>x.scrollHeight>x.clientHeight));await p.screenshot({path:`${out}/${label}-long-menu.png`});await p.locator('.hn-panel nav ul').evaluate(ul=>{while(ul.children.length>4)ul.lastElementChild.remove();});await p.locator('.hn-panel-contact').focus();await p.keyboard.press('Escape');await p.waitForTimeout(210);
    await toggle.click();await p.waitForTimeout(260);await p.setViewportSize({width:1440,height:900});await p.waitForTimeout(100);assert.equal(await disclosure.evaluate(d=>d.open),false);assert.equal(await p.locator('.hn-cta').evaluate(a=>a===document.activeElement),true);await p.setViewportSize({width,height:900});
   }else{await toggle.focus();await p.keyboard.press('Enter');assert.equal(await disclosure.evaluate(d=>d.open),false);}
  }
  if(javaScriptEnabled){
   await p.getByRole('button',{name:'Графитовый',exact:true}).click();await p.waitForTimeout(200);await p.locator('.hn-brand').scrollIntoViewIfNeeded();
   assert.equal(await p.locator('[data-hn-header]').getAttribute('data-theme'),'dark');await p.screenshot({path:`${out}/${label}-dark.png`});
   if(width<1100){await toggle.click();await p.waitForTimeout(270);await p.screenshot({path:`${out}/${label}-dark-open.png`});await toggle.press('Escape');await p.waitForTimeout(200);}
   if(reducedMotion==='reduce')assert.equal(await p.locator('.hn-cta').evaluate(a=>getComputedStyle(a).transitionDuration),'0s');
  }
  assert.deepEqual(errors,[]);results.push({label,width,pass:true,errors});await c.close();
 }
 console.log('PASS: 1440/768/390/320, themes, long scrollable menu, keyboard/Tab/Escape, anchor focus, resize, no overlap/overflow, reduced motion and no-JS.');
}finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(results,null,2));await b.close();}
