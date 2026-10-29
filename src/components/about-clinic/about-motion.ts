/** About-only choreography; the shared router/layout owns page transitions. */
export function initAboutMotion(root: HTMLElement): () => void {
  if (root.dataset.acReady) return () => {};
  root.dataset.acReady = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...root.querySelectorAll<HTMLElement>('[data-ac-reveal]')];
  const runs = new Map<HTMLElement, Animation[]>();
  const abort = new AbortController();
  let frame = 0, lastY = scrollY;
  function settle(target: HTMLElement) {
    target.dataset.acState = 'complete';
    runs.get(target)?.forEach(animation => animation.cancel());
    runs.delete(target);
  }
  function enter(target: HTMLElement) {
    if (target.dataset.acState === 'complete' || runs.has(target)) return;
    if (reduced.matches) { settle(target); return; }
    target.dataset.acState = 'playing';
    const inner = target.querySelector<HTMLElement>('.ac-reveal-inner')!;
    const kind = target.dataset.acReveal;
    const lines = kind === 'type' ? [...inner.querySelectorAll<HTMLElement>('h1 > span,h2 > span')] : [];
    const elements = lines.length ? lines : [inner];
    const animations = elements.map((element, index) => element.animate(kind === 'media' ? [
      {clipPath:'inset(0 0 18% 0)',transform:'translateY(16px)',opacity:.6},
      {clipPath:'inset(0 0 0% 0)',transform:'translateY(0)',opacity:1},
    ] : [
      {transform:'translateY(18px)',opacity:.3},
      {transform:'translateY(0)',opacity:1},
    ], {duration:kind === 'media' ? 1050 : kind === 'type' ? 800 : 700,
      delay:kind === 'type' ? index * 90 : kind === 'media' ? 180 : 120,
      easing:'cubic-bezier(.2,.65,.25,1)',fill:'both'}));
    runs.set(target, animations);
    Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(() => {
      if (runs.get(target) === animations) settle(target);
    });
  }
  if (reduced.matches || !('IntersectionObserver' in window) || !('animate' in Element.prototype)) {
    targets.forEach(settle);
    return () => { delete root.dataset.acReady; };
  }
  targets.forEach(target => { target.dataset.acState = 'armed'; });
  // Observe the untransformed, unclipped wrapper, never the revealed inner layer.
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { enter(entry.target as HTMLElement); observer.unobserve(entry.target); }
  }), {threshold:.08,rootMargin:'0px 0px -24px 0px'});
  targets.forEach(target => observer.observe(target));
  function settleVisible() {
    targets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) settle(target);
    });
  }
  function settleHash() {
    if (!location.hash.startsWith('#ac-') || location.hash === '#ac-top') return;
    const anchor = document.getElementById(location.hash.slice(1));
    if (!anchor || !root.contains(anchor)) return;
    targets.filter(target => anchor.contains(target) || target.contains(anchor)).forEach(settle);
  }
  addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (Math.abs(scrollY - lastY) > innerHeight * .75) settleVisible();
      lastY = scrollY;
    });
  }, {passive:true,signal:abort.signal});
  addEventListener('hashchange', settleHash, {signal:abort.signal});
  addEventListener('pageshow', event => { if (event.persisted) settleVisible(); }, {signal:abort.signal});
  root.addEventListener('focusin', event => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-ac-reveal]') : null;
    if (target) settle(target);
  }, {signal:abort.signal});
  reduced.addEventListener('change', () => { if (reduced.matches) targets.forEach(settle); }, {signal:abort.signal});
  settleHash();
  return () => {
    abort.abort(); observer.disconnect(); cancelAnimationFrame(frame);
    targets.forEach(settle); delete root.dataset.acReady;
  };
}
