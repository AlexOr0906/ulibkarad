/** Shared controller for the global panel and settings page. */
export function initReadingSettings(){
 const html=document.documentElement;
 if(html.dataset.readingControls)return;html.dataset.readingControls='true';
 const forms=[...document.querySelectorAll<HTMLFormElement>('[data-reading-form]')];
 const dialog=document.querySelector<HTMLDialogElement>('[data-reading-dialog]');
 let opener:HTMLElement|null=null;
 function sync(){
  const on=html.dataset.reading==='on';
  forms.forEach(form=>{
   (form.elements.namedItem('enabled') as HTMLInputElement).checked=on;
   (form.elements.namedItem('hideImages') as HTMLInputElement).checked=html.dataset.hideImages==='true';
   for(const [key,value] of [['size',html.dataset.textSize||'normal'],['contrast',html.dataset.contrast||'light']]){
    const input=form.querySelector<HTMLInputElement>(`input[name="${key}"][value="${value}"]`);if(input)input.checked=true;
   }
   form.querySelector('[data-reading-state]')!.textContent=on?'включена':'выключена';
  });
  document.querySelectorAll('[data-reading-entry-label]').forEach(e=>e.textContent=on?'Версия для слабовидящих: включена':'Версия для слабовидящих');
 }
 function save(){
  let saved=true;
  try{localStorage.setItem('of-reading',JSON.stringify({enabled:html.dataset.reading==='on',size:html.dataset.textSize||'normal',contrast:html.dataset.contrast||'light',hideImages:html.dataset.hideImages==='true'}));}catch{saved=false;}
  sync();dispatchEvent(new Event('resize'));
  forms.forEach(form=>form.querySelector('[data-reading-status]')!.textContent=saved?'Настройки сохранены.':'Настройки применены только на этой странице: браузер запретил сохранение.');
 }
 forms.forEach(form=>{
  form.addEventListener('submit',e=>e.preventDefault());
  form.addEventListener('change',e=>{
   const input=e.target as HTMLInputElement;
   html.dataset.reading=input.name==='enabled'?(input.checked?'on':'off'):'on';
   const data=new FormData(form);html.dataset.textSize=String(data.get('size')||'normal');html.dataset.contrast=String(data.get('contrast')||'light');html.dataset.hideImages=String(data.has('hideImages'));save();
  });
  form.querySelector('[data-reading-reset]')!.addEventListener('click',()=>{html.dataset.reading='off';html.dataset.textSize='normal';html.dataset.contrast='light';html.dataset.hideImages='false';save();});
 });
 document.querySelectorAll<HTMLAnchorElement>('[data-reading-open]').forEach(link=>link.addEventListener('click',e=>{
  if(!dialog||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  e.preventDefault();opener=link;
  html.dataset.reading='on';save();dialog.showModal();
  dialog.querySelector<HTMLButtonElement>('[data-reading-close]')?.focus();
 }));
 document.querySelector('[data-reading-off]')?.addEventListener('click',()=>{html.dataset.reading='off';save();dialog?.close();});
 dialog?.querySelectorAll('[data-reading-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
 dialog?.addEventListener('keydown',e=>{
  if(e.key!=='Tab')return;
  const focusable=[...dialog.querySelectorAll<HTMLElement>('button,input,a[href]')].filter(el=>el.getClientRects().length&&!(el instanceof HTMLInputElement&&el.type==='radio'&&!el.checked));
  const first=focusable[0],last=focusable[focusable.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
 });
 dialog?.addEventListener('close',()=>opener?.focus({preventScroll:true}));
 window.addEventListener('pageshow',sync);window.addEventListener('storage',sync);sync();
}
