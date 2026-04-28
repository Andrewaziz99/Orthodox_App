// animations/text-animations.ts
// Text-specific animation presets — headings, paragraphs, counters.

import { gsap } from './gsap-config';

/**
 * Split heading into words and animate each word.
 * Creates a dramatic reveal effect for section headings.
 */
export function animateHeading(
  element: Element,
  options?: { delay?: number; stagger?: number }
) {
  const { delay = 0, stagger = 0.05 } = options || {};

  // Split text into words
  const text = element.textContent || '';
  const words = text.split(' ');
  element.innerHTML = words
    .map(
      (word) =>
        `<span class="word-wrapper" style="display:inline-block;overflow:hidden;"><span class="word" style="display:inline-block;">${word}</span></span>`
    )
    .join(' ');

  const wordElements = element.querySelectorAll('.word');

  return gsap.from(wordElements, {
    y: '110%',
    opacity: 0,
    duration: 0.6,
    stagger: stagger,
    delay: delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
    },
  });
}

/**
 * Simple text fade-in with slight upward motion.
 * For body text, paragraphs, subtitles.
 */
export function animateText(element: Element, delay = 0.2) {
  return gsap.from(element, {
    opacity: 0,
    y: 20,
    duration: 0.7,
    delay,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
    },
  });
}

/**
 * Counter animation for statistics.
 * Animates a number from 0 to target value.
 */
export function animateCounter(element: Element, targetValue: number) {
  const obj = { value: 0 };

  return gsap.to(obj, {
    value: targetValue,
    duration: 2,
    ease: 'power1.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
    },
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString();
    },
  });
}
