/** Local Scroll Craft flow/in choreography. The existing engine stays untouched. */
export function initDoctorsEntrance() {
  const section = document.querySelector<HTMLElement>('.doctors-entrance');
  if (!section) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width: 767px)');
  const heading = section.querySelector<HTMLElement>('[data-team-heading]')!;
  const rail = section.querySelector<HTMLElement>('[data-team-rail]')!;
  const runs = new Map<HTMLElement, Animation[]>();
  const finished = new Set<HTMLElement>();
  const targets = [heading, rail];
  function settle(target: HTMLElement) {
    finished.add(target);
    target.dataset.teamEntrance = 'complete';
    runs.get(target)?.forEach(animation => animation.cancel());
    runs.delete(target);
    target.classList.remove('team-entry-armed');
  }
  function enter(target: HTMLElement, instant = false) {
    if (finished.has(target) || runs.has(target)) return;
    if (instant || reduced.matches) { settle(target); return; }
    target.classList.remove('team-entry-armed');
    target.dataset.teamEntrance = 'playing';
    const elements = target === heading
      ? [...heading.querySelectorAll<HTMLElement>('h2')]
      : [...rail.querySelectorAll<HTMLElement>('.doctor-portrait')];
    const animations = elements.map((element, index) => element.animate(target === heading ? [
      { clipPath: 'inset(0 0 100% 0)', transform: 'translateY(14px)', opacity: .35 },
      { clipPath: 'inset(0 0 0% 0)', transform: 'translateY(0)', opacity: 1 },
    ] : [
      { clipPath: phone.matches ? 'inset(0 0 35% 0)' : 'inset(0 0 100% 0)', transform: `translateY(${phone.matches ? 6 : 14}px)` },
      { clipPath: 'inset(0% 0 0 0)', transform: 'translateY(0)' },
    ], {
      duration: phone.matches ? 500 : target === heading ? 720 : 1000,
      delay: phone.matches ? 0 : index * (target === heading ? 35 : 60),
      easing: 'cubic-bezier(.25,.6,.3,1)', fill: 'both',
    }));
    runs.set(target, animations);
    Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(() => { if (runs.get(target) === animations) settle(target); });
  }
  if (!('IntersectionObserver' in window) || !('animate' in Element.prototype)) { targets.forEach(settle); return; }
  targets.forEach(target => {
    // Visible/restored/hash-entry content is never hidden on startup.
    if (reduced.matches || target.getBoundingClientRect().top < innerHeight) settle(target);
    else { target.classList.add('team-entry-armed'); target.dataset.teamEntrance = 'armed'; }
  });
  // Scroll Craft's flow observer adds sc-in once; local fallback also works if
  // the engine is unavailable. Neither path re-arms a completed entrance.
  const changes = new MutationObserver(() => targets.forEach(target => {
    if (target.classList.contains('sc-in')) enter(target);
  }));
  targets.forEach(target => changes.observe(target, { attributes: true, attributeFilter: ['class'] }));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { enter(entry.target as HTMLElement); observer.unobserve(entry.target); }
  }), { rootMargin: '0px 0px -12% 0px', threshold: .01 });
  targets.forEach(target => { if (!finished.has(target)) observer.observe(target); });
  let lastY = scrollY, frame = 0;
  function checkScroll() {
    frame = 0;
    const delta = Math.abs(scrollY - lastY);
    const fast = delta > innerHeight * .75;
    lastY = scrollY;
    if (fast) targets.forEach(target => {
      if (target.getBoundingClientRect().top < innerHeight + 60) settle(target);
    });
  }
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(checkScroll); }, {passive: true});
  // A keyboard or pointer interaction wins over all decorative motion.
  section.addEventListener('focusin', () => targets.forEach(settle));
  section.addEventListener('pointerdown', () => targets.forEach(settle), {passive: true});
  reduced.addEventListener('change', () => { if (reduced.matches) targets.forEach(settle); });
  window.addEventListener('pageshow', event => { if (event.persisted) targets.forEach(settle); });
  if (new URLSearchParams(location.search).get('review') === 'doctors-entry') {
    const replay = document.createElement('button');
    replay.type = 'button'; replay.className = 'team-entrance-replay';
    replay.textContent = 'Повторить появление';
    rail.closest('.team-collection')?.querySelector('.team-introduction')?.append(replay);
    replay.addEventListener('click', () => {
      targets.forEach(settle);
      finished.clear();
      targets.forEach(target => enter(target));
    });
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) targets.forEach(settle); });
}
