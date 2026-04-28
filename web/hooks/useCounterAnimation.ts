// hooks/useCounterAnimation.ts
'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsap-config';

export function useCounterAnimation(
  targetValue: number,
  duration: number = 2
) {
  const ref = useRef<HTMLElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasTriggered) return;

    const obj = { value: 0 };

    const tween = gsap.to(obj, {
      value: targetValue,
      duration,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        onEnter: () => setHasTriggered(true),
      },
      onUpdate: () => {
        element.textContent = Math.round(obj.value).toString();
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) st.kill();
      });
    };
  }, [targetValue, duration, hasTriggered]);

  return ref;
}
