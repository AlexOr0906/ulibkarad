export function initTeamProfiles(){
 document.querySelectorAll<HTMLElement>('[data-dp-collection]').forEach(root=>{
  if(root.dataset.dpReady)return;root.dataset.dpReady='true';
  root.querySelectorAll<HTMLDetailsElement>('[data-dp-profile]').forEach(details=>{
   const content=details.querySelector<HTMLElement>('[data-dp-content]')!;
   const link=root.querySelector<HTMLAnchorElement>(`a[href="#${details.id}"]`)!;
   const dialog=document.createElement('dialog');dialog.className='dp-dialog';dialog.id=`${details.id}-dialog`;
   dialog.setAttribute('aria-labelledby',content.querySelector('h2')!.id);
   const bar=document.createElement('div');bar.className='dp-dialog-bar';
   const close=document.createElement('button');close.type='button';close.textContent='Закрыть профиль ×';bar.append(close);dialog.append(bar,content);root.append(dialog);details.hidden=true;
   link.setAttribute('aria-haspopup','dialog');link.setAttribute('aria-controls',dialog.id);
   link.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();dialog.showModal();dialog.scrollTop=0;close.focus({preventScroll:true});});
   if(location.hash===`#${details.id}`){dialog.showModal();close.focus({preventScroll:true});}
   close.addEventListener('click',()=>dialog.close());
   dialog.addEventListener('close',()=>link.focus({preventScroll:true}));
   dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
   dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[...dialog.querySelectorAll<HTMLElement>('button,a[href]')].filter(el=>el.getClientRects().length);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
  });
 });
}
