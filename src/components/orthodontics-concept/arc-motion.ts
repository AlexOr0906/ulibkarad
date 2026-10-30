const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const p=clamp(n);return p*p*(3-2*p);};
export function initArc(root:HTMLElement){
 if(root.dataset.ready)return;root.dataset.ready='true';
 const scene=root.querySelector<HTMLElement>('[data-oa-scene]')!,stage=root.querySelector<HTMLElement>('[data-oa-stage]')!,camera=root.querySelector<SVGGElement>('[data-oa-camera]')!,teeth=root.querySelector<SVGGElement>('[data-oa-teeth]')!;
 const brackets=[...root.querySelectorAll<SVGGElement>('[data-oa-bracket]')],wires=[...root.querySelectorAll<SVGPathElement>('[data-oa-wire],[data-oa-wire-highlight],[data-oa-wire-shadow]')],thread=root.querySelector<SVGPathElement>('[data-oa-thread]')!,story=root.querySelector<HTMLElement>('[data-oa-story]')!,phase=root.querySelector<HTMLElement>('[data-oa-phase]')!,progress=root.querySelector<HTMLElement>('[data-oa-progress]')!;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),phone=matchMedia('(max-width:767px)'),fine=matchMedia('(pointer:fine)'),abort=new AbortController();
 let raf=0,start=0,span=1,storyStart=0,storySpan=1;
 const length=wires[0].getTotalLength(),tail=root.querySelector<SVGPathElement>('[data-oa-tail]')!;wires.forEach(w=>{w.style.strokeDasharray=String(length);});
 function render(){raf=0;const p=reduced.matches?1:clamp((scrollY-start)/span),reveal=ease((p-.08)/.55),scale=1+(phone.matches?3.8:2.8)*(1-reveal);
  camera.setAttribute('transform',`translate(600 270) scale(${scale}) translate(-600 -289)`);
  teeth.style.opacity=String(.08+.92*ease((p-.25)/.4));
  brackets.forEach((b,i)=>{const distance=Math.abs(i-6)/2,land=i===6?1:ease((p-.12-distance*.07)/.25);b.setAttribute('transform',`translate(0 ${-65*(1-land)}) scale(${1+.16*(1-land)})`);b.style.opacity=String(i===6?1:land);});
  // The central wire is visible in macro; the complete curve threads in as the system appears.
  const wireReveal=.49+.51*ease((p-.3)/.55);wires.forEach(w=>w.style.strokeDashoffset=String(length*(1-wireReveal)));
  tail.style.opacity=String(ease((p-.75)/.1));
  const text=p<.2?'Одна деталь':p<.65?'Элементы соединяются':'Целая система';if(phase.textContent!==text)phase.textContent=text;
  progress.style.transform=`scaleX(${p})`;root.dataset.progress=p.toFixed(4);
  const trail=reduced.matches?1:clamp((scrollY+innerHeight*.8-storyStart)/storySpan);thread.style.strokeDasharray='1';thread.style.strokeDashoffset=String(1-trail);
 }
 function queue(){if(!raf)raf=requestAnimationFrame(render);}
 function measure(){root.dataset.motion=reduced.matches?'reduced':'scroll';root.style.setProperty('--oa-height',`${stage.offsetHeight}px`);const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--of-header-height'))||89;start=Math.max(0,scene.getBoundingClientRect().top+scrollY-header);span=Math.max(1,scene.offsetHeight-stage.offsetHeight);storyStart=story.getBoundingClientRect().top+scrollY;storySpan=story.offsetHeight;root.dataset.start=String(start);root.dataset.span=String(span);
  // Continue at the same screen x after SVG letterboxing and mobile art direction.
  const art=root.querySelector<HTMLElement>('.oa-art')!.getBoundingClientRect(),box=root.getBoundingClientRect(),fit=Math.min(art.width/1200,art.height/520);
  const join=(art.left-box.left+(art.width-1200*fit)/2+1020*fit)/box.width*1200;
  root.querySelectorAll<SVGPathElement>('.oa-thread path').forEach(path=>path.setAttribute('d',`M${join} -50 C${join} 100 1000 180 820 200 S170 190 170 420 S1000 540 1000 720 S650 810 650 1050`));queue();}
 addEventListener('scroll',queue,{passive:true,signal:abort.signal});addEventListener('resize',measure,{passive:true,signal:abort.signal});addEventListener('of-header-resize',measure,{signal:abort.signal});addEventListener('pageshow',measure,{signal:abort.signal});reduced.addEventListener('change',measure,{signal:abort.signal});
 stage.addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches)return;const r=stage.getBoundingClientRect();root.style.setProperty('--oa-tilt-x',`${((e.clientX-r.left)/r.width-.5)*3}deg`);root.style.setProperty('--oa-tilt-y',`${-((e.clientY-r.top)/r.height-.5)*2}deg`);},{signal:abort.signal});
 stage.addEventListener('pointerleave',()=>{root.style.setProperty('--oa-tilt-x','0deg');root.style.setProperty('--oa-tilt-y','0deg');},{signal:abort.signal});
 document.fonts.ready.then(()=>{if(!abort.signal.aborted)measure();});measure();
 addEventListener('pagehide',e=>{if(e.persisted)return;abort.abort();cancelAnimationFrame(raf);delete root.dataset.ready;},{signal:abort.signal});
}
