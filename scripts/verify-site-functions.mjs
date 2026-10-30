import {chromium} from 'playwright-core';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'http://localhost:4186',out='work/verification/site-functions';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const report=[];
try{
const c=await browser.newContext(),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
const response=await c.request.get(base+'/search-index.json');assert.equal(response.status(),200);const index=await response.json();assert.equal(index.pages.length,7);assert.equal(new Set(index.pages.map(p=>p.url)).size,7);assert.ok(!index.pages.some(p=>/preview|compare|orthopedics-concepts/.test(p.url)));
await p.goto(base+'/sitemap/');assert.equal(await p.locator('[aria-label="Карта сайта"] li').count(),7);
await p.goto(base+'/search/?q=ВЗРОСЛАЯ%20ТЕРАПИЯ');await p.waitForFunction(()=>document.querySelector('[data-search-status]').textContent.includes('Найдено'));assert.equal(await p.locator('[data-search-results] a').first().innerText(),'Взрослая терапия');
await p.locator('main input').fill('ПРОФИМЕД');await p.locator('main form button').click();await p.waitForFunction(()=>document.querySelector('[data-search-status]').textContent.includes('Найдено'));assert.ok(await p.locator('[data-search-results] a').count());
await p.locator('main input').fill('несуществующееслово123456');await p.locator('main form button').click();await p.waitForFunction(()=>document.querySelector('[data-search-status]').textContent.includes('Ничего'));await p.goBack();await p.waitForFunction(()=>document.querySelector('main input').value==='ПРОФИМЕД');
await p.locator('main input').fill('');await p.locator('main form button').click();assert.equal(await p.locator('[data-search-results] li').count(),0);report.push('Search: index, ranking, case, body text, empty/no results, URL and back');
await c.route('**/search-index.json',r=>r.abort());await p.goto(base+'/search/?q=терапия');await p.waitForFunction(()=>document.querySelector('[data-search-status]').textContent.includes('недоступен'));assert.ok(await p.locator('a[href$="sitemap/"]').count());await c.unroute('**/search-index.json');
await c.route('**/search-index.json',r=>r.fulfill({status:404,body:'Not built'}));await p.goto(base+'/search/?q=терапия');await p.waitForFunction(()=>document.querySelector('[data-search-status]').textContent.includes('Найдено'));await c.unroute('**/search-index.json');report.push('Development fallback reads only the seven allowed HTML documents');
assert.deepEqual(errors,[]);await c.close();
await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(report.join('\n'));
}finally{await browser.close();}
// The shared in-page controls replace the former submit-based settings screen.
await import('./verify-reading-controls.mjs');
