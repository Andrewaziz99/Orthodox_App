// components/layout/MobileMenu.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { useLang } from "../providers/LanguageProvider";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { labelKey: string; href: string }[];
}

export const MobileMenu = ({ isOpen, onClose, navItems }: MobileMenuProps) => {
  const { t, dir, locale, setLocale } = useLang();
  const pathname = usePathname();
  const ChevronIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          dir === 'rtl' ? "right-0" : "left-0",
          isOpen ? "translate-x-0" : (dir === 'rtl' ? "translate-x-full" : "-translate-x-full")
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <span className="text-xl font-black text-teal-600">
             {t('common.brandName')}
          </span>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:text-slate-950"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-bold transition-all",
                      isActive 
                        ? "bg-teal-50 text-teal-600" 
                        : "text-slate-600 hover:bg-slate-50 active:scale-[0.98]"
                    )}
                  >
                    <span>{t(item.labelKey)}</span>
                    <ChevronIcon className={cn("w-5 h-5", isActive ? "text-teal-600" : "text-slate-300")} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Area */}
        <div className="p-6 space-y-4 border-t border-slate-100 bg-slate-50">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLocale('ar')}
              className={cn(
                "py-3 rounded-xl text-sm font-bold border-2 transition-all",
                locale === 'ar' 
                  ? "bg-white border-teal-600 text-teal-600 shadow-sm" 
                  : "bg-transparent border-transparent text-slate-500"
              )}
            >
              العربية
            </button>
            <button
              onClick={() => setLocale('en')}
              className={cn(
                "py-3 rounded-xl text-sm font-bold border-2 transition-all",
                locale === 'en' 
                  ? "bg-white border-teal-600 text-teal-600 shadow-sm" 
                  : "bg-transparent border-transparent text-slate-500"
              )}
            >
              English
            </button>
          </div>
          
          <Button 
            className="rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:-translate-y-[1px] transition-all"
            fullWidth 
            size="lg"
            href="/contact"
            onClick={onClose}
          >
            {t('common.contactUs')}
          </Button>
        </div>
      </div>
    </>
  );
};
