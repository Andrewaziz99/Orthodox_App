'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from '@/animations/gsap-config';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const onUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onUpdate);

    // Reset scroll trigger positions
    ScrollTrigger.refresh();

    // Global Lenis instance for external access if needed
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onUpdate);
      (window as any).lenis = undefined;
    };
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    // Refreshing ScrollTrigger ensures the new offsets are correctly calculated for the new page layout
    ScrollTrigger.refresh();
  }, [pathname]);

  return <>{children}</>;
}
