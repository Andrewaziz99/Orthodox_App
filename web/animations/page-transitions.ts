// animations/page-transitions.ts
// Page transition animations for route changes.

import { gsap } from './gsap-config';

/**
 * Page enter animation.
 * Called after route change completes.
 */
export function pageEnter(container: Element) {
  return gsap.from(container, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power2.out',
  });
}

/**
 * Page exit animation.
 * Called before route change begins.
 */
export function pageExit(container: Element) {
  return gsap.to(container, {
    opacity: 0,
    y: -10,
    duration: 0.3,
    ease: 'power2.in',
  });
}
