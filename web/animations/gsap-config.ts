// animations/gsap-config.ts
// Global GSAP configuration — registers plugins, sets defaults,
// and handles prefers-reduced-motion.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Global defaults for consistent feel
gsap.defaults({
  duration: 0.8,
  ease: 'power2.out',
});

// ScrollTrigger defaults
ScrollTrigger.defaults({
  start: 'top 85%',       // Trigger when element is 85% from top of viewport
  end: 'bottom 20%',
  toggleActions: 'play none none none',  // play on enter, don't reverse
});

// Detect reduced motion preference
const prefersReducedMotion =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

// Disable all animations if user prefers reduced motion
if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(100); // Effectively instant
  ScrollTrigger.config({ limitCallbacks: true });
}

export const MOTION_ENABLED = !prefersReducedMotion;

export { gsap, ScrollTrigger };
