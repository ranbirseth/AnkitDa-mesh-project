'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Trash2, RefreshCw, Edit2, X, Check } from 'lucide-react';
import Image from 'next/image';

const ic = "w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm";
const CATS = ['all','rooms','building','kitchen','terrace','bathroom'] as const;
type Cat = typeof CATS[number];

interface GalleryItem {
  _id?: string; id?: string; title: string; alt: string; category: Exclude<Cat,'all'>; featured?: boolean;
  image: { url: string; alt: string; id?: string; width?: number; height?: number; };
}

function blankItem(): Omit<GalleryItem,'_id'|'id'> {
  return { title: '', alt: '', category: 'rooms', featured: false, image: { url: '', alt: '', width: 900, height: 1200 } };
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<Cat>('all');
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState(blankItem());
  const [savingNew, setSavingNew] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [editData, setEditData] = useState<Partial<GalleryItem>>({});
  const [deletingId, setDeletingId] = useState<string|null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const url = cat === 'all' ? '/api/admin/gallery' : `/api/admin/gallery?category=${cat}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setItems((data.data || []).map((i: any) => ({ ...i, id: i._id?.toString() || i.id })));
    } catch { toast.error('Failed to load gallery'); } finally { setLoading(false); }
  }, [cat]);

  useEffect(() => { void fetchItems(); }, [fetchItems]);

  const handleAdd = async () => {
    if (!newItem.title || !newItem.image.url) { toast.error('Title and image URL are required'); return; }
    setSavingNew(true);
    try {
      const payload = { ...newItem, image: { ...newItem.image, id: newItem.image.url, alt: newItem.alt } };
      const res = await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to add');
      toast.success('Gallery item added');
      setAdding(false);
      setNewItem(blankItem());
      void fetchItems();
    } catch (err: any) { toast.error(err.message); } finally { setSavingNew(false); }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update');
      toast.success('Gallery item updated');
      setEditId(null);
      void fetchItems();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete');
      toast.success('Gallery item deleted');
      setItems((p) => p.filter((i) => i.id !== id));
    } catch (err: any) { toast.error(err.message); } finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-3xl font-serif text-gold-400 font-bold">Gallery</h1><p className="text-forest-300 mt-1">Manage gallery photos by category.</p></div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={fetchItems} className="text-forest-400 hover:text-forest-50" title="Refresh"><RefreshCw className="w-4 h-4" /></Button>
          <Button onClick={() => { setAdding(true); setNewItem(blankItem()); }} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold"><Plus className="w-4 h-4 mr-2" />Add Image</Button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${cat === c ? 'bg-forest-800 border-forest-700 text-gold-400' : 'border-forest-800 text-forest-300 hover:bg-forest-800/50'}`}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-forest-900/50 border border-gold-500/20 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">New Gallery Item</h2>
            <button type="button" onClick={() => setAdding(false)}><X className="w-4 h-4 text-forest-400 hover:text-forest-50" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs text-forest-300 mb-1">Title</label><input value={newItem.title} onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))} className={ic} placeholder="Room — View 1" /></div>
            <div><label className="block text-xs text-forest-300 mb-1">Category</label>
              <select value={newItem.category} onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value as any }))} className={ic}>
                {CATS.filter((c) => c !== 'all').map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2"><label className="block text-xs text-forest-300 mb-1">Image URL</label><input value={newItem.image.url} onChange={(e) => setNewItem((p) => ({ ...p, image: { ...p.image, url: e.target.value }, alt: p.alt }))} className={ic} placeholder="https://res.cloudinary.com/..." /></div>
            <div className="md:col-span-2"><label className="block text-xs text-forest-300 mb-1">Alt Text</label><input value={newItem.alt} onChange={(e) => setNewItem((p) => ({ ...p, alt: e.target.value, image: { ...p.image, alt: e.target.value } }))} className={ic} placeholder="Descriptive alt text for accessibility" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="feat-new" checked={!!newItem.featured} onChange={(e) => setNewItem((p) => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded border-forest-700 bg-forest-950 text-gold-500" /><label htmlFor="feat-new" className="text-sm text-forest-200 cursor-pointer">Featured (shows in slider)</label></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAdding(false)} className="text-forest-400">Cancel</Button>
            <Button onClick={handleAdd} disabled={savingNew} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold">{savingNew ? 'Saving...' : 'Add Image'}</Button>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 text-gold-400 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-forest-400">No images found. Add one or change the filter.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => {
            const id = item.id || item._id || '';
            const isEditing = editId === id;
            return (
              <div key={id} className="group relative bg-forest-950 rounded-xl overflow-hidden border border-forest-800 hover:border-forest-600 transition-colors">
                <div className="aspect-[3/4] relative bg-forest-900">
                  {item.image?.url ? (
                    <Image src={item.image.url} alt={item.alt || item.title} fill className="object-cover" sizes="200px" onError={() => {}} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-forest-600 text-xs">No image</div>
                  )}
                  {item.featured && <span className="absolute top-2 left-2 bg-gold-500 text-forest-950 text-xs font-bold px-1.5 py-0.5 rounded">★</span>}
                </div>
                {isEditing ? (
                  <div className="p-3 space-y-2">
                    <input value={editData.title || ''} onChange={(e) => setEditData((p) => ({ ...p, title: e.target.value }))} className={ic} placeholder="Title" />
                    <select value={(editData.category) || item.category} onChange={(e) => setEditData((p) => ({ ...p, category: e.target.value as Exclude<Cat, 'all'> }))} className={ic}>
                      {CATS.filter((c) => c !== 'all').map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(id)} className="flex-1 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs"><Check className="w-3 h-3 mr-1" />Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditId(null)} className="text-forest-400 text-xs"><X className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    <p className="text-xs text-forest-200 font-medium truncate">{item.title}</p>
                    <p className="text-xs text-forest-500 capitalize mt-0.5">{item.category}</p>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="ghost" onClick={() => { setEditId(id); setEditData({ title: item.title, category: item.category }); }} className="flex-1 text-forest-400 hover:text-gold-400 hover:bg-forest-800 text-xs py-1"><Edit2 className="w-3 h-3" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(id, item.title)} disabled={deletingId === id} className="flex-1 text-forest-400 hover:text-red-400 hover:bg-red-950/30 text-xs py-1"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
