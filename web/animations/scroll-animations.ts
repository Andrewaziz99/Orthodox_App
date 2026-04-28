// animations/scroll-animations.ts
// Reusable scroll-triggered animation presets for sections and elements.

import { gsap } from './gsap-config';

/**
 * Fade in from bottom
 * Usage: On sections, cards, text blocks
 */
export const fadeInUp = {
  from: {
    opacity: 0,
    y: 40,
  },
  to: {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
  },
};

/**
 * Fade in from the logical start side (left in LTR, right in RTL)
 * Usage: Two-column layouts, side content
 */
export const fadeInFromStart = (dir: 'rtl' | 'ltr') => ({
  from: {
    opacity: 0,
    x: dir === 'rtl' ? 60 : -60,
  },
  to: {
    opacity: 1,
    x: 0,
    duration: 0.9,
    ease: 'power2.out',
  },
});

/**
 * Fade in from the logical end side (right in LTR, left in RTL)
 * Usage: Two-column layouts, side content
 */
export const fadeInFromEnd = (dir: 'rtl' | 'ltr') => ({
  from: {
    opacity: 0,
    x: dir === 'rtl' ? -60 : 60,
  },
  to: {
    opacity: 1,
    x: 0,
    duration: 0.9,
    ease: 'power2.out',
  },
});

/**
 * Scale up from center
 * Usage: Hero badges, icons, featured elements
 */
export const scaleIn = {
  from: {
    opacity: 0,
    scale: 0.85,
  },
  to: {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'back.out(1.4)',
  },
};

/**
 * Stagger children animation
 * Usage: Card grids, feature lists
 */
export function staggerChildren(
  container: string | Element,
  children: string,
  options?: {
    stagger?: number;
    delay?: number;
    from?: gsap.TweenVars;
  }
) {
  const { stagger = 0.12, delay = 0, from: fromVars } = options || {};

  return gsap.from(container + ' ' + children, {
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: stagger,
    delay: delay,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: container as gsap.DOMTarget,
      start: 'top 80%',
    },
    ...fromVars,
  });
}
