// components/layout/LanguageSwitcher.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLang } from "../providers/LanguageProvider";
import { cn } from "@/lib/utils/cn";

export const LanguageSwitcher = () => {
  const { locale, setLocale, dir } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "ar", label: "العربية" },
    { code: "en", label: "English" },
  ] as const;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
          "text-slate-600 hover:text-teal-600 hover:bg-slate-50 font-medium",
          isOpen && "bg-slate-50 text-teal-600"
        )}
      >
        <Globe className="w-5 h-5" />
        <span className="hidden md:inline">{locale === "ar" ? "العربية" : "English"}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div 
          className={cn(
            "absolute top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-2 z-50",
            dir === 'rtl' ? "left-0" : "right-0"
          )}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors",
                locale === lang.code 
                  ? "bg-teal-50 text-teal-600" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span>{lang.label}</span>
              {locale === lang.code && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
