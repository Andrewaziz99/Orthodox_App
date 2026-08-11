"use client";

import React, { useState } from 'react';
import { useLang } from '@/components/providers/LanguageProvider';
import { 
  Sparkles, 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  Settings, 
  Layout, 
  FileText, 
  Users, 
  Database,
  GraduationCap,
  Newspaper,
  LayoutDashboard,
  LayoutTemplate,
  Smartphone,
  Eye,
  Megaphone
} from 'lucide-react';

// Refactored Components
import { SectionEditor } from '@/components/admin/content/SectionEditor';
import { VideoManager } from '@/components/admin/content/VideoManager';
import { CurriculaHomeManager } from '@/components/admin/content/CurriculaHomeManager';
import { NewsHomeManager } from '@/components/admin/content/NewsHomeManager';
import { CurriculaInventoryManager } from '@/components/admin/content/CurriculaInventoryManager';
import { NewsInventoryManager } from '@/components/admin/content/NewsInventoryManager';
import { useRequireSuperAdmin } from '@/lib/auth/middleware';

export default function ContentAdminPage() {
  useRequireSuperAdmin();
  const { t, locale, dir } = useLang();
  const [activeSection, setActiveSection] = useState<string>('hero');
  
  // Sections specifically for the Home Page
  const homeSections = [
    { id: 'hero', label: 'Hero Section', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'about', label: 'About Us', icon: <Users className="w-4 h-4" /> },
    { id: 'audience', label: 'Audience', icon: <Users className="w-4 h-4" /> },
    { id: 'app', label: 'Mobile App', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'curricula_home', label: 'Curricula', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'news_home', label: 'News', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'videos', label: 'Video Gallery', icon: <Play className="w-4 h-4" /> },
    { id: 'vision', label: 'Future Vision', icon: <Eye className="w-4 h-4" /> },
    { id: 'cta', label: 'Bottom CTA', icon: <Megaphone className="w-4 h-4" /> },
  ];

  // Standalone Main Pages
  const internalPages = [
    { id: 'about_page', label: 'About Us Page', icon: <FileText className="w-4 h-4" /> },
    { id: 'app_page', label: 'App Details Page', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'vision_page', label: 'Future Vision Page', icon: <Eye className="w-4 h-4" /> },
    { id: 'curricula_page', label: 'Curricula Listing', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'news_page', label: 'News Listing', icon: <Newspaper className="w-4 h-4" /> },
  ];

  // Inventory (CRUD) managers
  const inventory = [
    { id: 'curricula_inventory', label: 'Curricula Library', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'news_inventory', label: 'News Articles', icon: <Newspaper className="w-4 h-4" /> },
  ];

  const allDefinitions = [...homeSections, ...internalPages, ...inventory];
  const activeDef = allDefinitions.find(d => d.id === activeSection);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Content Management</h1>
          <p className="text-slate-500">Manage all dynamic website content from here.</p>
        </div>
      </div>

      {/* Two-Tier Horizontal Navigation */}
      <div className="z-10 bg-white border-b border-slate-100 shadow-sm mb-8 -mx-8 px-8">
        <div className="max-w-7xl mx-auto px-8">
          {/* Tier 1: Category Selector */}
          <div className="flex gap-8 border-b border-slate-50">
            {[
              { id: 'home', label: 'Home Page', color: 'teal', icon: <LayoutTemplate className="w-4 h-4" /> },
              { id: 'inventory', label: 'Data Libraries', color: 'indigo', icon: <Database className="w-4 h-4" /> },
              { id: 'pages', label: 'Standalone Pages', color: 'amber', icon: <LayoutDashboard className="w-4 h-4" /> },
            ].map(cat => {
              const isHome = cat.id === 'home' && homeSections.some(s => s.id === activeSection);
              const isInv = cat.id === 'inventory' && inventory.some(s => s.id === activeSection);
              const isPage = cat.id === 'pages' && internalPages.some(s => s.id === activeSection);
              const isCatSelected = isHome || isInv || isPage;

              const activeStyles: Record<string, string> = {
                teal: 'border-teal-600 text-teal-700',
                indigo: 'border-indigo-600 text-indigo-700',
                amber: 'border-amber-600 text-amber-700'
              };

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === 'home') setActiveSection('hero');
                    if (cat.id === 'inventory') setActiveSection('curricula_inventory');
                    if (cat.id === 'pages') setActiveSection('about_page');
                  }}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-all font-black text-xs uppercase tracking-widest ${
                    isCatSelected 
                      ? activeStyles[cat.color]
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Tier 2: Horizontal Scrollable Section Dock */}
          <div className="py-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-3 scroll-smooth">
            {(homeSections.some(s => s.id === activeSection) ? homeSections : 
              inventory.some(s => s.id === activeSection) ? inventory : internalPages).map(s => {
                const isHome = homeSections.some(h => h.id === s.id);
                const isInv = inventory.some(i => i.id === s.id);
                
                const activeStyles: Record<string, string> = {
                  teal: 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/20 scale-105',
                  indigo: 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20 scale-105',
                  amber: 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20 scale-105'
                };
                
                const colorKey = isHome ? 'teal' : isInv ? 'indigo' : 'amber';
                
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                      activeSection === s.id 
                        ? activeStyles[colorKey]
                        : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    {React.cloneElement(s.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
                    {s.label}
                  </button>
                );
              })}
            {/* Edge Spacer to prevent cropping on far right */}
            <div className="flex-shrink-0 w-8 h-4" />
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="w-full pt-8 pb-24 px-8">
         {activeSection === 'videos' ? (
           <VideoManager />
         ) : activeSection === 'curricula_home' ? (
           <CurriculaHomeManager />
         ) : activeSection === 'news_home' ? (
           <NewsHomeManager />
         ) : activeSection === 'curricula_inventory' ? (
           <CurriculaInventoryManager />
         ) : activeSection === 'news_inventory' ? (
           <NewsInventoryManager />
         ) : (
           <SectionEditor 
             sectionId={activeSection} 
             label={activeDef?.label || activeSection} 
             icon={activeDef?.icon}
           />
         )}
      </div>
    </div>
  );
}
