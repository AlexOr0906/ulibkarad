import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const base='http://localhost:4186',out='work/verification/orthopedics-integrated';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.ORTHOPEDICS_BROWSER_PATH||path.join(process.env.ProgramFiles,'Google/Chrome/Application/chrome.exe')});
const reports=[];
try {
 for(const [width,height,mode] of [[1440,1000,'normal'],[1024,768,'normal'],[768,1024,'normal'],[390,844,'normal'],[320,568,'normal'],[844,390,'normal'],[390,844,'reduced'],[390,844,'nojs']]) {
  const context=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768,javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  await context.addInitScript(()=>{
   Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));
   window.__sceneSubscriptions=[];const original=window.addEventListener;
   window.addEventListener=function(type,listener,options){if(type==='scroll')window.__sceneSubscriptions.push(String(listener));return original.call(this,type,listener,options);};
  });
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(`${base}/`);await page.evaluate(()=>document.fonts.ready);
  const direction=page.locator('#of-directions details').filter({has:page.locator('summary',{hasText:'Ортопедия'})});
  await direction.locator('summary').click();const link=direction.locator('a[href="/orthopedics/"]');await link.focus();
  await Promise.all([page.waitForURL('**/orthopedics/'),page.keyboard.press('Enter')]);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(180);
  for(const selector of ['h1','main','.hn-header','.cf-footer','[data-service-page]','[data-or-scene]','[data-or-content]'])assert.equal(await page.locator(selector).count(),1,selector);
  assert.equal(await page.locator('h1').innerText(),'Ортопедия');assert.equal(await page.locator('[data-service-standard-body],.or-preview-intro,form').count(),0);
  assert.equal(await page.locator('[data-or-auto-motion]').count(),0);assert.equal(await page.locator('#or-overview-title').count(),1);
  assert.ok((await page.locator('.sv-demo-note').first().innerText()).includes('Прототип направления к открытию'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.ok((await page.locator('.or-facts').innerText()).includes('Сведения будут добавлены после получения от клиники'));
  if(mode!=='nojs'){assert.equal(await page.locator('[data-or-scene]').getAttribute('data-or-ready'),'true');assert.equal(await page.evaluate(()=>new Set(window.__sceneSubscriptions).size===window.__sceneSubscriptions.length),true);}
  await page.screenshot({path:`${out}/${width}-${mode}-opening.png`});
  if(mode==='normal'){
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
   await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(100);
   const geometry=await page.locator('[data-or-scene]').evaluate(e=>({span:+e.dataset.orSpan,actual:e.offsetHeight-e.querySelector('.or-scene-panel').offsetHeight}));
   assert.ok(geometry.span>=400&&Math.abs(geometry.span-geometry.actual)<2,JSON.stringify(geometry));
  }
  const range=await page.locator('[data-or-scene]').evaluate(e=>({start:+(e.dataset.orStart||0),span:+(e.dataset.orSpan||1)})),states=[];
  for(const progress of [0,.5,1,.85,.5,0]) {
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),range.start+range.span*progress);await page.waitForTimeout(100);
   const state=await page.locator('[data-or-scene]').evaluate(e=>({scale:+(e.dataset.orScale||1),pose:e.querySelector('[data-or-object]').getAttribute('transform'),progress:+(e.dataset.orProgress||1)}));states.push(state);
   if(mode==='normal')assert.ok(Math.abs(state.progress-progress)<.012);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if([0,.5,1].includes(progress))await page.screenshot({path:`${out}/${width}-${mode}-scene-${progress}.png`});
  }
  if(mode==='normal'){assert.equal(states[1].pose,states[4].pose);assert.equal(states[2].pose,states[3].pose);assert.ok(range.span>=400);}
  if(mode==='reduced')assert.equal(await page.locator('.or-content').evaluate(e=>e.getAnimations({subtree:true}).length),0);
  await page.locator('.or-price').evaluate(e=>e.scrollIntoView());await page.waitForTimeout(180);await page.screenshot({path:`${out}/${width}-${mode}-body.png`});
  assert.ok((await page.locator('.or-price').innerText()).includes('Прайс ожидается'));
  if(width<768&&mode!=='nojs') {const menu=page.locator('.hn-toggle');await menu.focus();await page.keyboard.press('Enter');await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('[data-hn-disclosure]').open);assert.equal(await page.locator('[data-hn-disclosure]').getAttribute('open'),null);}
  await page.locator('.or-contact .or-button').focus();await Promise.all([page.waitForURL('**/#contacts'),page.keyboard.press('Enter')]);assert.equal(await page.locator('#contacts').count(),1);
  await page.goBack();await page.waitForURL('**/orthopedics/');await page.waitForTimeout(180);
  assert.equal(await page.locator('[data-or-scene]').count(),1);
  if(mode!=='nojs')assert.equal(await page.evaluate(()=>new Set(window.__sceneSubscriptions).size===window.__sceneSubscriptions.length),true);
  await page.reload();await page.waitForTimeout(180);assert.equal(await page.locator('h1').count(),1);
  await page.locator('.sv-crumbs a').focus();await Promise.all([page.waitForURL(`${base}/`),page.keyboard.press('Enter')]);
  for(const route of ['about/','patients/']){await page.goto(`${base}/${route}`);assert.equal(await page.locator('main').count(),1);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
  await page.goto(`${base}/orthopedics/`);await page.waitForTimeout(180);
  if(mode!=='nojs') {
   assert.equal(await page.locator('[data-or-scene]').getAttribute('data-or-ready'),'true');
   await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));assert.equal(await page.locator('[data-or-scene]').getAttribute('data-or-ready'),'true');
   await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
   await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false})));
   assert.equal(await page.locator('[data-or-scene]').getAttribute('data-or-ready'),null);assert.equal(await page.locator('[data-or-content]').getAttribute('data-or-ready'),null);
  }
  assert.deepEqual(errors,[]);reports.push({width,height,mode,range,states,passed:true});console.log('PASS integrated',width,height,mode);await context.close();
 }
 await fs.writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));
} finally {await browser.close();}
