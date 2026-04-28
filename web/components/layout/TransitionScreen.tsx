"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, MOTION_ENABLED } from "@/animations/gsap-config";

import { BookOpen } from "lucide-react";
import { useLang } from "../providers/LanguageProvider";

export default function TransitionScreen() {
  const { locale } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const isClosing = useRef(false);
  const pendingRouteChange = useRef(false);
  
  const { contextSafe } = useGSAP({ scope: containerRef });

  // 1. The Opening Animation (Revealing the page)
  const playOpenAnimation = contextSafe(() => {
    // If the curtain is currently in the middle of closing, do not interrupt it!
    // Queue it so that it will open exactly when the close animation officially ends.
    if (isClosing.current) {
      pendingRouteChange.current = true;
      return;
    }

    if (!MOTION_ENABLED) {
      gsap.set(".transition-overlay", { display: "none" });
      return;
    }

    const tl = gsap.timeline();

    gsap.set(".transition-overlay", { display: "flex", pointerEvents: "none" });

    tl.fromTo(".transition-loader", 
      { scale: 1, opacity: 1 },
      { scale: 0.5, opacity: 0, duration: 0.4, ease: "back.in(1.5)" }
    )
    .set(".transition-col-teal", { transformOrigin: "top" })
    .to(".transition-col-teal", {
      scaleY: 0, stagger: 0.08, duration: 0.65, ease: "power4.inOut"
    }, "-=0.2")

    .set(".transition-col-amber", { transformOrigin: "top" }, "-=0.65")
    .to(".transition-col-amber", {
      scaleY: 0, stagger: 0.08, duration: 0.65, ease: "power4.inOut"
    }, "-=0.65")
    
    .set(".transition-overlay", { display: "none" });
  });

  // 2. The Closing Animation (Covering the page)
  const playCloseAnimation = contextSafe((href: string) => {
    if (!MOTION_ENABLED) {
      router.push(href);
      return;
    }

    // Lock the transition state so Open can't interrupt it.
    isClosing.current = true;
    gsap.set(".transition-overlay", { display: "flex", pointerEvents: "auto" });

    const tl = gsap.timeline({
      onComplete: () => {
        // Now that the screen is 100% securely covered, trigger the actual Next.js load!
        router.push(href);
        isClosing.current = false;
        
        // If Next.js somehow resolved it insanely fast and triggered the pathname effect
        // while we were closing, fire the open animation now that we are done!
        if (pendingRouteChange.current) {
           pendingRouteChange.current = false;
           playOpenAnimation();
        }
      }
    });

    tl.set(".transition-col-amber", { transformOrigin: "bottom" })
      .fromTo(".transition-col-amber", 
        { scaleY: 0 },
        { scaleY: 1, stagger: 0.05, duration: 0.5, ease: "power3.inOut" }
      )

      .set(".transition-col-teal", { transformOrigin: "bottom" }, "-=0.4")
      .fromTo(".transition-col-teal",
        { scaleY: 0 },
        { scaleY: 1, stagger: 0.05, duration: 0.5, ease: "power3.inOut" },
        "-=0.4"
      )

      .fromTo(".transition-loader",
         { scale: 0.5, opacity: 0 },
         { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
         "-=0.2"
      );
  });

  // 3. Trigger Open Animation on Mount & Route Changes
  useEffect(() => {
    // When Next.js successfully finishes swapping the page DOM, try to open the curtain.
    playOpenAnimation();
  }, [pathname, playOpenAnimation]);

  // 4. Intercept Links Global Click Handler safely
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const isExternal = href.startsWith("http") && !href.includes(window.location.host);
      const isSamePageHash = href.startsWith(`${pathname}#`);
      const isSamePage = href === pathname;

      if (!isExternal && !isSamePageHash && !isSamePage && target.target !== "_blank") {
         // Stop Next.js <Link> from instantly resolving the route!
         e.preventDefault();
         e.stopPropagation();
         
         // Securely play the close animation OVER the old page.
         playCloseAnimation(href);
      }
    };

    // Use { capture: true } to intercept the click BEFORE React's internal routing system gets it.
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname, playCloseAnimation]);

  return (
    <div ref={containerRef}>
      <div className="transition-overlay fixed inset-0 z-[9999] flex pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="relative flex-1 h-full">
            <div className="transition-col-amber absolute inset-0 bg-gradient-to-t from-amber-500 to-amber-400 will-change-transform" style={{ transformOrigin: "top" }} />
            <div className="transition-col-teal absolute inset-0 bg-gradient-to-b from-teal-900 to-slate-900 border-r border-teal-800/30 last:border-none will-change-transform" style={{ transformOrigin: "top" }} />
          </div>
        ))}
        
        {/* Dynamic Loading Indicator */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="transition-loader flex flex-col items-center justify-center p-8 bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(20,184,166,0.15)] will-change-transform opacity-0 scale-50">
            
            {/* Elegant Dual-Spinner */}
            <div className="relative w-24 h-24 flex items-center justify-center mb-8">
              {/* Outer Amber Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/10 border-t-amber-500 border-l-amber-500 animate-[spin_2.5s_linear_infinite]" />
              
              {/* Inner Teal Ring */}
              <div className="absolute inset-2.5 rounded-full border-[3px] border-teal-500/10 border-b-teal-400 border-r-teal-400 animate-[spin_3s_linear_infinite_reverse]" />
              
              {/* Center Book Icon */}
              <BookOpen className="w-8 h-8 text-amber-400 animate-pulse drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
            </div>

            {/* Glowing Loading Text */}
            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-amber-400 tracking-widest uppercase animate-pulse">
              {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </h3>
            
          </div>
        </div>
      </div>
    </div>
  );
}
