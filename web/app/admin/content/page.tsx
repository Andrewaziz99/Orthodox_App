"use client";

import React, { useState } from 'react';
import { useLang } from '@/components/providers/LanguageProvider';
import { Card, Button } from '@/components/ui';
import { 
  Plus, 
  Save, 
  Trash2, 
  Image as ImageIcon, 
  Play, 
  Video, 
  ArrowLeft, 
  ArrowRight, 
  Settings, 
  Layout, 
  FileText, 
  Users, 
  Database,
  GripVertical,
  GraduationCap,
  Newspaper,
  LayoutDashboard,
  LayoutTemplate,
  Upload,
  Sparkles,
  Smartphone,
  Eye,
  Megaphone
} from 'lucide-react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSiteContent } from '@/hooks/useSiteContent';
import { 
  bulkUpsertSection, 
  uploadImage, 
  getVideos, 
  upsertVideo, 
  deleteVideo, 
  DynamicVideo, 
  getNewsArticles, 
  getCurriculaList, 
  upsertNews,
  deleteNews,
  upsertCurriculum,
  deleteCurriculum,
  DynamicNewsArticle, 
  DynamicCurriculum 
} from '@/lib/api/content';
import { getToken } from '@/lib/auth/session';

export default function ContentAdminPage() {
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
      <div className="max-w-5xl mx-auto pt-8 pb-24 px-4">
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

// ─── Section Editor Component ──────────────────────────────────────────────────

function SectionEditor({ sectionId, label, icon }: { sectionId: string, label: string, icon?: React.ReactNode }) {
  const { content, loading } = useSiteContent(sectionId);
  
  // Local state for edits
  const [edits, setEdits] = useState<Record<string, { ar: string; en: string; type: string }>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // Sync incoming content to local state once loaded
  React.useEffect(() => {
    if (!loading && Object.keys(content).length > 0) {
      const initialEdits: any = {};
      Object.keys(content).forEach(key => {
        let fieldType = content[key].type || 'text';
        
        const jsonKeys = [
          'stats', 'features', 'churches', 'servants', 'children', 
          'items', 'pillars', 'formLabels', 'milestones', 'socialLinks', 'values'
        ];
        if (jsonKeys.includes(key)) fieldType = 'json';
        else if (key.toLowerCase().includes('image')) fieldType = 'image';
        else if (key.toLowerCase().includes('description') || key.toLowerCase().includes('subtitle') || key.toLowerCase().includes('body')) fieldType = 'textarea';

        initialEdits[key] = {
          ar: content[key].ar || '',
          en: content[key].en || '',
          type: fieldType
        };
      });
      setEdits(initialEdits);
    }
  }, [content, loading]);

  if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-2xl w-full" />;

  const handleSave = async () => {
    setSaving(true);
    const token = getToken() || ''; 
    const payload = Object.entries(edits).map(([key, val]) => ({
      key,
      valueAr: val.ar,
      valueEn: val.en,
      type: val.type
    }));

    const success = await bulkUpsertSection(sectionId, payload, token);
    setSaving(false);
    if (success) alert('Saved successfully!');
    else alert('Failed to save.');
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingImage(key);
    const token = getToken() || '';
    const url = await uploadImage(file, token);
    setUploadingImage(null);
    if (url) {
      setEdits(prev => ({
        ...prev,
        [key]: { ...prev[key], ar: url, en: url }
      }));
    }
  };

  const keys = Object.keys(edits);

  if (keys.length === 0) {
    return <Card className="p-8 text-center text-slate-500">No content found for this section.</Card>;
  }

  return (
    <Card className="p-8 shadow-sm border-slate-200">
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
            {icon ? React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' }) : <Layout className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{label}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{sectionId}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="shadow-lg shadow-teal-600/20 px-6">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-8">
        {keys.filter(key => !(sectionId === 'app' && key.toLowerCase().includes('image'))).map(key => {
          const field = edits[key];
          return (
            <div key={key} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-700 capitalize tracking-wide">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <span className="text-xs font-bold px-2 py-1 bg-slate-200 text-slate-500 rounded uppercase">{field.type}</span>
              </div>

              {field.type === 'image' ? (
                <div className="flex items-center gap-6">
                  {field.ar && (
                    <div className="w-32 h-32 relative rounded-lg overflow-hidden border-2 border-slate-200">
                      <img src={field.ar} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer hover:bg-slate-50 transition w-max">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                    {uploadingImage === key ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(key, e.target.files[0])} />
                  </label>
                </div>
              ) : field.type === 'json' ? (
                 <DynamicJsonEditor 
                   field={field} 
                   onChange={(newField) => setEdits(prev => ({ ...prev, [key]: newField }))} 
                   onImageUpload={handleImageUpload}
                 />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Arabic</label>
                    <textarea
                      value={field.ar}
                      onChange={e => setEdits(prev => ({ ...prev, [key]: { ...prev[key], ar: e.target.value } }))}
                      className="w-full bg-white border-slate-200 rounded-xl p-3 h-24"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">English</label>
                    <textarea
                      value={field.en}
                      onChange={e => setEdits(prev => ({ ...prev, [key]: { ...prev[key], en: e.target.value } }))}
                      className="w-full bg-white border-slate-200 rounded-xl p-3 h-24"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Dynamic JSON Editor Component ─────────────────────────────────────────────

function DynamicJsonEditor({ 
  field, 
  onChange, 
  onImageUpload 
}: { 
  field: { ar: string; en: string; type: string }, 
  onChange: (newField: any) => void,
  onImageUpload?: (key: string, file: File) => Promise<void>
}) {
  const [uploadingPath, setUploadingPath] = useState<string | null>(null);
  let dataAr: any = {};
  let dataEn: any = {};
  try {
    dataAr = JSON.parse(field.ar || '{}');
    dataEn = JSON.parse(field.en || '{}');
  } catch (e) {
    return <div className="text-rose-500 font-mono text-xs">Invalid JSON Data</div>;
  }

  const handleChange = (path: (string | number)[], lang: 'ar' | 'en', newValue: string) => {
    const updateNested = (obj: any, currentPath: (string | number)[]): any => {
      if (currentPath.length === 0) return newValue;
      const [head, ...rest] = currentPath;
      if (Array.isArray(obj)) {
        const newArr = [...obj];
        newArr[head as number] = updateNested(newArr[head as number], rest);
        return newArr;
      }
      return { ...obj, [head]: updateNested(obj[head], rest) };
    };

    if (lang === 'ar') onChange({ ...field, ar: JSON.stringify(updateNested(dataAr, path)) });
    else onChange({ ...field, en: JSON.stringify(updateNested(dataEn, path)) });
  };

  const renderNode = (nodeAr: any, nodeEn: any, path: (string | number)[]) => {
    if (typeof nodeAr === 'string' || typeof nodeAr === 'number') {
      const isImageField = path[path.length - 1]?.toString().toLowerCase().includes('icon') || 
                          path[path.length - 1]?.toString().toLowerCase().includes('image');

      if (isImageField && onImageUpload) {
        const currentUrl = String(nodeAr);
        const pathKey = path.join('.');

        return (
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="space-y-2">
              {currentUrl && currentUrl.startsWith('http') && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                  <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-50 transition w-max">
                <Upload className="w-3 h-3 text-slate-400" />
                {uploadingPath === pathKey ? 'Uploading...' : 'Upload Icon'}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadingPath(pathKey);
                      const token = getToken() || '';
                      const url = await uploadImage(file, token);
                      setUploadingPath(null);
                      if (url) {
                        // Update both ar and en in one shot to avoid race conditions
                        const updateNested = (obj: any, currentPath: (string | number)[]): any => {
                          if (currentPath.length === 0) return url;
                          const [head, ...rest] = currentPath;
                          if (Array.isArray(obj)) {
                            const newArr = [...obj];
                            newArr[head as number] = updateNested(newArr[head as number], rest);
                            return newArr;
                          }
                          return { ...obj, [head]: updateNested(obj[head], rest) };
                        };
                        
                        const newAr = JSON.stringify(updateNested(dataAr, path));
                        const newEn = JSON.stringify(updateNested(dataEn, path));
                        onChange({ ...field, ar: newAr, en: newEn });
                      }
                    }
                  }} 
                />
              </label>
            </div>
            <div className="text-xs text-slate-400 self-end pb-2">
              Vector SVG or PNG recommended
            </div>
          </div>
        );
      }

      const keyName = path[path.length - 1]?.toString().toLowerCase() || '';
      const showInAr = !keyName.endsWith('en');
      const showInEn = !keyName.endsWith('ar');

      return (
        <div className="grid grid-cols-2 gap-4 mb-2">
           {showInAr ? (
             <input type="text" value={String(nodeAr)} onChange={(e) => handleChange(path, 'ar', e.target.value)} className="w-full bg-white border-slate-200 rounded-lg p-2 text-sm" dir="rtl" />
           ) : <div />}
           {showInEn ? (
             <input type="text" value={String(nodeEn || '')} onChange={(e) => handleChange(path, 'en', e.target.value)} className="w-full bg-white border-slate-200 rounded-lg p-2 text-sm" />
           ) : <div />}
        </div>
      );
    }
    if (Array.isArray(nodeAr)) {
       const addItem = () => {
         const firstItem = nodeAr[0] || {};
         const newItem: any = {};
         Object.keys(firstItem).forEach(k => newItem[k] = '');
         const updateNested = (obj: any, currentPath: (string | number)[]): any => {
           if (currentPath.length === 0) return [...obj, newItem];
           const [head, ...rest] = currentPath;
           if (Array.isArray(obj)) {
             const newArr = [...obj];
             newArr[head as number] = updateNested(newArr[head as number], rest);
             return newArr;
           }
           return { ...obj, [head]: updateNested(obj[head], rest) };
         };
         onChange({ 
           ...field, 
           ar: JSON.stringify(updateNested(dataAr, path)), 
           en: JSON.stringify(updateNested(dataEn, path)) 
         });
       };

       const removeItem = (index: number) => {
         if (!confirm('Are you sure?')) return;
         const updateNested = (obj: any, currentPath: (string | number)[]): any => {
           if (currentPath.length === 0) {
             const newArr = [...obj];
             newArr.splice(index, 1);
             return newArr;
           }
           const [head, ...rest] = currentPath;
           if (Array.isArray(obj)) {
             const newArr = [...obj];
             newArr[head as number] = updateNested(newArr[head as number], rest);
             return newArr;
           }
           return { ...obj, [head]: updateNested(obj[head], rest) };
         };
         onChange({ 
           ...field, 
           ar: JSON.stringify(updateNested(dataAr, path)), 
           en: JSON.stringify(updateNested(dataEn, path)) 
         });
       };

       return (
         <div className="space-y-6">
           {nodeAr.map((item, idx) => (
             <div key={idx} className="relative group/item">
                <div className="absolute -left-10 top-0 bottom-0 flex items-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <button onClick={() => removeItem(idx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-rose-100 bg-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Item {idx + 1}</div>
                  {renderNode(item, nodeEn?.[idx], [...path, idx])}
                </div>
             </div>
           ))}
           <button 
             onClick={addItem}
             className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/30 transition-all flex items-center justify-center gap-2 group"
           >
             <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
             Add New Item
           </button>
         </div>
       );
    }
    if (typeof nodeAr === 'object' && nodeAr !== null) {
       // Group fields that have Ar/En counterparts
       const keys = Object.keys(nodeAr);
       const processed = new Set<string>();
       const groups: { label: string; arKey: string; enKey: string }[] = [];

       keys.forEach(k => {
         if (processed.has(k) || k.toLowerCase() === 'color') return;
         const base = k.replace(/(Ar|En)$/, '');
         const arKey = base + (k.endsWith('Ar') || k.endsWith('En') ? 'Ar' : '');
         const enKey = base + (k.endsWith('Ar') || k.endsWith('En') ? 'En' : '');
         if (keys.includes(arKey) && keys.includes(enKey) && arKey !== enKey) {
           groups.push({ label: base, arKey, enKey });
           processed.add(arKey);
           processed.add(enKey);
         } else {
           groups.push({ label: k, arKey: k, enKey: k });
           processed.add(k);
         }
       });

       return (
         <div className="space-y-6">
           {groups.map((group, idx) => (
             <div key={idx} className="pl-4 border-l-2 border-slate-100">
               <span className="block text-xs font-black text-teal-700 uppercase mb-2 tracking-wider">
                 {group.label}
               </span>
               {group.arKey === group.enKey ? (
                 renderNode(nodeAr[group.arKey], nodeEn?.[group.enKey], [...path, group.arKey])
               ) : (
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase ps-1">Arabic Content</span>
                     <input 
                       type="text" 
                       value={String(nodeAr[group.arKey] || '')} 
                       onChange={(e) => handleChange([...path, group.arKey], 'ar', e.target.value)} 
                       className="w-full bg-slate-50/50 border-slate-200 rounded-lg p-2 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all" 
                       dir="rtl" 
                     />
                   </div>
                   <div className="space-y-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase ps-1">English Content</span>
                     <input 
                       type="text" 
                       value={String(nodeEn?.[group.enKey] || '')} 
                       onChange={(e) => group.enKey && handleChange([...path, group.enKey], 'en', e.target.value)} 
                       className="w-full bg-slate-50/50 border-slate-200 rounded-lg p-2 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all" 
                     />
                   </div>
                 </div>
               )}
             </div>
           ))}
         </div>
       );
    }
    return null;
  };

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
       <div className="grid grid-cols-2 gap-4 mb-4 px-4 text-center">
         <span className="text-xs font-bold text-slate-400 uppercase">Arabic</span>
         <span className="text-xs font-bold text-slate-400 uppercase">English</span>
       </div>
       {renderNode(dataAr, dataEn, [])}
    </div>
  );
}

// ─── Sortable Item Component ─────────────────────────────────────────────

function SortableItem({ id, children }: { id: string, children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity z-10"
      >
        <GripVertical className="w-4 h-4 text-slate-400" />
      </div>
      {children}
    </div>
  );
}

// ─── Video Manager Component ─────────────────────────────────────────────

function VideoManager() {
  const [videos, setVideos] = React.useState<DynamicVideo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingVideo, setEditingVideo] = React.useState<Partial<DynamicVideo> | null>(null);
  const [uploading, setUploading] = React.useState<'thumb' | 'video' | null>(null);

  const { content, setContent, loading: contentLoading } = useSiteContent('videos');
  const [savingSection, setSavingSection] = React.useState(false);

  React.useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      setLoading(true);
      const data = await getVideos();
      setVideos(data || []);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file: File, type: 'thumb' | 'video') {
    const token = getToken();
    if (!token) return;
    setUploading(type);
    const url = await uploadImage(file, token);
    setUploading(null);
    if (url) {
      setEditingVideo(prev => ({
        ...prev,
        [type === 'thumb' ? 'thumbnailUrl' : 'videoUrl']: url,
        ...(type === 'video' ? { isYoutube: false } : {})
      }));
    }
  }

  async function handleSave() {
    if (!editingVideo) return;
    const token = getToken();
    if (!token) return;
    const result = await upsertVideo(editingVideo, token);
    if (result) {
      setEditingVideo(null);
      loadVideos();
    } else {
      alert('Failed to save video');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this video?')) return;
    const token = getToken();
    if (!token) return;
    const ok = await deleteVideo(id, token);
    if (ok) loadVideos();
  }

  async function handleSaveSection() {
    const token = getToken();
    if (!token) return;
    setSavingSection(true);
    const updates = Object.entries(content).map(([key, val]) => ({
      key,
      valueAr: val.ar,
      valueEn: val.en,
      type: val.type
    }));
    const ok = await bulkUpsertSection('videos', updates, token);
    setSavingSection(false);
    if (ok) alert('Section settings saved!');
  }

  const handleMetadataChange = (key: string, locale: 'ar' | 'en', value: string) => {
    setContent(prev => ({
      ...prev,
      [key]: { ...prev[key], [locale]: value, type: prev[key]?.type || 'text' }
    }));
  };

  if (loading || contentLoading) return <div className="p-12 text-center text-slate-500 font-bold">Loading...</div>;

  return (
    <div className="space-y-12">
      <Card className="p-8 border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900">Section Header</h3>
            <p className="text-slate-500 text-sm">Change the main title and paragraph shown on the home page.</p>
          </div>
          <Button onClick={handleSaveSection} disabled={savingSection}>
            {savingSection ? 'Saving...' : 'Save Header Info'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest">Main Heading (AR / EN)</label>
            <div className="space-y-2">
              <input type="text" value={content['heading']?.ar || ''} onChange={e => handleMetadataChange('heading', 'ar', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" dir="rtl" />
              <input type="text" value={content['heading']?.en || ''} onChange={e => handleMetadataChange('heading', 'en', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest">Subheading (AR / EN)</label>
            <div className="space-y-2">
              <textarea value={content['subheading']?.ar || ''} onChange={e => handleMetadataChange('subheading', 'ar', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-24" dir="rtl" />
              <textarea value={content['subheading']?.en || ''} onChange={e => handleMetadataChange('subheading', 'en', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-24" />
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Video Gallery</h2>
            <p className="text-slate-500">Manage up to 6 featured videos.</p>
          </div>
          {videos.length < 6 && !editingVideo && (
            <Button onClick={() => setEditingVideo({ titleAr: '', titleEn: '', videoUrl: '', isYoutube: true, order: videos.length })}>
              <Plus className="w-5 h-5 mr-2" /> Add Video
            </Button>
          )}
        </div>

        {editingVideo && (
          <Card className="p-8 shadow-lg border-teal-500/20 bg-teal-50/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800">{editingVideo.id ? 'Edit Video' : 'New Video'}</h3>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEditingVideo(null)}>Cancel</Button>
                <Button onClick={handleSave}>Save Video</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title (AR / EN)</label>
                  <input type="text" value={editingVideo.titleAr} onChange={e => setEditingVideo({...editingVideo, titleAr: e.target.value})} className="w-full bg-white border-slate-200 rounded-xl p-3 mb-2" dir="rtl" />
                  <input type="text" value={editingVideo.titleEn} onChange={e => setEditingVideo({...editingVideo, titleEn: e.target.value})} className="w-full bg-white border-slate-200 rounded-xl p-3" />
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                  <div className="flex gap-4 mb-4">
                    <button onClick={() => setEditingVideo({...editingVideo, isYoutube: true})} className={`flex-1 py-2 rounded-lg font-bold border ${editingVideo.isYoutube ? 'bg-teal-600 text-white' : 'bg-slate-50'}`}>YouTube</button>
                    <button onClick={() => setEditingVideo({...editingVideo, isYoutube: false})} className={`flex-1 py-2 rounded-lg font-bold border ${!editingVideo.isYoutube ? 'bg-teal-600 text-white' : 'bg-slate-50'}`}>Upload</button>
                  </div>
                  {editingVideo.isYoutube ? (
                    <input type="text" placeholder="YouTube URL" value={editingVideo.videoUrl} onChange={e => setEditingVideo({...editingVideo, videoUrl: e.target.value})} className="w-full bg-white border-slate-200 rounded-xl p-3" />
                  ) : (
                    <label className="w-full flex items-center justify-center gap-2 p-3 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer">
                      <Upload className="w-5 h-5 text-slate-500" />
                      <span className="text-sm font-bold">{uploading === 'video' ? 'Uploading...' : (editingVideo.videoUrl ? 'Video Ready' : 'Choose File')}</span>
                      <input type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'video')} />
                    </label>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Thumbnail</label>
                <div className="aspect-video bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 overflow-hidden relative flex flex-col items-center justify-center">
                  {editingVideo.thumbnailUrl ? (
                    <img src={editingVideo.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-slate-300" />
                  )}
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'thumb')} />
                    {uploading === 'thumb' && <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full">Uploading...</span>}
                  </label>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map(video => (
            <Card key={video.id} className="group relative overflow-hidden flex flex-col h-full bg-white border-slate-200 shadow-sm">
              <div className="aspect-video relative overflow-hidden bg-slate-900">
                {video.thumbnailUrl && <img src={video.thumbnailUrl} alt={video.titleEn} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <Play className="w-10 h-10 text-white fill-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all" />
                </div>
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => setEditingVideo(video)} className="p-2 bg-white rounded-lg shadow-lg hover:text-teal-600 transition"><Save className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(video.id)} className="p-2 bg-white rounded-lg shadow-lg text-rose-500 hover:bg-rose-50 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-4 flex-1">
                <h4 className="font-bold text-slate-800 line-clamp-1">{video.titleAr}</h4>
                <p className="text-xs text-slate-500 font-medium">{video.titleEn}</p>
              </div>
            </Card>
          ))}
          {videos.length === 0 && !editingVideo && (
            <div className="col-span-3 p-16 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
              <Video className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold mb-4">No videos found.</p>
              <Button onClick={() => setEditingVideo({ titleAr: '', titleEn: '', videoUrl: '', isYoutube: true, order: 0 })}>Add Your First Video</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Curricula Home Manager ─────────────────────────────────────────────

function CurriculaHomeManager() {
  const [allCurricula, setAllCurricula] = React.useState<DynamicCurriculum[]>([]);
  const { content, setContent, loading } = useSiteContent('curricula');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    getCurriculaList(true).then(setAllCurricula);
  }, []);

  const featuredIds = React.useMemo<string[]>(() => {
    try {
      const val = content['featuredIds']?.en || '[]';
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch (e) {
      return [];
    }
  }, [content]);

  const toggleId = (id: string) => {
    const newIds = featuredIds.includes(id) 
      ? featuredIds.filter((i: string) => i !== id)
      : [...featuredIds, id];
    
    setContent(prev => ({
      ...prev,
      featuredIds: { ar: JSON.stringify(newIds), en: JSON.stringify(newIds), type: 'json' }
    }));
  };

  const handleMetadataChange = (key: string, locale: 'ar' | 'en', value: string) => {
    setContent(prev => {
      const current = prev[key] || { ar: '', en: '', type: 'text' };
      return {
        ...prev,
        [key]: { ...current, [locale]: value, type: 'text' }
      };
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = featuredIds.indexOf(active.id as string);
      const newIndex = featuredIds.indexOf(over.id as string);
      const newIds = arrayMove(featuredIds, oldIndex, newIndex);
      
      setContent(prev => ({
        ...prev,
        featuredIds: { ar: JSON.stringify(newIds), en: JSON.stringify(newIds), type: 'json' }
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = getToken() || '';
      // Ensure we include default fields if they were never edited
      const finalContent = { ...content };
      if (!finalContent.heading) finalContent.heading = { ar: '', en: '', type: 'text' };
      if (!finalContent.subheading) finalContent.subheading = { ar: '', en: '', type: 'text' };
      if (!finalContent.eyebrow) finalContent.eyebrow = { ar: '', en: '', type: 'text' };

      const entries = Object.entries(finalContent).map(([k, v]) => ({ 
        key: k, 
        valueAr: v.ar || '', 
        valueEn: v.en || '', 
        type: v.type || 'text' 
      }));
      
      const success = await bulkUpsertSection('curricula', entries, token);
      if (success) {
        alert('Curricula home settings saved successfully!');
      } else {
        alert('Failed to save. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Curricula Settings...</div>;

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900">Curricula Section Header</h3>
            <p className="text-slate-500 text-sm">Change the titles shown on the home page for curricula.</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-black text-teal-600 uppercase">Eyebrow (AR / EN)</label>
            <input type="text" placeholder="e.g. Our Programs" value={content['eyebrow']?.ar || ''} onChange={e => handleMetadataChange('eyebrow', 'ar', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" dir="rtl" />
            <input type="text" placeholder="e.g. Our Programs" value={content['eyebrow']?.en || ''} onChange={e => handleMetadataChange('eyebrow', 'en', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black text-teal-600 uppercase">Heading (AR / EN)</label>
            <input type="text" placeholder="e.g. Educational Curricula" value={content['heading']?.ar || ''} onChange={e => handleMetadataChange('heading', 'ar', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" dir="rtl" />
            <input type="text" placeholder="e.g. Educational Curricula" value={content['heading']?.en || ''} onChange={e => handleMetadataChange('heading', 'en', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black text-teal-600 uppercase">Subheading (AR / EN)</label>
            <textarea placeholder="Description text..." value={content['subheading']?.ar || ''} onChange={e => handleMetadataChange('subheading', 'ar', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-[104px]" dir="rtl" />
            <textarea placeholder="Description text..." value={content['subheading']?.en || ''} onChange={e => handleMetadataChange('subheading', 'en', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-[104px]" />
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h3 className="text-xl font-black text-slate-900 mb-2">Home Page Selection</h3>
        <p className="text-slate-500 text-sm mb-6">Drag to reorder selected items. Click to add/remove.</p>
        
        <div className="space-y-6">
          {/* Selected Items (Sortable) */}
          {featuredIds.length > 0 && (
            <div className="p-6 bg-teal-50/30 rounded-[2rem] border-2 border-dashed border-teal-100">
              <h4 className="text-xs font-black text-teal-700 uppercase mb-4 px-2">Active on Home Page (Drag to Reorder)</h4>
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={featuredIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 gap-4">
                    {featuredIds.map((id: string) => {
                      const item = allCurricula.find(curr => curr.id === id);
                      if (!item) return null;
                      return (
                        <SortableItem key={id} id={id}>
                          <div 
                            onClick={() => toggleId(id)}
                            className="p-4 pl-10 rounded-2xl border-2 border-teal-500 bg-white shadow-sm transition-all cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-slate-800">{item.titleEn}</p>
                              <p className="text-sm text-slate-500">{item.titleAr}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                              <Save className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Available Items */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase mb-4 px-2">Available Curricula</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {allCurricula.filter(curr => !featuredIds.includes(curr.id)).map(n => (
                <div 
                  key={n.id} 
                  onClick={() => toggleId(n.id)}
                  className="p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 bg-slate-50/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-800">{n.titleEn}</p>
                    <p className="text-sm text-slate-500">{n.titleAr}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── News Home Manager ─────────────────────────────────────────────

function NewsHomeManager() {
  const [allNews, setAllNews] = React.useState<DynamicNewsArticle[]>([]);
  const { content, setContent, loading } = useSiteContent('news');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    getNewsArticles(true).then(setAllNews);
  }, []);

  const featuredIds = React.useMemo<string[]>(() => {
    try {
      const val = content['featuredIds']?.en || '[]';
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch (e) {
      return [];
    }
  }, [content]);

  const toggleId = (id: string) => {
    const newIds = featuredIds.includes(id) 
      ? featuredIds.filter((i: string) => i !== id)
      : [...featuredIds, id];
    
    setContent(prev => ({
      ...prev,
      featuredIds: { ar: JSON.stringify(newIds), en: JSON.stringify(newIds), type: 'json' }
    }));
  };

  const handleMetadataChange = (key: string, locale: 'ar' | 'en', value: string) => {
    setContent(prev => {
      const current = prev[key] || { ar: '', en: '', type: 'text' };
      return {
        ...prev,
        [key]: { ...current, [locale]: value, type: 'text' }
      };
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = featuredIds.indexOf(active.id as string);
      const newIndex = featuredIds.indexOf(over.id as string);
      const newIds = arrayMove(featuredIds, oldIndex, newIndex);
      
      setContent(prev => ({
        ...prev,
        featuredIds: { ar: JSON.stringify(newIds), en: JSON.stringify(newIds), type: 'json' }
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = getToken() || '';
      const finalContent = { ...content };
      if (!finalContent.heading) finalContent.heading = { ar: '', en: '', type: 'text' };
      if (!finalContent.subheading) finalContent.subheading = { ar: '', en: '', type: 'text' };
      if (!finalContent.eyebrow) finalContent.eyebrow = { ar: '', en: '', type: 'text' };

      const entries = Object.entries(finalContent).map(([k, v]) => ({ 
        key: k, 
        valueAr: v.ar || '', 
        valueEn: v.en || '', 
        type: v.type || 'text' 
      }));
      
      const success = await bulkUpsertSection('news', entries, token);
      if (success) {
        alert('News home settings saved successfully!');
      } else {
        alert('Failed to save. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading News Settings...</div>;

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900">News Section Header</h3>
            <p className="text-slate-500 text-sm">Change the titles shown on the home page for news.</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-black text-teal-600 uppercase">Eyebrow (AR / EN)</label>
            <input type="text" placeholder="e.g. Latest News" value={content['eyebrow']?.ar || ''} onChange={e => handleMetadataChange('eyebrow', 'ar', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" dir="rtl" />
            <input type="text" placeholder="e.g. Latest News" value={content['eyebrow']?.en || ''} onChange={e => handleMetadataChange('eyebrow', 'en', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black text-teal-600 uppercase">Heading (AR / EN)</label>
            <input type="text" placeholder="e.g. Our News & Events" value={content['heading']?.ar || ''} onChange={e => handleMetadataChange('heading', 'ar', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" dir="rtl" />
            <input type="text" placeholder="e.g. Our News & Events" value={content['heading']?.en || ''} onChange={e => handleMetadataChange('heading', 'en', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" />
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h3 className="text-xl font-black text-slate-900 mb-2">Featured Articles Selection</h3>
        <p className="text-slate-500 text-sm mb-6">Drag to reorder selected articles. Click to add/remove.</p>
        
        <div className="space-y-6">
          {/* Selected Items (Sortable) */}
          {featuredIds.length > 0 && (
            <div className="p-6 bg-teal-50/30 rounded-[2rem] border-2 border-dashed border-teal-100">
              <h4 className="text-xs font-black text-teal-700 uppercase mb-4 px-2">Active on Home Page (Drag to Reorder)</h4>
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={featuredIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 gap-4">
                    {featuredIds.map((id: string) => {
                      const item = allNews.find(n => n.id === id);
                      if (!item) return null;
                      return (
                        <SortableItem key={id} id={id}>
                          <div 
                            onClick={() => toggleId(id)}
                            className="p-4 pl-10 rounded-2xl border-2 border-teal-500 bg-white shadow-sm transition-all cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-slate-800">{item.titleEn}</p>
                              <p className="text-sm text-slate-500">{item.titleAr}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                              <Save className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Available Items */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase mb-4 px-2">Available Articles</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {allNews.filter(n => !featuredIds.includes(n.id)).map(n => (
                <div 
                  key={n.id} 
                  onClick={() => toggleId(n.id)}
                  className="p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 bg-slate-50/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-800">{n.titleEn}</p>
                    <p className="text-sm text-slate-500">{n.titleAr}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Curricula Inventory Manager ─────────────────────────────────────────────

function CurriculaInventoryManager() {
  const [curricula, setCurricula] = useState<DynamicCurriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<DynamicCurriculum> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingBadge, setUploadingBadge] = useState(false);

  const fetchCurricula = async () => {
    setLoading(true);
    const data = await getCurriculaList(true); // Get all including drafts
    setCurricula(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchCurricula();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    
    // Basic validation
    if (!editing.titleEn || !editing.titleAr || !editing.slug) {
      alert('Please fill in both titles and the slug.');
      return;
    }

    setSaving(true);
    const token = getToken() || '';
    const success = await upsertCurriculum(editing as DynamicCurriculum, token);
    setSaving(false);
    if (success) {
      setEditing(null);
      fetchCurricula();
    } else {
      alert('Failed to save curriculum. Please ensure all fields are filled.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this curriculum?')) return;
    const token = getToken() || '';
    const success = await deleteCurriculum(id, token);
    if (success) fetchCurricula();
        else alert('Failed to delete.');
  };

  const handleBadgeUpload = async (file: File) => {
    setUploadingBadge(true);
    const token = getToken() || '';
    const url = await uploadImage(file, token);
    setUploadingBadge(false);
    if (url && editing) {
      setEditing({ ...editing, badge: url });
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-2xl w-full" />;

  return (
    <div className="space-y-6">
        {editing ? (
          <Card className="p-8 shadow-lg border-2 border-indigo-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900">{editing.id ? 'Edit Curriculum' : 'Add New Curriculum'}</h2>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Curriculum'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Left Side: General Info */}
              <div className="space-y-6">
                 <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Badge / Icon</label>
                  <div className="flex items-center gap-4">
                     {editing.badge && (
                       <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-50 p-2">
                          {(() => {
                            const isUrl = editing.badge && (editing.badge.startsWith('http') || editing.badge.startsWith('/'));
                            const badgeSrc = isUrl 
                              ? editing.badge 
                              : `/assets/badges/${editing.slug === 'bible-characters' ? '4ahed' : editing.slug === 'biblical-concepts' ? 'amin' : editing.slug === 'extended-study' ? 'kof2' : 'mo3lm'}.png`;
                            return <img src={badgeSrc} alt="Badge" className="w-full h-full object-contain" />;
                          })()}
                       </div>
                     )}
                     <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer hover:bg-slate-50 transition">
                        <Upload className="w-4 h-4 text-slate-400" />
                        {uploadingBadge ? 'Uploading...' : 'Upload Badge'}
                        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleBadgeUpload(e.target.files[0])} />
                     </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">English Title (Generates Slug)</label>
                    <input
                      type="text"
                      value={editing.titleEn || ''}
                      onChange={e => {
                        const title = e.target.value;
                        setEditing(prev => prev ? ({ 
                          ...prev, 
                          titleEn: title, 
                          slug: prev.id ? prev.slug : generateSlug(title) 
                        }) : null);
                      }}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Arabic Title</label>
                    <input
                      type="text"
                      value={editing.titleAr || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, titleAr: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 font-bold"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={editing.slug || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, slug: e.target.value }) : null)}
                      className="w-full bg-slate-100 border-slate-200 rounded-xl p-3 font-mono text-sm text-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Curriculum Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 01"
                      value={editing.number || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, number: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Audience (En)</label>
                    <input
                      type="text"
                      value={editing.audienceEn || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, audienceEn: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Audience (Ar)</label>
                    <input
                      type="text"
                      value={editing.audienceAr || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, audienceAr: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Age Range (En)</label>
                    <input
                      type="text"
                      value={editing.ageRangeEn || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, ageRangeEn: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Age Range (Ar)</label>
                    <input
                      type="text"
                      value={editing.ageRangeAr || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, ageRangeAr: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Duration (En)</label>
                    <input
                      type="text"
                      placeholder="e.g. 12 Weeks"
                      value={editing.durationEn || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, durationEn: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Duration (Ar)</label>
                    <input
                      type="text"
                      placeholder="مثلاً: 12 أسبوع"
                      value={editing.durationAr || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, durationAr: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={editing.published} 
                        onChange={e => setEditing(prev => prev ? ({ ...prev, published: e.target.checked }) : null)}
                        className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-bold text-slate-700">Published</span>
                   </label>
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Order</span>
                      <input 
                        type="number" 
                        value={editing.order || 0} 
                        onChange={e => setEditing(prev => prev ? ({ ...prev, order: parseInt(e.target.value) }) : null)}
                        className="w-20 bg-white border-slate-200 rounded-lg p-2 font-bold"
                      />
                   </div>
                </div>
              </div>

              {/* Right Side: Descriptions & Full Content */}
              <div className="space-y-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Short Description (Ar)</label>
                    <textarea
                      value={editing.descriptionAr || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, descriptionAr: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-24"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Short Description (En)</label>
                    <textarea
                      value={editing.descriptionEn || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, descriptionEn: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Syllabus / Content (Ar)</label>
                    <textarea
                      value={editing.fullContentAr || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, fullContentAr: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-48 font-mono text-sm"
                      dir="rtl"
                      placeholder="Supports HTML or plain text..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Syllabus / Content (En)</label>
                    <textarea
                      value={editing.fullContentEn || ''}
                      onChange={e => setEditing(prev => prev ? ({ ...prev, fullContentEn: e.target.value }) : null)}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-48 font-mono text-sm"
                      placeholder="Supports HTML or plain text..."
                    />
                  </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Curricula Library</h2>
                <Button onClick={() => setEditing({ 
                  id: '', // Empty ID for new item
                  published: true, 
                  order: 0,
                  titleAr: '',
                  titleEn: '',
                  slug: '',
                  number: '',
                  badge: '',
                  durationAr: '',
                  durationEn: '',
                  audienceAr: '',
                  audienceEn: '',
                  descriptionAr: '',
                  descriptionEn: '',
                  ageRangeAr: '',
                  ageRangeEn: '',
                  fullContentAr: '',
                  fullContentEn: ''
                })}>
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Curriculum
                </Button>
             </div>

             <div className="grid gap-4">
                {curricula.map(cur => (
                  <Card key={cur.id} className="p-4 flex items-center justify-between hover:border-indigo-200 transition group shadow-sm">
                     <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-lg bg-slate-100 p-2 flex items-center justify-center border border-slate-200">
                            {(() => {
                              const isUrl = cur.badge && (cur.badge.startsWith('http') || cur.badge.startsWith('/'));
                              const badgeSrc = isUrl 
                                ? cur.badge 
                                : `/assets/badges/${cur.slug === 'bible-characters' ? '4ahed' : cur.slug === 'biblical-concepts' ? 'amin' : cur.slug === 'extended-study' ? 'kof2' : 'mo3lm'}.png`;
                              return <img src={badgeSrc} alt="" className="w-full h-full object-contain" />;
                            })()}
                         </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{cur.titleEn} / {cur.titleAr}</h4>
                          <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                             <span className="text-indigo-600 font-mono">/{cur.slug}</span>
                             <span>•</span>
                             <span className={cur.published ? 'text-teal-600' : 'text-amber-600'}>
                               {cur.published ? 'Published' : 'Draft'}
                             </span>
                             <span>•</span>
                             <span>Order: {cur.order}</span>
                          </div>
                        </div>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" onClick={() => setEditing(cur)}>Edit</Button>
                        <Button variant="outline" size="sm" className="text-rose-600 border-rose-100 hover:bg-rose-50" onClick={() => handleDelete(cur.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>
                  </Card>
                ))}
             </div>
          </div>
        )}
      </div>
    );
}

function NewsInventoryManager() {
  const [articles, setArticles] = useState<DynamicNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<DynamicNewsArticle> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    const data = await getNewsArticles(true);
    setArticles(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchNews();
  }, []);

  const handleSave = async () => {
    if (!editing) return;

    // Basic validation
    if (!editing.titleEn || !editing.titleAr || !editing.slug || !editing.categoryEn) {
      alert('Please fill in both titles, the slug, and a category.');
      return;
    }

    setSaving(true);
    const token = getToken() || '';
    const success = await upsertNews(editing as DynamicNewsArticle, token);
    setSaving(false);
    if (success) {
      setEditing(null);
      fetchNews();
    } else {
      alert('Failed to save article. Please ensure all fields are filled.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const token = getToken() || '';
    const success = await deleteNews(id, token);
    if (success) fetchNews();
    else alert('Failed to delete.');
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    const token = getToken() || '';
    const url = await uploadImage(file, token);
    setUploadingImage(false);
    if (url && editing) setEditing({ ...editing, image: url });
  };

  const generateSlug = (title: string) => title.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-2xl w-full" />;

  return (
    <div className="space-y-6">
        {editing ? (
          <Card className="p-8 shadow-lg border-2 border-indigo-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900">{editing.id ? 'Edit Article' : 'New Article'}</h2>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Article'}</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cover Image</label>
                  <div className="flex items-center gap-4">
                    {editing.image && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                        <img src={editing.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer hover:bg-slate-50 transition">
                      <Upload className="w-4 h-4 text-slate-400" />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title (En)</label>
                    <input type="text" value={editing.titleEn || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, titleEn: e.target.value, slug: prev.id ? prev.slug : generateSlug(e.target.value) }) : null)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title (Ar)</label>
                    <input type="text" value={editing.titleAr || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, titleAr: e.target.value }) : null)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" dir="rtl" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Slug</label>
                  <input type="text" value={editing.slug || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, slug: e.target.value }) : null)} className="w-full bg-slate-100 border-slate-200 rounded-xl p-3 font-mono text-sm text-indigo-600" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category (En)</label>
                    <input type="text" value={editing.categoryEn || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, categoryEn: e.target.value }) : null)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category (Ar)</label>
                    <input type="text" value={editing.categoryAr || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, categoryAr: e.target.value }) : null)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" dir="rtl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
                    <input type="text" value={editing.date || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, date: e.target.value }) : null)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" placeholder="e.g. March 2025" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Order</label>
                    <input type="number" value={editing.order || 0} onChange={e => setEditing(prev => prev ? ({ ...prev, order: parseInt(e.target.value) }) : null)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Excerpt (En)</label>
                    <textarea value={editing.excerptEn || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, excerptEn: e.target.value }) : null)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Excerpt (Ar)</label>
                    <textarea value={editing.excerptAr || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, excerptAr: e.target.value }) : null)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-20" dir="rtl" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Body Content (En)</label>
                  <textarea value={editing.bodyEn || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, bodyEn: e.target.value }) : null)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-48" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Body Content (Ar)</label>
                  <textarea value={editing.bodyAr || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, bodyAr: e.target.value }) : null)} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 h-48" dir="rtl" />
                </div>
              </div>
            </div>
          </Card>
        ) : (
         <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">News Articles</h2>
              <Button onClick={() => setEditing({ 
                id: '', // Empty ID for new item
                published: true, 
                order: 0,
                titleAr: '',
                titleEn: '',
                slug: '',
                excerptAr: '',
                excerptEn: '',
                bodyAr: '',
                bodyEn: '',
                categoryAr: '',
                categoryEn: '',
                date: '',
                image: ''
              })}>
                <Plus className="w-5 h-5 mr-2" />
                Write New Article
              </Button>
            </div>

            <div className="grid gap-4">
               {articles.map(art => (
                 <Card key={art.id} className="p-4 flex items-center justify-between hover:border-indigo-200 transition group shadow-sm">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                          {art.image && <img src={art.image} alt="" className="w-full h-full object-cover" />}
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-900">{art.titleEn}</h4>
                         <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                           <span className="text-indigo-600 font-mono">/{art.slug}</span>
                           <span>•</span>
                           <span>{art.date}</span>
                         </div>
                       </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" onClick={() => setEditing(art)}>Edit</Button>
                      <Button variant="outline" size="sm" className="text-rose-600 border-rose-100 hover:bg-rose-50" onClick={() => handleDelete(art.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                 </Card>
               ))}
            </div>
         </div>
       )}
    </div>
  );
}

