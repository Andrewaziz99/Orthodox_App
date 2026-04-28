"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { gsap } from '@/animations/gsap-config';

import { useLang } from "../providers/LanguageProvider";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

const navItems = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.bible", href: "/bible" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.curricula", href: "/curricula" },
  { labelKey: "nav.app", href: "/app-page" },
  { labelKey: "nav.news", href: "/news" },
  { labelKey: "nav.vision", href: "/vision" },
];

export default function Header() {
  const { t } = useLang();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  /* ─────────────────────────────────────────────
     ULTRA SMOOTH GSAP SYSTEM
  ───────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const nav = navRef.current;
      const indicator = indicatorRef.current;

      if (!nav || !indicator) return;

      const links = nav.querySelectorAll("[data-nav]");

      /* ─── QUICK SETTERS (PERFORMANCE MAGIC) ─── */
      const xTo = gsap.quickTo(indicator, "x", {
        duration: 0.45,
        ease: "power3.out",
      });

      const scaleTo = gsap.quickTo(indicator, "scaleX", {
        duration: 0.45,
        ease: "power3.out",
      });

      /* ─── SET INITIAL ACTIVE ─── */
      const setActive = () => {
        const active = nav.querySelector(
          `[data-active="true"]`
        ) as HTMLElement;

        if (!active) return;

        const rect = active.getBoundingClientRect();
        const parentRect = nav.getBoundingClientRect();

        const x = rect.left - parentRect.left;
        const w = rect.width;

        xTo(x);
        scaleTo(w / 100); // base width = 100
      };

      setActive();

      const cleanupListeners: (() => void)[] = [];

      /* ─── HOVER EFFECT ─── */
      links.forEach((link: any) => {
        const el = link as HTMLElement;
        const enterHandler = () => {
          const rect = el.getBoundingClientRect();
          const parentRect = nav.getBoundingClientRect();
          const x = rect.left - parentRect.left;
          const w = rect.width;
          xTo(x);
          scaleTo(w / 100);
        };
        const leaveHandler = setActive;

        el.addEventListener("mouseenter", enterHandler);
        el.addEventListener("mouseleave", leaveHandler);
        cleanupListeners.push(() => {
          el.removeEventListener("mouseenter", enterHandler);
          el.removeEventListener("mouseleave", leaveHandler);
        });
      });

      /* ─── INTRO ANIMATION ─── */
      gsap.from(headerRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      return () => {
        cleanupListeners.forEach(cleanup => cleanup());
      };
    });

    return () => ctx.revert(); // 🔥 prevents bugs
  }, [pathname]);

  return (
    <>
      <div className="h-[2px] bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400" />

      <header
        ref={headerRef}
        className="relative w-full z-50 bg-white border-b border-slate-200/50"
        style={{ height: 96 }}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="relative h-full flex items-center z-50 shrink-0 group gap-3 lg:gap-0">
            {/* Mobile Logo: normal inline size */}
            <div className="relative w-14 h-14 lg:hidden">
              <Image src="/assets/logo.png" alt="Logo" fill sizes="56px" className="object-contain" />
            </div>

            {/* Desktop Logo: absolute protruding badge */}
            <div className="hidden lg:flex absolute start-0 top-3 w-[130px] h-[130px] bg-white rounded-full shadow-lg items-center justify-center transition-transform hover:-translate-y-1 duration-300 z-[60]">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image src="/assets/logo.png" alt="Logo" fill sizes="130px" className="object-cover" />
              </div>
            </div>
            
            {/* Invisible spacer so the absolute logo doesn't overlap nav items on desktop */}
            <div className="hidden lg:block w-[130px] shrink-0" />
            
            <span className="font-bold text-slate-800 text-base hidden sm:block lg:ms-4 group-hover:text-teal-600 transition-colors lg:pt-1">
              {t("common.brandName")}
            </span>
          </Link>

          {/* Nav */}
          <div className="relative hidden lg:block">
            <div ref={navRef} className="flex items-center relative">

              {/* ULTRA SMOOTH INDICATOR */}
              <div
                ref={indicatorRef}
                className="absolute top-0 left-0 h-full w-[100px] bg-teal-50 rounded-xl origin-left will-change-transform"
                style={{ transform: "translateX(0px) scaleX(0)" }}
              />

              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-nav
                    data-active={isActive}
                    className="relative px-4 py-2 text-[15px] font-semibold uppercase z-10"
                  >
                    <span
                      className={cn(
                        isActive
                          ? "text-teal-600"
                          : "text-slate-500 hover:text-teal-600"
                      )}
                    >
                      {t(item.labelKey)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            <div className="hidden lg:block">
              <Button
                href="/contact"
                className="px-5 py-2 text-sm rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:-translate-y-[1px] transition-all"
              >
                {t("common.contactUs")}
              </Button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2"
            >
              <Menu />
            </button>
          </div>

        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
}