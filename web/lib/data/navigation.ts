// lib/data/navigation.ts
import { NavItem, FooterSection } from "../types/navigation";

export const navItems: NavItem[] = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.bible", href: "/bible" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.curricula", href: "/curricula" },
  { labelKey: "nav.app", href: "/app-page" },
  { labelKey: "nav.news", href: "/news" },
  { labelKey: "nav.vision", href: "/vision" },
  { labelKey: "nav.contact", href: "/contact" },
];

export const footerSections: FooterSection[] = [
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
      { labelKey: "nav.contact", href: "/contact" },
      { labelKey: "nav.app", href: "/app-page" },
    ],
  },
];
