"use client";

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { getToken } from '@/lib/auth/session';
import { uploadImage } from '@/lib/api/content';

interface DynamicJsonEditorProps {
  field: { ar: string; en: string; type: string };
  onChange: (newField: any) => void;
  onImageUpload?: (key: string, file: File) => Promise<void>;
}

export function DynamicJsonEditor({ 
  field, 
  onChange, 
  onImageUpload 
}: DynamicJsonEditorProps) {
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
                    <Trash2Icon className="w-3.5 h-3.5" />
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
             <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
             Add New Item
           </button>
         </div>
       );
    }
    if (typeof nodeAr === 'object' && nodeAr !== null) {
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

// Internal icons needed for the editor
function PlusIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
}

function Trash2Icon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
}
