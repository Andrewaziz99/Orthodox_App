"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Image as ImageIcon, Play, Video, Upload } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { useSiteContent } from '@/hooks/useSiteContent';
import { getVideos, upsertVideo, deleteVideo, uploadImage, bulkUpsertSection, DynamicVideo } from '@/lib/api/content';
import { getToken } from '@/lib/auth/session';

export function VideoManager() {
  const [videos, setVideos] = useState<DynamicVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Partial<DynamicVideo> | null>(null);
  const [uploading, setUploading] = useState<'thumb' | 'video' | null>(null);

  const { content, setContent, loading: contentLoading } = useSiteContent('videos');
  const [savingSection, setSavingSection] = useState(false);

  useEffect(() => {
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
