'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Trash2, RefreshCw, Copy, FileImage, FileVideo } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  _id?: string; id?: string; url: string; publicId?: string; resourceType?: string;
  format?: string; width?: number; height?: number; bytes?: number; alt?: string;
  originalFilename?: string;
}

function formatBytes(b?: number) {
  if (!b) return '—';
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.success) setItems((data.data || []).map((m: any) => ({ ...m, id: m._id?.toString() || m.id })));
    } catch { toast.error('Failed to load media'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetchItems(); }, [fetchItems]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('altText', file.name.replace(/\.[^/.]+$/, ''));
      const res = await fetch('/api/admin/media', { method: 'POST', body: form });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Upload failed');
      toast.success('File uploaded successfully');
      void fetchItems();
    } catch (err: any) { toast.error(err.message); } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard');
    } catch { toast.error('Failed to copy URL'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this media file? This may break references on the public site.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete');
      toast.success('Media deleted'); setItems((p) => p.filter((m) => m.id !== id));
    } catch (err: any) { toast.error(err.message); } finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-3xl font-serif text-gold-400 font-bold">Media Library</h1><p className="text-forest-300 mt-1">Upload and manage images and videos.</p></div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={fetchItems} className="text-forest-400 hover:text-forest-50" title="Refresh"><RefreshCw className="w-4 h-4" /></Button>
          <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleUpload} className="hidden" id="media-upload" />
          <Button asChild className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold" disabled={uploading}>
            <label htmlFor="media-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />{uploading ? 'Uploading...' : 'Upload File'}
            </label>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 text-gold-400 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-forest-400 bg-forest-900/50 rounded-xl border border-forest-800">
          <FileImage className="w-12 h-12 text-forest-700 mx-auto mb-3" />
          <p>No media uploaded yet. Click &quot;Upload File&quot; to add images or videos.</p>
          <p className="text-xs text-forest-600 mt-2">Requires CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((item) => {
            const id = item.id || item._id || '';
            const isVideo = item.resourceType === 'video' || item.format === 'mp4' || item.format === 'mov';
            return (
              <div key={id} className="bg-forest-950 rounded-xl overflow-hidden border border-forest-800 hover:border-forest-600 transition-colors group">
                <div className="aspect-square relative bg-forest-900">
                  {isVideo ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <FileVideo className="w-8 h-8 text-forest-500" />
                      <span className="text-xs text-forest-500 uppercase font-mono">{item.format}</span>
                    </div>
                  ) : item.url ? (
                    <Image src={item.url} alt={item.alt || 'Media'} fill className="object-cover" sizes="150px" onError={() => {}} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FileImage className="w-8 h-8 text-forest-600" /></div>
                  )}
                </div>
                <div className="p-2 space-y-1.5">
                  <p className="text-xs text-forest-300 truncate font-mono">{item.originalFilename || item.publicId || 'media'}</p>
                  <div className="flex items-center justify-between text-xs text-forest-500">
                    <span className="uppercase font-mono">{item.format || '—'}</span>
                    <span>{formatBytes(item.bytes)}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleCopy(item.url)} title="Copy URL" className="flex-1 text-forest-400 hover:text-gold-400 hover:bg-forest-800 px-1 text-xs"><Copy className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(id)} disabled={deletingId === id} title="Delete" className="flex-1 text-forest-400 hover:text-red-400 hover:bg-red-950/30 px-1 text-xs"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
