const instances=new WeakMap<HTMLElement,()=>void>();
const clamp=(p:number)=>Math.max(0,Math.min(1,p));
const smooth=(p:number)=>{const n=clamp(p);return n*n*(3-2*n);};
/** Local preview-only owner. Native scroll, fixed geometry, no lerp or global coordinator changes. */
export function initTherapyScene(root:HTMLElement):()=>void {
 const previous=instances.get(root);if(previous)return previous;
 root.dataset.tsInitializing='true';
 const abort=new AbortController(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const panel=root.querySelector<HTMLElement>('.ts-panel')!,camera=root.querySelector<SVGGElement>('[data-ts-camera]'),windowRect=root.querySelector<SVGRectElement>('[data-ts-window]');
 const family=root.querySelector<HTMLElement>('[data-ts-family]'),phase=root.querySelector<HTMLElement>('[data-ts-phase]')!;
 const phases=JSON.parse(root.dataset.tsPhases||'[]') as string[];
 let frame=0,start=0,span=1,last=-1,ready=false,failed=false;
 const reading=()=>document.documentElement.dataset.reading==='on';
 function render(p:number){
  const u=smooth(p/.78);
  if(camera&&windowRect){
   const scale=1.25-.25*u;
   camera.setAttribute('transform',`translate(${-82*(1-u)} ${-75*(1-u)}) scale(${scale})`);
   windowRect.setAttribute('x',String(140*(1-u)));windowRect.setAttribute('width',String(1536-280*(1-u)));windowRect.setAttribute('rx',String(24*(1-u)));
  }
  if(family){
   family.style.transform=`translateY(${10*(1-u)}px) scale(${1+.035*(1-u)})`;
   family.parentElement!.style.clipPath=`inset(${4*(1-u)}% ${5*(1-u)}% round ${10*(1-u)}px)`;
  }
  const label=p<.2?phases[0]:p<.78?phases[1]:phases[2];if(phase.textContent!==label)phase.textContent=label;
  root.dataset.tsProgress=p.toFixed(4);root.style.setProperty('--ts-unfold',u.toFixed(4));
 }
 function update(){frame=0;if(!ready)return;const p=root.dataset.tsMode==='static'?1:clamp((scrollY-start)/span);if(Math.abs(p-last)<.0001)return;last=p;render(p);}
 function queue(){if(!frame)frame=requestAnimationFrame(update);}
 function measure(){
  if(!ready)return;
  root.dataset.tsMode=reduced.matches||reading()||failed?'static':'scroll';
  const header=reading()?0:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--of-header-height'))||89;
  start=Math.max(0,root.getBoundingClientRect().top+scrollY-header-20);span=Math.max(1,root.offsetHeight-panel.offsetHeight);
  root.dataset.tsStart=String(start);root.dataset.tsSpan=String(span);last=-1;update();
 }
 const observer=new MutationObserver(measure);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-reading']});
 addEventListener('scroll',queue,{passive:true,signal:abort.signal});addEventListener('resize',measure,{passive:true,signal:abort.signal});addEventListener('of-header-resize',measure,{signal:abort.signal});reduced.addEventListener('change',measure,{signal:abort.signal});
 addEventListener('pageshow',measure,{signal:abort.signal});
 const cleanup=()=>{if(instances.get(root)!==cleanup)return;abort.abort();observer.disconnect();cancelAnimationFrame(frame);render(1);root.dataset.tsMode='static';root.dataset.tsBoot='fallback';delete root.dataset.tsReady;instances.delete(root);};
 instances.set(root,cleanup);addEventListener('pagehide',event=>{if(!event.persisted)cleanup();},{signal:abort.signal});
 const urls=[...root.querySelectorAll<HTMLImageElement>('img')].map(img=>img.currentSrc||img.src);
 const svgImage=root.querySelector<SVGImageElement>('image');if(svgImage)urls.push(svgImage.href.baseVal);
 void Promise.allSettled([...new Set(urls)].map(src=>{const image=new Image();image.src=src;return image.decode();})).then(async results=>{
  await document.fonts.ready;if(abort.signal.aborted)return;
  failed=results.some(result=>result.status==='rejected')||root.dataset.tsBoot==='fallback';ready=true;root.dataset.tsReady='true';measure();
 });
 return cleanup;
}
