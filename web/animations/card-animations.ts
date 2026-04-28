// animations/card-animations.ts
// Card and component entrance animation presets.

import { gsap } from './gsap-config';

/**
 * Staggered card grid entrance.
 * Cards fade in from below with stagger delay.
 */
export function animateCardGrid(
  containerSelector: string,
  cardSelector: string = '.card'
) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const cards = container.querySelectorAll(cardSelector);

  gsap.from(cards, {
    opacity: 0,
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
    },
  });
}

/**
 * Feature card entrance with scale and subtle rotation.
 */
export function animateFeatureCard(element: Element) {
  return gsap.from(element, {
    opacity: 0,
    y: 30,
    scale: 0.95,
    rotateX: 5,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
    },
  });
}
