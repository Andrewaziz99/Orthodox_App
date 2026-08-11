"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { getNewsArticles, upsertNews, deleteNews, uploadImage, DynamicNewsArticle } from '@/lib/api/content';
import { handleApiError } from '@/lib/api/client';

export function NewsInventoryManager() {
  const [articles, setArticles] = useState<DynamicNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editing, setEditing] = useState<Partial<DynamicNewsArticle> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      setArticles(await getNewsArticles(true));
    } catch (error) {
      console.error('Failed to load the news inventory', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    try {
      await upsertNews(editing as DynamicNewsArticle);
      setEditing(null);
      await fetchNews();
    } catch (error) {
      alert(handleApiError(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteNews(id);
      await fetchNews();
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      if (editing) setEditing({ ...editing, image: url });
    } catch (error) {
      alert(handleApiError(error));
    } finally {
      setUploadingImage(false);
    }
  };

  const generateSlug = (title: string) => title.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-2xl w-full" />;
  if (loadError) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">Unable to load the protected news inventory.</div>;

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
                <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editing.published ?? false}
                    onChange={e => setEditing(prev => prev ? ({ ...prev, published: e.target.checked }) : null)}
                  />
                  Published
                </label>
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
                 published: false,
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
