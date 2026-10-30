import {chromium} from 'playwright-core';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'http://localhost:4186',out='work/verification/review-round';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'}),report=[];
try{
 for(const width of [320,390,768,1440])for(const mode of ['normal','reduced','nojs']){
  const c=await browser.newContext({viewport:{width,height:width===320?700:900},hasTouch:width<768,isMobile:width<768,javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  for(const route of ['','about/','patients/','adult-therapy/','children-therapy/','orthopedics/','orthodontics-concept/','orthopedics-reveal-review/']){
   await p.goto(base+'/'+route,{waitUntil:'domcontentloaded'});await p.evaluate(()=>document.fonts.ready);
   assert.equal(await p.locator('h1').count(),1);assert.ok(!/прототип|демо|концепция/i.test(await p.title()));
   if(!route.includes('review'))assert.ok(!/редакцион|знаков|Временное наполнение/i.test(await p.locator('main').innerText()));
   assert.equal(await p.locator('[data-doctor-card]').count(),0);
   if(route==='orthopedics/'||route.includes('reveal-review')){
    for(const root of await p.locator('[data-or-variant=human]').all()){
     if(mode!=='nojs')await root.evaluate(e=>new Promise((resolve,reject)=>{const end=Date.now()+10000;function check(){if(e.dataset.orImageReady==='true')resolve(true);else if(Date.now()>end)reject(Error('Image readiness timed out'));else setTimeout(check,30);}check();}));
     const range=await root.evaluate(e=>({start:+(e.dataset.orStart||0),span:+(e.dataset.orSpan||1)}));
     for(const t of [0,.5,1,.5,0]){await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),range.start+range.span*t);await p.waitForTimeout(60);if(mode==='normal'){assert.ok(Math.abs(Number(await root.getAttribute('data-or-progress'))-t)<.02);if([0,.5,1].includes(t))await root.locator('.or-human-stage').screenshot({path:`${out}/portrait-${await root.getAttribute('data-or-opening')}-${width}-${t}.png`});}}
    }
   }
   if(route==='orthodontics-concept/'){
    const root=p.locator('[data-oa]');await p.waitForTimeout(100);const range=await root.evaluate(e=>({start:+(e.dataset.start||0),span:+(e.dataset.span||1)}));
    for(const t of [0,.3,.65,1,.5,0]){await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),range.start+range.span*t);await p.waitForTimeout(60);
     if(mode==='normal'){assert.ok(Math.abs(Number(await root.getAttribute('data-progress'))-t)<.02);assert.equal(await p.locator('[data-oa-camera]').getAttribute('transform'),await p.locator('[data-oa-wire-camera]').getAttribute('transform'));for(const b of await p.locator('[data-oa-bracket]').all())assert.equal(await b.getAttribute('transform'),null);await p.locator('[data-oa-stage]').screenshot({path:`${out}/braces-${width}-${t}.png`});}
    }
   }
   if(mode==='normal'&&route==='orthodontics-concept/'){const root=p.locator('[data-oa]');const r=await root.evaluate(e=>({start:+e.dataset.start,span:+e.dataset.span}));await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),r.start+r.span*.5);await p.waitForTimeout(90);await p.reload({waitUntil:'domcontentloaded'});await p.waitForTimeout(250);assert.ok(Math.abs(Number(await root.getAttribute('data-progress'))-.5)<.05);}
   for(const fraction of [1,0]){await p.evaluate(f=>scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*f,behavior:'instant'}),fraction);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} ${width} ${mode}`);}
   if(mode==='normal'&&route.includes('therapy')){await p.waitForTimeout(650);await p.screenshot({path:`${out}/${route.replace('/','')}-${width}.png`,fullPage:true});}
  }
  assert.deepEqual(errors,[]);await c.close();report.push({width,mode,passed:true});console.log('PASS review',width,mode);
 }
 // Hold the portrait response: loading must reserve geometry and never play hidden motion.
 for(const width of [390,1440]){
  const c=await browser.newContext({viewport:{width,height:900}}),p=await c.newPage(),cdp=await c.newCDPSession(p);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:100000,uploadThroughput:100000});
  let release;const gate=new Promise(resolve=>release=resolve);await c.route('**/human-smile-v1.webp',async r=>{await gate;await r.continue();});await p.goto(base+'/orthopedics/',{waitUntil:'domcontentloaded'});await p.evaluate(()=>document.fonts.ready);
  const root=p.locator('[data-or-variant=human]'),before=await root.boundingBox();assert.notEqual(await root.getAttribute('data-or-image-ready'),'true');assert.equal(await root.locator('.or-human-photo').evaluate(e=>getComputedStyle(e).opacity),'0');
  const r=await root.evaluate(e=>({start:+e.dataset.orStart,span:+e.dataset.orSpan}));await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),r.start+r.span*.5);await p.waitForTimeout(100);assert.equal(await root.getAttribute('data-or-progress'),null);release();await p.waitForFunction(()=>document.querySelector('[data-or-variant=human]').dataset.orImageReady==='true');const after=await root.boundingBox();assert.ok(Math.abs(before.height-after.height)<2);assert.ok(Math.abs(Number(await root.getAttribute('data-or-progress'))-.5)<.03);
  await c.unroute('**/human-smile-v1.webp');await p.reload();await p.waitForFunction(()=>document.querySelector('[data-or-variant=human]').dataset.orImageReady==='true');await p.waitForTimeout(150);assert.ok(Math.abs(Number(await root.getAttribute('data-or-progress'))-.5)<.05);await c.close();console.log('PASS cold/slow portrait and mid-scene reload',width);
 }
 await fs.writeFile(out+'/report.json',JSON.stringify({matrix:report,coldSlowPortrait:[390,1440],bracketPhases:[0,.3,.65,1],portraitPhases:[0,.5,1]},null,2));
}finally{await browser.close();}
