// lib/types/navigation.ts

export interface NavItem {
  labelKey: string; // Key for the t() function
  href: string;
  id?: string;
  icon?: string; // Lucide icon name
}

export interface FooterSection {
  titleKey: string;
  links: NavItem[];
}
