"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { getCurriculaList, upsertCurriculum, deleteCurriculum, uploadImage, DynamicCurriculum } from '@/lib/api/content';
import { getToken } from '@/lib/auth/session';

export function CurriculaInventoryManager() {
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

  useEffect(() => {
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
