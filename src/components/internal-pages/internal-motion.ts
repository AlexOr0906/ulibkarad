/** Native-document lifecycle. Content is visible before this optional enhancement. */
const instances = new WeakMap<HTMLElement, () => void>();
export function initInternalMotion(root: HTMLElement): () => void {
  const existing = instances.get(root);
  if (existing) return existing;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...root.querySelectorAll<HTMLElement>('[data-ip-enter]')];
  const complete = new Set<HTMLElement>();
  const running = new Map<HTMLElement, Animation>();
  const controller = new AbortController();
  const { signal } = controller;
  let lastY = scrollY, frame = 0;
  function settle(target: HTMLElement) {
    complete.add(target);
    running.get(target)?.cancel(); running.delete(target);
  }
  function enter(target: HTMLElement) {
    if (complete.has(target) || running.has(target)) return;
    if (reduced.matches || !('animate' in target)) { settle(target); return; }
    // Only decorative marked elements animate; links and section wrappers do not wait.
    const delay = Math.min(120, Number(target.dataset.ipDelay) || 0);
    const animation = target.animate([
      { opacity:.3, transform:'translateY(14px)', clipPath:target.hasAttribute('data-ip-mask')?'inset(0 0 60% 0)':'none' },
      { opacity:1, transform:'translateY(0)', clipPath:'none' },
    ], {duration:480, delay, easing:'cubic-bezier(.2,.7,.2,1)', fill:'backwards'});
    running.set(target, animation);
    animation.finished.then(() => { if (running.get(target) === animation) settle(target); }).catch(() => {});
  }
  function settleDestination(hash = location.hash) {
    if (!hash) return;
    let id: string;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const destination = document.getElementById(id);
    if (!destination) return;
    targets.filter(t => destination.contains(t) || t.contains(destination)).forEach(settle);
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { enter(entry.target as HTMLElement); observer?.unobserve(entry.target); } });
  }, {threshold:.05, rootMargin:'0px 0px -6% 0px'}) : null;
  settleDestination();
  targets.forEach(target => {
    if (complete.has(target)) return;
    if (reduced.matches || !observer) settle(target);
    else if (target.getBoundingClientRect().top < innerHeight) enter(target);
    else observer.observe(target);
  });
  root.addEventListener('focusin', () => targets.forEach(settle), {signal});
  root.addEventListener('pointerdown', () => running.forEach((_, target) => settle(target)), {signal,passive:true});
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin === location.origin && destination.pathname === location.pathname) settleDestination(destination.hash);
  }, {capture:true,signal});
  window.addEventListener('hashchange', () => settleDestination(), {signal});
  window.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (Math.abs(scrollY-lastY) > innerHeight*.65) targets.filter(t => t.getBoundingClientRect().top < innerHeight+40).forEach(settle);
      lastY = scrollY;
    });
  }, {passive:true,signal});
  window.addEventListener('pageshow', event => { if (event.persisted) targets.forEach(settle); }, {signal});
  reduced.addEventListener('change', () => { if (reduced.matches) targets.forEach(settle); }, {signal});
  function cleanup() {
    targets.forEach(settle); observer?.disconnect(); controller.abort();
    cancelAnimationFrame(frame); instances.delete(root);
  }
  window.addEventListener('pagehide', event => { if (!event.persisted) cleanup(); }, {signal});
  instances.set(root, cleanup);
  return cleanup;
}
