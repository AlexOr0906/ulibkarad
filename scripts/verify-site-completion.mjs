import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=(process.env.PREVIEW_URL||'http://localhost:4186').replace(/\/$/,'');
const routes=['','about/','patients/','adult-therapy/','children-therapy/','orthopedics/','orthodontics-concept/'];
const out='work/verification/site-completion';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const links=new Set(),reports=[];
try{
for(const width of (process.env.WIDTHS?process.env.WIDTHS.split(",").map(Number):[320,390,768,1440]))for(const mode of ['normal','reduced','nojs']){
 const c=await browser.newContext({viewport:{width,height:width===320?700:900},hasTouch:width<768,isMobile:width<768,javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'}),p=await c.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 for(const route of routes){
  await p.goto(`${base}/${route}`);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(100);
  for(const selector of ['h1','main','.hn-header','.cf-footer'])assert.equal(await p.locator(selector).count(),1,route+selector);
  assert.ok(await p.title());assert.ok(await p.locator('meta[name=description]').getAttribute('content'));
  for(const href of await p.locator('a[href]').evaluateAll(items=>items.map(a=>a.href)))links.add(href);
  for(const img of await p.locator('img').all()){if(!await img.evaluate(e=>e.getClientRects().length))continue;await img.evaluate(e=>e.scrollIntoView({behavior:"instant",block:"center"}));await img.evaluate(e=>{e.loading='eager';return Promise.race([e.decode(),new Promise((_,reject)=>setTimeout(()=>reject(new Error(e.src)),5000))]);});}
  for(const fraction of [0,.5,1,.5,0]){await p.evaluate(f=>scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*f,behavior:'instant'}),fraction);await p.waitForTimeout(80);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${mode} ${route}`);}
  if(route&&mode==='normal'){
   await p.waitForTimeout(500);await p.screenshot({path:`${out}/${route.replace('/','')}-${width}-top.png`});
   if(await p.locator('.se-overview').count()){await p.locator('.se-overview').scrollIntoViewIfNeeded();await p.waitForTimeout(500);await p.screenshot({path:`${out}/${route.replace('/','')}-${width}-content.png`});}
  }
  if(mode==='reduced')assert.equal(await p.locator('main').evaluate(e=>e.getAnimations({subtree:true}).length),0);
  if(width<1100){await p.locator('.hn-toggle').focus();await p.keyboard.press('Enter');if(mode!=='nojs'){await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('[data-hn-disclosure]').open);assert.equal(await p.locator('.hn-toggle').evaluate(e=>e===document.activeElement),true);}else await p.keyboard.press('Enter');}
  if(route.includes('therapy')||route==='orthopedics/'||route==='orthodontics-concept/'){
   const team=p.locator('.se-team-price a');await team.focus();assert.equal(await team.evaluate(e=>e.matches(':focus-visible')),true);await Promise.all([p.waitForURL('**/#doctors'),p.keyboard.press('Enter')]);
   await p.goBack();await p.waitForURL(`**/${route}**`);await p.goForward();await p.waitForURL('**/#doctors');await p.goBack();await p.waitForURL(`**/${route}**`);
   await p.locator('.se-action').focus();await Promise.all([p.waitForURL('**/#contacts'),p.keyboard.press('Enter')]);
  }
 }
 if(mode==='normal'){
  await p.goto(base+'/');for(const title of ['Взрослая терапия','Детская терапия','Ортопедия','Ортодонтия']){const d=p.locator('#of-directions details').filter({has:p.locator('summary',{hasText:title})});await d.locator('summary').click();assert.equal(await d.locator('a[href]').count(),1);}
  const buttons=p.locator('[data-doctor-open]');for(let i=0;i<await buttons.count();i++){await buttons.nth(i).click();await p.waitForTimeout(350);assert.ok(await p.locator('#doctor-demo').evaluate(e=>e.open));await p.keyboard.press('Escape');await p.waitForTimeout(350);assert.equal(await p.locator('#doctor-demo').evaluate(e=>e.open),false);assert.equal(await buttons.nth(i).evaluate(e=>e===document.activeElement),true);}
 }
 assert.deepEqual(errors,[]);reports.push({width,mode,routes:routes.length,passed:true});console.log('PASS site',width,mode);await c.close();
}
const c=await browser.newContext();const cache=new Map();for(const href of links){const url=new URL(href);if(url.origin!==base)continue;const key=url.origin+url.pathname;if(!cache.has(key)){const r=await c.request.get(key);assert.equal(r.status(),200,key);cache.set(key,await r.text());}if(url.hash){const id=decodeURIComponent(url.hash.slice(1));assert.ok(cache.get(key).includes(`id="${id}"`),href);}}
await c.close();await fs.writeFile(`${out}/report-${process.env.WIDTHS||"all"}.json`,JSON.stringify({reports,linksChecked:links.size},null,2));console.log('PASS links and fragments',links.size);
}finally{await browser.close();}
