// hooks/useStaggerAnimation.ts
'use client';
import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsap-config';

export function useStaggerAnimation<T extends HTMLElement>(
  childSelector: string,
  staggerDelay: number = 0.12
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    if (!children.length) return;

    const tween = gsap.from(children, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      stagger: staggerDelay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [childSelector, staggerDelay]);

  return containerRef;
}
