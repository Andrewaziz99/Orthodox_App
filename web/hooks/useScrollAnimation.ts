// hooks/useScrollAnimation.ts
'use client';
import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsap-config';

interface ScrollAnimationOptions {
  animation: 'fadeInUp' | 'fadeInStart' | 'fadeInEnd' | 'scaleIn';
  delay?: number;
  duration?: number;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const { animation, delay = 0, duration = 0.8 } = options;

    const animations: Record<string, gsap.TweenVars> = {
      fadeInUp:    { opacity: 0, y: 40 },
      fadeInStart: { opacity: 0, x: -40 },
      fadeInEnd:   { opacity: 0, x: 40 },
      scaleIn:     { opacity: 0, scale: 0.9 },
    };

    const tween = gsap.from(element, {
      ...animations[animation],
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) st.kill();
      });
    };
  }, [options.animation, options.delay, options.duration]);

  return ref;
}
