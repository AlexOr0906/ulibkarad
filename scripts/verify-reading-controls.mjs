import {chromium} from 'playwright-core';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const base='http://localhost:4186',out='work/verification/reading-controls';await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const results=[];
try{for(const width of [320,390,768,1440]){
 const c=await b.newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/');assert.ok(await p.locator('.rc-entry a').isVisible());assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.locator('.rc-entry a').focus();await p.keyboard.press('Enter');
 const d=p.locator('[data-reading-dialog]');await d.waitFor({state:'visible'});assert.equal(await p.locator('html').getAttribute('data-reading'),'on');
 await d.locator('[name=size][value=largest]').check();await d.locator('[name=contrast][value=dark]').check();
 assert.equal(await p.locator('html').getAttribute('data-text-size'),'largest');await p.screenshot({path:`${out}/panel-${width}.png`});
 for(let i=0;i<18;i++){await p.keyboard.press('Tab');assert.ok(await d.evaluate(e=>e.contains(document.activeElement)));}await p.keyboard.press('Escape');assert.equal(await d.isVisible(),false);assert.equal(await p.locator('[data-reading-open]').first().evaluate(e=>e===document.activeElement),true);
 for(const route of ['/','/about/','/patients/','/adult-therapy/','/children-therapy/','/orthopedics/','/orthodontics-concept/']){
 await p.goto(base+route);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
 assert.equal(await p.locator('html').getAttribute('data-reading'),'on');
 const geom=await p.evaluate(()=>({w:innerWidth,sw:document.documentElement.scrollWidth,bad:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2&&e.getClientRects().length).slice(0,8).map(e=>e.className)}));assert.ok(geom.sw<=width,JSON.stringify({route,width,...geom}));
 if(width===390)await p.screenshot({path:`${out}/page-${route.replaceAll('/','')||'home'}.png`});
 }
 await p.locator('[data-reading-open]').first().click();await d.locator('[name=hideImages]').check();await p.keyboard.press('Escape');assert.equal(await p.locator('main img:visible').count(),0);
 await p.goto(base+'/accessibility/');const f=p.locator('main [data-reading-form]');await f.locator('[data-reading-reset]').click();assert.equal(await p.locator('html').getAttribute('data-reading'),'off');
 await p.locator('.rc-entry a').click();await d.locator('[data-reading-off]').click();assert.equal(await d.isVisible(),false);await p.goBack();assert.equal(await p.locator('html').getAttribute('data-reading'),'off');assert.deepEqual(errors,[]);results.push({width,pages:7,status:'passed'});await c.close();
}
for(const mode of ['nojs','reduced']){const c=await b.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'});const p=await c.newPage();await p.goto(base+'/accessibility/');assert.ok(await p.locator('h1').isVisible());if(mode==='nojs')assert.equal(await p.locator('main [data-reading-form]').isVisible(),false);else{await p.locator('[data-reading-open]').first().click();await p.keyboard.press('Escape');}await c.close();results.push({mode,status:'passed'});}
await fs.writeFile(out+'/results.json',JSON.stringify(results,null,2));console.log(results);
}finally{await b.close()}
