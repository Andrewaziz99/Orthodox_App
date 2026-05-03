"use client";

import React, { useState } from 'react';
import { useLang } from '@/components/providers/LanguageProvider';
import { Card, Button } from '@/components/ui';
import { LayoutDashboard, Newspaper, GraduationCap, LayoutTemplate, Save, Image as ImageIcon, Play, Plus, Trash2, Video, Upload } from 'lucide-react';
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
  DynamicNewsArticle, 
  DynamicCurriculum 
} from '@/lib/api/content';
import { getToken } from '@/lib/auth/session';

export default function ContentAdminPage() {
  const { t, locale, dir } = useLang();
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Hardcoded list of customizable sections on the home page
  const sections = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'about', label: 'About Us' },
    { id: 'audience', label: 'Audience' },
    { id: 'curricula', label: 'Curricula' },
    { id: 'news', label: 'News Articles' },
    { id: 'app', label: 'App Section' },
    { id: 'videos', label: 'Videos' },
    { id: 'vision', label: 'Vision' },
    { id: 'cta', label: 'Call to Action' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Content Management</h1>
          <p className="text-slate-500">Manage all dynamic website content from here.</p>
        </div>
      </div>

      {/* Navigation & Content Area */}
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <Card className="col-span-1 p-4 shadow-sm h-fit sticky top-24">
          <h3 className="font-black text-slate-900 mb-4 px-2 text-sm uppercase tracking-wider opacity-50 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" />
            Home Page
          </h3>
          <div className="space-y-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-start px-4 py-2.5 rounded-xl font-bold transition-all ${activeSection === s.id ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Editor Area */}
        <div className="col-span-3">
           {activeSection === 'videos' ? (
             <VideoManager />
           ) : activeSection === 'curricula' ? (
             <CurriculaHomeManager />
           ) : activeSection === 'news' ? (
             <NewsHomeManager />
           ) : (
             <SectionEditor sectionId={activeSection} />
           )}
        </div>
      </div>
    </div>
  );
}

// ─── Section Editor Component ──────────────────────────────────────────────────

function SectionEditor({ sectionId }: { sectionId: string }) {
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
        
        const jsonKeys = ['stats', 'features', 'churches', 'servants', 'children', 'items', 'pillars', 'formLabels'];
        if (jsonKeys.includes(key)) fieldType = 'json';
        else if (key.toLowerCase().includes('image')) fieldType = 'image';

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
    <Card className="p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-900 capitalize">{sectionId} Section</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-8">
        {keys.map(key => {
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

      return (
        <div className="grid grid-cols-2 gap-4 mb-2">
           <input type="text" value={String(nodeAr)} onChange={(e) => handleChange(path, 'ar', e.target.value)} className="w-full bg-white border-slate-200 rounded-lg p-2 text-sm" dir="rtl" />
           <input type="text" value={String(nodeEn || '')} onChange={(e) => handleChange(path, 'en', e.target.value)} className="w-full bg-white border-slate-200 rounded-lg p-2 text-sm" />
        </div>
      );
    }
    if (Array.isArray(nodeAr)) {
       return (
         <div className="space-y-4">
           {nodeAr.map((item, idx) => (
             <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200">
               <span className="text-xs font-bold text-slate-400">Item {idx + 1}</span>
               {renderNode(item, nodeEn?.[idx], [...path, idx])}
             </div>
           ))}
         </div>
       );
    }
    if (typeof nodeAr === 'object' && nodeAr !== null) {
       return (
         <div className="space-y-3">
           {Object.keys(nodeAr).map(k => (
             <div key={k} className="pl-4 border-l-2 border-slate-100">
               <span className="block text-xs font-bold text-teal-700 capitalize mb-2">{k}</span>
               {renderNode(nodeAr[k], nodeEn?.[k], [...path, k])}
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

  const featuredIds = React.useMemo(() => {
    try {
      const val = content['featuredIds']?.en || '[]';
      return Array.isArray(JSON.parse(val)) ? JSON.parse(val) : [];
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
        <h3 className="text-xl font-black text-slate-900 mb-6">Select Curricula for Home Page</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {allCurricula.map(c => (
            <div 
              key={c.id} 
              onClick={() => toggleId(c.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${featuredIds.includes(c.id) ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'}`}
            >
              <div>
                <p className="font-bold text-slate-800">{c.titleEn}</p>
                <p className="text-sm text-slate-500">{c.titleAr}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${featuredIds.includes(c.id) ? 'bg-teal-500 border-teal-500' : 'border-slate-300'}`}>
                {featuredIds.includes(c.id) && <Save className="w-3 h-3 text-white" />}
              </div>
            </div>
          ))}
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

  const featuredIds = React.useMemo(() => {
    try {
      const val = content['featuredIds']?.en || '[]';
      return Array.isArray(JSON.parse(val)) ? JSON.parse(val) : [];
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
        <h3 className="text-xl font-black text-slate-900 mb-6">Select Featured Articles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {allNews.map(n => (
            <div 
              key={n.id} 
              onClick={() => toggleId(n.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${featuredIds.includes(n.id) ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'}`}
            >
              <div>
                <p className="font-bold text-slate-800">{n.titleEn}</p>
                <p className="text-sm text-slate-500">{n.titleAr}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${featuredIds.includes(n.id) ? 'bg-teal-500 border-teal-500' : 'border-slate-300'}`}>
                {featuredIds.includes(n.id) && <Save className="w-3 h-3 text-white" />}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

