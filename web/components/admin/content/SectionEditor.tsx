"use client";

import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Layout } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { useSiteContent } from '@/hooks/useSiteContent';
import { bulkUpsertSection, uploadImage } from '@/lib/api/content';
import { getToken } from '@/lib/auth/session';
import { DynamicJsonEditor } from './DynamicJsonEditor';

interface SectionEditorProps {
  sectionId: string;
  label: string;
  icon?: React.ReactNode;
}

export function SectionEditor({ sectionId, label, icon }: SectionEditorProps) {
  const { content, loading } = useSiteContent(sectionId);
  
  // Local state for edits
  const [edits, setEdits] = useState<Record<string, { ar: string; en: string; type: string }>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // Sync incoming content to local state once loaded
  useEffect(() => {
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
