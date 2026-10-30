export function initReadingSettings(){const form=document.querySelector<HTMLFormElement>('[data-reading-form]');if(!form)return;
 const enabled=form.elements.namedItem('enabled') as HTMLInputElement,status=form.querySelector<HTMLElement>('[data-reading-status]')!;
 enabled.checked=document.documentElement.dataset.reading==='on';
 for(const key of ['size','contrast']){const val=key==='size'?document.documentElement.dataset.textSize:document.documentElement.dataset.contrast;if(val)form.querySelector<HTMLInputElement>(`input[name="${key}"][value="${val}"]`)!.checked=true;}
 function apply(reset=false){const data=new FormData(form!);const settings={enabled:!reset&&enabled.checked,size:String(data.get('size')||'normal'),contrast:String(data.get('contrast')||'light')};
  const html=document.documentElement;html.dataset.reading=settings.enabled?'on':'off';html.dataset.textSize=settings.size;html.dataset.contrast=settings.contrast;
  let saved=true;try{localStorage.setItem('of-reading',JSON.stringify(settings));}catch{saved=false;}
  dispatchEvent(new Event('resize'));status.textContent=reset?'Обычный вид восстановлен.':saved?'Настройки применены и сохранены.':'Настройки применены. Браузер не разрешил сохранить их для следующих страниц.';
 }
 form.addEventListener('submit',e=>{e.preventDefault();apply();});form.querySelector('[data-reading-reset]')!.addEventListener('click',()=>{form.reset();enabled.checked=false;apply(true);});
}
