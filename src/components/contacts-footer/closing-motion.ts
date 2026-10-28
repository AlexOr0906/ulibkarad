/** One-shot, local closing choreography. All links and contact data stay live. */
export function initClosingMotion() {
  const roots = [...document.querySelectorAll<HTMLElement>('.cf-contacts, .cf-footer')].filter(root => !root.dataset.cfMotionReady);
  if (!roots.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width: 800px)');
  const targets = roots.flatMap(root => {
    root.dataset.cfMotionReady = 'true';
    return [...root.querySelectorAll<HTMLElement>('.cf-heading-row h2, .cf-map-placeholder, .cf-brand')];
  });
  const running = new Map<HTMLElement, Animation[]>();
  const done = new Set<HTMLElement>();
  function finish(target: HTMLElement) {
    done.add(target); target.dataset.cfMotion = 'complete';
    target.classList.remove('cf-motion-pending');
    running.get(target)?.forEach(a => a.cancel()); running.delete(target);
  }
  function enter(target: HTMLElement) {
    if (done.has(target) || running.has(target)) return;
    if (reduced.matches) { finish(target); return; }
    target.classList.remove('cf-motion-pending'); target.dataset.cfMotion = 'playing';
    const duration = phone.matches ? 550 : 1050;
    const ease = 'cubic-bezier(.22,.7,.25,1)';
    const animations: Animation[] = [];
    if (target.matches('.cf-map-placeholder')) {
      animations.push(target.animate([
        {clipPath: 'circle(8% at 50% 50%)'},
        {clipPath: 'circle(76% at 50% 50%)'},
      ], {duration, easing: ease, fill: 'both'}));
      const orbit = target.querySelector<HTMLElement>('.cf-map-surface');
      if (orbit) animations.push(orbit.animate([
        {transform: 'scale(.72) rotate(-12deg)'}, {transform: 'scale(1) rotate(0deg)'},
      ], {duration: duration + 100, easing: ease, fill: 'both'}));
    } else if (target.matches('.cf-brand')) {
      const name = target.querySelector<HTMLElement>('span')!;
      const emblem = target.querySelector('img')!;
      animations.push(name.animate([
        {clipPath:'inset(0 100% 0 0)',transform:'translateX(-20px)'},
        {clipPath:'inset(0 0% 0 0)',transform:'translateX(0)'},
      ], {duration, easing:ease, fill:'both'}));
      animations.push(emblem.animate([{transform:'scale(.86)',opacity:.5},{transform:'scale(1)',opacity:1}],{duration:phone.matches?450:800,easing:ease,fill:'both'}));
    } else {
      animations.push(target.animate([{clipPath:'inset(0 0 100% 0)',transform:'translateY(16px)'},{clipPath:'inset(0 0 0% 0)',transform:'translateY(0)'}],{duration:phone.matches?450:700,easing:ease,fill:'both'}));
    }
    running.set(target, animations);
    Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>{if(running.get(target)===animations)finish(target);});
  }
  if (!('IntersectionObserver' in window) || !('animate' in Element.prototype) || reduced.matches) { targets.forEach(finish); return; }
  targets.forEach(target=>{
    const rect=target.getBoundingClientRect();
    if(rect.top<innerHeight&&rect.bottom>0)finish(target);
    else{target.dataset.cfMotion='armed';target.classList.add('cf-motion-pending');}
  });
  // Observe an unclipped layout box. A fully clipped heading can never cross
  // an IntersectionObserver threshold when the heading itself is observed.
  const triggers=new Map<HTMLElement,HTMLElement[]>();
  targets.forEach(target=>{
    const trigger=target.parentElement!;
    triggers.set(trigger,[...(triggers.get(trigger)??[]),target]);
  });
  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){triggers.get(entry.target as HTMLElement)?.forEach(target=>enter(target));observer.unobserve(entry.target);}}),{rootMargin:'0px 0px -8% 0px',threshold:.01});
  triggers.forEach((_,trigger)=>observer.observe(trigger));
  roots.forEach(root=>{
    root.addEventListener('focusin',()=>targets.filter(t=>root.contains(t)).forEach(finish));
    root.addEventListener('pointerdown',()=>targets.filter(t=>root.contains(t)).forEach(finish),{passive:true});
  });
  let y=scrollY, frame=0;
  window.addEventListener('scroll',()=>{
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      frame=0;const jump=Math.abs(scrollY-y)>innerHeight*.75;y=scrollY;
      targets.forEach(target=>{
        const rect=target.getBoundingClientRect();
        if(rect.top<innerHeight*.92&&rect.bottom>0){if(jump)finish(target);else enter(target);}
      });
    });
  },{passive:true});
  function settleAnchor(hash:string){
    const id=hash.slice(1);if(!id)return;
    const destination=document.getElementById(id);if(!destination)return;
    const affected=roots.filter(root=>root===destination||root.contains(destination)||destination.contains(root));
    targets.filter(target=>affected.some(root=>root.contains(target))).forEach(finish);
  }
  document.addEventListener('click',event=>{
    const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;
    if(!link)return;const url=new URL(link.href,location.href);
    if(url.origin===location.origin&&url.pathname===location.pathname)settleAnchor(url.hash);
  },{capture:true});
  window.addEventListener('hashchange',()=>settleAnchor(location.hash));
  settleAnchor(location.hash);
  reduced.addEventListener('change',()=>{if(reduced.matches)targets.forEach(finish);});
  window.addEventListener('pageshow',e=>{if(e.persisted)targets.forEach(finish);});
  if(new URLSearchParams(location.search).get('review')==='closing-motion') {
    const button=document.createElement('button');button.type='button';button.className='cf-replay';button.textContent='Повторить появление';
    const host=document.querySelector('.cf-preview-bar');
    host?.append(button);
    button.addEventListener('click',()=>{targets.forEach(finish);done.clear();targets.forEach(enter);});
  }
}
