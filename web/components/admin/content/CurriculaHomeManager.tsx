"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Card, Button } from '@/components/ui';
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
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useSiteContent } from '@/hooks/useSiteContent';
import { getCurriculaList, bulkUpsertSection, DynamicCurriculum } from '@/lib/api/content';
import { SortableItem } from './SortableItem';

export function CurriculaHomeManager() {
  const [allCurricula, setAllCurricula] = useState<DynamicCurriculum[]>([]);
  const { content, setContent, loading } = useSiteContent('curricula');
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    getCurriculaList(true).then(setAllCurricula).catch((error) => {
      console.error('Failed to load protected curricula', error);
      setLoadError(true);
    });
  }, []);

  const featuredIds = useMemo<string[]>(() => {
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
      
      await bulkUpsertSection('curricula', entries);
      alert('Curricula home settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Curricula Settings...</div>;
  if (loadError) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">Unable to load protected curricula.</div>;

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
