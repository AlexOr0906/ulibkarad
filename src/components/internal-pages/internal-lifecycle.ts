import { initInternalMotion } from './internal-motion';
import {initOrthopedicsScene,initOrthopedicsContent} from '../orthopedics/orthopedics-motion';
import { initAboutMotion } from '../about-clinic/about-motion';

const pages = new WeakMap<HTMLElement, () => void>();
/** One owner for integrated content; native navigation preserves the browser's history/focus. */
export function initInternalPage(root: HTMLElement): () => void {
  const previous = pages.get(root);
  if (previous) return previous;
  const disposers = [initInternalMotion(root)];
  root.querySelectorAll<HTMLElement>('[data-about-page]:not([data-ac-auto-motion])').forEach(about => {
    disposers.push(initAboutMotion(about));
  });
  root.querySelectorAll<HTMLElement>('[data-or-scene]:not([data-or-auto-motion])').forEach(scene => disposers.push(initOrthopedicsScene(scene)));
  root.querySelectorAll<HTMLElement>('[data-or-content]:not([data-or-auto-motion])').forEach(content => disposers.push(initOrthopedicsContent(content)));
  const controller = new AbortController();
  const cleanup = () => {
    if (pages.get(root) !== cleanup) return;
    disposers.forEach(dispose => dispose());
    controller.abort(); pages.delete(root);
  };
  window.addEventListener('pagehide', event => { if (!event.persisted) cleanup(); }, {signal:controller.signal});
  pages.set(root, cleanup);
  return cleanup;
}
