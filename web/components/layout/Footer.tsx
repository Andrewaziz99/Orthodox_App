// components/layout/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Share2, Globe, Heart } from "lucide-react";
import { useLang } from "../providers/LanguageProvider";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui";

export default function Footer() {
  const pathname = usePathname();
  const { t, dir } = useLang();
  
  if (pathname === '/bible') return null;
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      titleKey: "footer.quickLinks",
      links: [
        { labelKey: "nav.home", href: "/" },
        { labelKey: "nav.bible", href: "/bible" },
        { labelKey: "nav.about", href: "/about" },
        { labelKey: "nav.curricula", href: "/curricula" },
      ],
    },
    {
      titleKey: "footer.support",
      links: [
        { labelKey: "nav.news", href: "/news" },
        { labelKey: "nav.vision", href: "/vision" },
        { labelKey: "nav.contact", href: "/contact-us" },
        { labelKey: "nav.app", href: "/app-page" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Share2, href: "#", color: "hover:text-blue-600" },
    { icon: Globe, href: "#", color: "hover:text-teal-600" },
    { icon: Heart, href: "#", color: "hover:text-rose-600" },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 overflow-hidden relative">
      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 relative">
                <Image
                  src="/assets/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <span className="text-xl font-black text-slate-900 leading-tight">
                {t('common.brandName')}
              </span>
            </Link>
            <p className="text-slate-600 leading-relaxed mb-6 max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className={cn(
                    "w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 transition-all duration-300",
                    social.color,
                    "hover:border-current hover:shadow-lg hover:shadow-slate-200"
                  )}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.titleKey} className="flex flex-col">
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-6 border-s-4 border-teal-500 ps-4">
                {t(section.titleKey)}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-600 hover:text-teal-600 transition-colors font-medium flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 h-0.5 bg-teal-500 transition-all duration-300 me-0 group-hover:me-2" />
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="flex flex-col">
            <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-6 border-s-4 border-amber-500 ps-4">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Email</p>
                  <a href="mailto:info@orthodox-bible.com" className="text-slate-700 font-bold hover:text-teal-600 transition-colors">
                    info@orthodox-bible.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Phone</p>
                  <a href="tel:+20123456789" className="text-slate-700 font-bold hover:text-teal-600 transition-colors" dir="ltr">
                    +20 123 456 789
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm font-medium">
            © {currentYear} {t('common.brandName')}. {t('footer.allRightsReserved')}
          </p>
          <div className="flex items-center gap-6">
             <Link href="/privacy" className="text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">
                {t('footer.privacy')} 
             </Link>
             <Link href="/terms" className="text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">
                {t('footer.terms')}
             </Link>
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-24 -end-24 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
    </footer>
  );
}
