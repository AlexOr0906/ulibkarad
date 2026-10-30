import {sitePages} from '@/data/site-pages';
interface SearchPage {title:string;url:string;text:string;description:string;}
export function initSearch(){
 const root=document.querySelector<HTMLElement>('[data-site-search]');if(!root)return;
 const form=root.querySelector('form')!,input=root.querySelector('input')!,status=root.querySelector<HTMLElement>('[data-search-status]')!,results=root.querySelector('[data-search-results]')!;
 let index:Promise<SearchPage[]>|undefined,sequence=0;
 const normalize=(text:string)=>text.toLocaleLowerCase('ru').replace(/ё/g,'е');
 async function loadIndex():Promise<SearchPage[]>{const response=await fetch(root!.dataset.index!);
  if(response.ok)return (await response.json()).pages;
  if(response.status!==404)throw Error('Index unavailable');
  // Astro dev has no build artifact yet. Read only the same seven documents.
  const base=root!.dataset.index!.replace(/search-index\.json$/,'');
  return Promise.all(sitePages.map(async page=>{const url=base+page.path,r=await fetch(url);if(!r.ok)throw Error('Page unavailable');const document=new DOMParser().parseFromString(await r.text(),'text/html'),main=document.querySelector('main');if(!main)throw Error('Content unavailable');main.querySelectorAll('script,style,svg,dialog').forEach(e=>e.remove());return {...page,url,text:(main.textContent||'').replace(/\s+/g,' ').trim()};}));
 }
 async function run(){const request=++sequence,q=input.value.trim().slice(0,160);results.replaceChildren();
  if(!q){status.textContent='Введите название направления или слово из текста.';return;}
  status.textContent='Ищем…';
  try{index??=loadIndex();const pages=await index;if(request!==sequence)return;
   const words=normalize(q).split(/\s+/).filter(Boolean),found=pages.map(page=>{const text=normalize(page.title+' '+page.description+' '+page.text);return {page,score:words.every(w=>text.includes(w))?words.reduce((n,w)=>n+(normalize(page.title).includes(w)?10:1),0):0};}).filter(item=>item.score>0).sort((a,b)=>b.score-a.score);
   status.textContent=found.length?`Найдено страниц: ${found.length}.`:'Ничего не найдено. Попробуйте другое слово или откройте карту сайта.';
   for(const {page} of found){const li=document.createElement('li'),a=document.createElement('a'),p=document.createElement('p');a.href=page.url;a.textContent=page.title;const at=normalize(page.text).indexOf(words[0]),start=Math.max(0,at-65);p.textContent=(start?'…':'')+page.text.slice(start,start+230)+(page.text.length>start+230?'…':'');li.append(a,p);results.append(li);}
  }catch{index=undefined;if(request===sequence)status.textContent='Поиск временно недоступен. Воспользуйтесь картой сайта или попробуйте ещё раз.';}
 }
 form.addEventListener('submit',e=>{e.preventDefault();const url=new URL(location.href);input.value.trim()?url.searchParams.set('q',input.value.trim()):url.searchParams.delete('q');history.pushState(null,'',url);void run();});
 const restore=()=>{input.value=new URL(location.href).searchParams.get('q')?.slice(0,160)||'';void run();};window.addEventListener('popstate',restore);restore();
}
