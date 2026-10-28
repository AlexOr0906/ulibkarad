import {chromium} from 'playwright-core';
const b=await chromium.launch({executablePath:process.env.SCROLLCRAFT_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const c=await b.newContext({viewport:{width:320,height:568}});
await c.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.reject(Error('disabled'));Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Document.prototype.exitPointerLock=()=>{};});
const p=await c.newPage();await p.goto('http://localhost:4173/?review=doctors-entry#doctors');await p.waitForTimeout(1000);await p.getByRole('button',{name:'Повторить появление'}).click();await p.waitForTimeout(800);
if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Horizontal overflow');
await p.getByRole('button',{name:'Посмотреть макет карточки 1',exact:true}).click();await p.waitForTimeout(750);await p.keyboard.press('Escape');await p.waitForTimeout(750);
console.log('PASS: compact 320px replay, no overflow, profile/Escape.');await b.close();
