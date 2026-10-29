const clamp=(value:number)=>Math.max(0,Math.min(1,value));
const ease=(value:number)=>{const p=clamp(value);return p*p*(3-2*p);};
/** Independent visual-slot lifecycle. No router, wheel interception, pin or lerp. */
export function initOrthopedicsScene(root:HTMLElement):()=>void {
  if(root.dataset.orReady)return()=>{};
  root.dataset.orReady='true';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController();
  const panel=root.querySelector<HTMLElement>('.or-scene-panel')!,object=root.querySelector<SVGGElement>('[data-or-object]')!,light=root.querySelector<SVGRectElement>('[data-or-light]')!,shadow=root.querySelector<SVGEllipseElement>('[data-or-shadow]')!,phase=root.querySelector<HTMLElement>('[data-or-phase]')!;
  let frame=0,start=0,span=1,last=-1;
  function render(p:number){
    const reveal=ease(p/.62),scale=2.05-1.05*reveal,shine=clamp((p-.58)/.22);
    object.setAttribute('transform',`translate(360 220) scale(${scale}) rotate(${-3+3*reveal}) translate(-360 -220)`);
    light.setAttribute('x',String(80+530*shine));light.setAttribute('opacity',String(Math.sin(shine*Math.PI)*.45));
    shadow.setAttribute('opacity',String(.08+.16*reveal));
    const label=p<.18?'Материал вблизи':p<.62?'От детали к целой форме':p<.8?'Свет раскрывает поверхность':'Форма под светом';
    if(phase.textContent!==label)phase.textContent=label;
    root.dataset.orProgress=p.toFixed(4);root.dataset.orScale=scale.toFixed(4);
  }
  function update(){frame=0;const p=reduced.matches?1:clamp((scrollY-start)/span);if(Math.abs(p-last)<.0001)return;last=p;render(p);}
  function queue(){if(!frame)frame=requestAnimationFrame(update);}
  function measure(){
    const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--of-header-height'))||89;
    start=Math.max(0,root.getBoundingClientRect().top+scrollY-header-20);
    span=Math.max(1,root.offsetHeight-panel.offsetHeight);
    root.dataset.orMotion=reduced.matches?'reduced':'scroll';root.dataset.orStart=String(start);root.dataset.orSpan=String(span);last=-1;queue();
  }
  addEventListener('scroll',queue,{passive:true,signal:abort.signal});addEventListener('resize',measure,{passive:true,signal:abort.signal});addEventListener('of-header-resize',measure,{signal:abort.signal});
  addEventListener('pageshow',measure,{signal:abort.signal});reduced.addEventListener('change',measure,{signal:abort.signal});document.fonts.ready.then(()=>{if(!abort.signal.aborted)measure();});measure();
  return()=>{abort.abort();cancelAnimationFrame(frame);delete root.dataset.orReady;};
}
/** Text stays visible by default and only animates once when entered. */
export function initOrthopedicsContent(root:HTMLElement):()=>void{
  if(root.dataset.orReady)return()=>{};root.dataset.orReady='true';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController(),runs=new Map<HTMLElement,Animation>();
  const targets=[...root.querySelectorAll<HTMLElement>('[data-or-enter]')];
  function settle(target:HTMLElement){target.dataset.orEntered='complete';runs.get(target)?.cancel();runs.delete(target);}
  function enter(target:HTMLElement){if(target.dataset.orEntered||reduced.matches)return;target.dataset.orEntered='playing';const animation=target.animate([{opacity:.5,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.2,.65,.25,1)',fill:'both'});runs.set(target,animation);animation.finished.then(()=>{if(runs.get(target)===animation)settle(target);}).catch(()=>{});}
  if(reduced.matches||!('IntersectionObserver'in window)||!('animate'in Element.prototype)){targets.forEach(settle);return()=>{delete root.dataset.orReady;};}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){enter(entry.target as HTMLElement);observer.unobserve(entry.target);}}),{threshold:.08});targets.forEach(target=>observer.observe(target));
  root.addEventListener('focusin',()=>targets.forEach(settle),{signal:abort.signal});addEventListener('hashchange',()=>{if(location.hash.startsWith('#or-'))targets.forEach(settle);},{signal:abort.signal});reduced.addEventListener('change',()=>{if(reduced.matches)targets.forEach(settle);},{signal:abort.signal});
  return()=>{abort.abort();observer.disconnect();targets.forEach(settle);delete root.dataset.orReady;};
}
