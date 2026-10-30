import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'http://localhost:4186';
const out='work/verification/therapy';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 for(const width of [320,390,768,1440])for(const mode of ['normal','reduced','nojs']){
  const c=await browser.newContext({viewport:{width,height:width===320?700:900},hasTouch:width<768,isMobile:width<768,javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  for(const [route,label,id] of [['adult-therapy','Взрослая терапия','adult-therapy'],['children-therapy','Детская терапия','children-therapy']]){
   await p.goto(base+'/');const direction=p.locator('#of-directions details').filter({has:p.locator('summary',{hasText:label})});await direction.locator('summary').click();
   const entry=direction.locator(`a[href="/${route}/"]`);await entry.focus();await Promise.all([p.waitForURL(`**/${route}/`),p.keyboard.press('Enter')]);await p.evaluate(()=>document.fonts.ready);
   assert.equal(await p.locator('h1').innerText(),label);assert.ok((await p.title()).includes(label));
   for(const selector of ['main','.hn-header','.cf-footer','[data-service-page]'])assert.equal(await p.locator(selector).count(),1);
   assert.equal(await p.locator('.se-help').count(),1);assert.equal(await p.locator('.sv-doctors,.sv-prices').count(),0);
   for(const img of await p.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());assert.ok(await img.evaluate(e=>e.naturalWidth>0));}
   await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   await p.waitForTimeout(600);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(mode==='normal')await p.screenshot({path:`${out}/${route}-${width}-top.png`});
   const more=p.locator('.th-link');await more.focus();assert.equal(await more.evaluate(e=>e.matches(':focus-visible')),true);await p.keyboard.press('Enter');await p.waitForTimeout(600);
   const top=await p.locator(`#sv-${id}-description`).evaluate(e=>e.getBoundingClientRect().top);assert.ok(top>=70,`anchor top ${top}`);
   if(mode==='normal')await p.screenshot({path:`${out}/${route}-${width}-body.png`});
   await p.locator('.th-introduction').evaluate(e=>e.scrollIntoView());await p.waitForTimeout(550);
   if(mode==='normal')await p.screenshot({path:`${out}/${route}-${width}-scene.png`});
   if(mode==='reduced')assert.equal(await p.locator('main').evaluate(e=>e.getAnimations({subtree:true}).length),0);
   if(width<768&&mode!=='nojs'){await p.locator('.hn-toggle').click();await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('[data-hn-disclosure]').open);assert.equal(await p.locator('[data-hn-disclosure]').getAttribute('open'),null);}
   await p.locator('.se-action').focus();await Promise.all([p.waitForURL('**/#contacts'),p.keyboard.press('Enter')]);
   await p.goBack();await p.waitForURL(`**/${route}/**`);await p.goForward();await p.waitForURL('**/#contacts');
   await p.goto(`${base}/${route}/`);await p.locator('.sv-crumbs a').focus();await Promise.all([p.waitForURL(base+'/'),p.keyboard.press('Enter')]);
  }
  assert.deepEqual(errors,[]);console.log('PASS therapy',width,mode);await c.close();
 }
}finally{await browser.close();}
