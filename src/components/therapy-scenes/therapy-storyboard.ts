const instances=new WeakMap<HTMLElement,()=>void>();
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{v=clamp(v);return v*v*(3-2*v)};
export function initStoryboard(root:HTMLElement){
 if(instances.has(root))return instances.get(root);
 const abort=new AbortController(),mq=matchMedia('(prefers-reduced-motion: reduce)'),pin=root.querySelector<HTMLElement>('.sb-pin')!,image=root.querySelector<HTMLImageElement>('.sb-loader')!,shots=[...root.querySelectorAll<HTMLElement>('[data-sb-shot]')];
 let start=0,span=1,raf=0,ready=false;
 const staticMode=()=>mq.matches||(innerWidth>=768&&innerHeight<500)||document.documentElement.dataset.reading==='on';
 function render(){raf=0;if(!ready)return;
  if(staticMode()){for(const shot of shots){shot.style.cssText='';shot.removeAttribute('aria-hidden');}return;}
  const p=clamp((scrollY-start)/span),a=ease((p-.16)/.24),b=ease((p-.56)/.24),child=root.classList.contains('sb-children');
  root.dataset.sbProgress=p.toFixed(4);
  shots.forEach((shot,i)=>{const opacity=i===0?1:i===1?a:b;
   shot.style.opacity=String(opacity);shot.style.visibility=opacity<.001?'hidden':'visible';shot.setAttribute('aria-hidden',String(i!==(b>=.5?2:a>=.5?1:0)));
   const photo=shot.querySelector<HTMLElement>('.sb-photo')!;
   photo.style.transform=child?`translateX(${i===0?-a*6:i===1?(1-a)*8-b*6:(1-b)*8}%)`:`scale(${i===0?1.16-.16*a:i===1?1.16-.16*a-.05*b:1.12-.12*b})`;
   if(i===2&&b===1)photo.style.transform='none';
  });
 }
 function measure(){if(!ready)return;root.dataset.sbMode=staticMode()?'static':'scroll';
  const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--of-header-height'))||89;
  const travel=innerWidth<768?850:1100;
  root.style.setProperty('--sb-height',`${pin.offsetHeight+travel}px`);
  start=Math.max(0,root.getBoundingClientRect().top+scrollY-header-16);span=travel;
  root.dataset.sbStart=String(start);root.dataset.sbSpan=String(span);render();
 }
 function queue(){if(!raf)raf=requestAnimationFrame(render)}
 const observer=new MutationObserver(measure);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-reading']});
 addEventListener('scroll',queue,{passive:true,signal:abort.signal});addEventListener('resize',measure,{signal:abort.signal});addEventListener('of-header-resize',measure,{signal:abort.signal});addEventListener('pageshow',measure,{signal:abort.signal});mq.addEventListener('change',measure,{signal:abort.signal});
 const cleanup=()=>{abort.abort();observer.disconnect();cancelAnimationFrame(raf);root.dataset.sbMode='static';shots.forEach(shot=>{shot.style.cssText='';shot.removeAttribute('aria-hidden')});instances.delete(root)};
 instances.set(root,cleanup);addEventListener('pagehide',e=>{if(!e.persisted)cleanup()},{signal:abort.signal});
 void Promise.all([image.decode(),document.fonts.ready]).then(()=>{if(abort.signal.aborted)return;ready=true;root.dataset.sbReady='true';measure()}).catch(()=>{root.dataset.sbMode='static'});
 return cleanup;
}
