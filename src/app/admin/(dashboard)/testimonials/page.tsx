'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Trash2, RefreshCw, Edit2, X, Check, Star } from 'lucide-react';

const ic = "w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm";

interface Testimonial {
  _id?: string; id?: string;
  reviewerName: string; reviewerRole: string; reviewerInitials: string;
  rating: number; content: string; source: string; active: boolean; sortOrder: number;
}

function blank(): Omit<Testimonial,'_id'|'id'> {
  return { reviewerName: '', reviewerRole: '', reviewerInitials: '', rating: 5, content: '', source: 'direct', active: true, sortOrder: 0 };
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState(blank());
  const [savingNew, setSavingNew] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [editData, setEditData] = useState<Partial<Testimonial>>({});
  const [deletingId, setDeletingId] = useState<string|null>(null);
  const [togglingId, setTogglingId] = useState<string|null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (data.success) setItems((data.data || []).map((t: any) => ({ ...t, id: t._id?.toString() || t.id })));
    } catch { toast.error('Failed to load testimonials'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetchItems(); }, [fetchItems]);

  const handleAdd = async () => {
    if (!newItem.reviewerName || !newItem.content) { toast.error('Name and review content are required'); return; }
    setSavingNew(true);
    try {
      const payload = { ...newItem, reviewerInitials: newItem.reviewerInitials || newItem.reviewerName.slice(0, 2).toUpperCase() };
      const res = await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to add');
      toast.success('Testimonial added'); setAdding(false); setNewItem(blank()); void fetchItems();
    } catch (err: any) { toast.error(err.message); } finally { setSavingNew(false); }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update');
      toast.success('Testimonial updated'); setEditId(null); void fetchItems();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !current }) });
      if (!res.ok) throw new Error('Failed to toggle');
      setItems((p) => p.map((t) => t.id === id ? { ...t, active: !current } : t));
    } catch (err: any) { toast.error(err.message); } finally { setTogglingId(null); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete review by "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete');
      toast.success('Testimonial deleted'); setItems((p) => p.filter((t) => t.id !== id));
    } catch (err: any) { toast.error(err.message); } finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-3xl font-serif text-gold-400 font-bold">Testimonials</h1><p className="text-forest-300 mt-1">Manage resident reviews displayed on the public site.</p></div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={fetchItems} className="text-forest-400 hover:text-forest-50"><RefreshCw className="w-4 h-4" /></Button>
          <Button onClick={() => { setAdding(true); setNewItem(blank()); }} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold"><Plus className="w-4 h-4 mr-2" />Add Review</Button>
        </div>
      </div>

      {adding && (
        <div className="bg-forest-900/50 border border-gold-500/20 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">New Testimonial</h2><button onClick={() => setAdding(false)}><X className="w-4 h-4 text-forest-400" /></button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs text-forest-300 mb-1">Reviewer Name</label><input value={newItem.reviewerName} onChange={(e) => setNewItem((p) => ({ ...p, reviewerName: e.target.value }))} className={ic} placeholder="e.g. Rahul" /></div>
            <div><label className="block text-xs text-forest-300 mb-1">Role</label><input value={newItem.reviewerRole} onChange={(e) => setNewItem((p) => ({ ...p, reviewerRole: e.target.value }))} className={ic} placeholder="e.g. Engineering Student" /></div>
            <div><label className="block text-xs text-forest-300 mb-1">Rating (1–5)</label>
              <select value={newItem.rating} onChange={(e) => setNewItem((p) => ({ ...p, rating: parseInt(e.target.value) }))} className={ic}>
                {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ★</option>)}
              </select>
            </div>
            <div><label className="block text-xs text-forest-300 mb-1">Source</label>
              <select value={newItem.source} onChange={(e) => setNewItem((p) => ({ ...p, source: e.target.value }))} className={ic}>
                <option value="direct">Direct</option>
                <option value="google">Google</option>
                <option value="word-of-mouth">Word of Mouth</option>
              </select>
            </div>
            <div className="md:col-span-2"><label className="block text-xs text-forest-300 mb-1">Review Content</label><textarea value={newItem.content} onChange={(e) => setNewItem((p) => ({ ...p, content: e.target.value }))} rows={3} className={ic + " resize-none"} placeholder="What the resident said..." /></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={newItem.active} onChange={(e) => setNewItem((p) => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded border-forest-700 bg-forest-950 text-gold-500" /><label className="text-sm text-forest-200">Active (shown publicly)</label></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAdding(false)} className="text-forest-400">Cancel</Button>
            <Button onClick={handleAdd} disabled={savingNew} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold">{savingNew ? 'Saving...' : 'Add Review'}</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? <div className="flex items-center justify-center py-16"><RefreshCw className="w-6 h-6 text-gold-400 animate-spin" /></div> :
        items.length === 0 ? <div className="text-center py-16 text-forest-400 bg-forest-900/50 rounded-xl border border-forest-800">No testimonials. Add one above.</div> :
        items.map((item) => {
          const id = item.id || item._id || '';
          const isEditing = editId === id;
          return (
            <div key={id} className={`bg-forest-900/50 border rounded-xl p-5 transition-colors ${item.active ? 'border-forest-800' : 'border-forest-800/50 opacity-60'}`}>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><label className="block text-xs text-forest-300 mb-1">Name</label><input value={editData.reviewerName ?? item.reviewerName} onChange={(e) => setEditData((p) => ({ ...p, reviewerName: e.target.value }))} className={ic} /></div>
                    <div><label className="block text-xs text-forest-300 mb-1">Role</label><input value={editData.reviewerRole ?? item.reviewerRole} onChange={(e) => setEditData((p) => ({ ...p, reviewerRole: e.target.value }))} className={ic} /></div>
                    <div><label className="block text-xs text-forest-300 mb-1">Rating</label><select value={editData.rating ?? item.rating} onChange={(e) => setEditData((p) => ({ ...p, rating: parseInt(e.target.value) }))} className={ic}>{[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ★</option>)}</select></div>
                  </div>
                  <div><label className="block text-xs text-forest-300 mb-1">Review</label><textarea value={editData.content ?? item.content} onChange={(e) => setEditData((p) => ({ ...p, content: e.target.value }))} rows={3} className={ic + " resize-none"} /></div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(id)} className="bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs"><Check className="w-3 h-3 mr-1" />Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditId(null)} className="text-forest-400 text-xs"><X className="w-3 h-3 mr-1" />Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-forest-50">{item.reviewerName}</span>
                      <span className="text-xs text-forest-400">{item.reviewerRole}</span>
                      <span className="text-xs text-forest-500 capitalize">{item.source}</span>
                    </div>
                    <div className="flex mb-2">{Array.from({length:5}).map((_,i) => <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'text-gold-400 fill-gold-400' : 'text-forest-700'}`} />)}</div>
                    <p className="text-sm text-forest-300 line-clamp-2">{item.content}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => handleToggle(id, item.active)} disabled={togglingId === id}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.active ? 'bg-gold-500' : 'bg-forest-700'}`}>
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${item.active ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                    <Button size="sm" variant="ghost" onClick={() => { setEditId(id); setEditData({ reviewerName: item.reviewerName, reviewerRole: item.reviewerRole, rating: item.rating, content: item.content }); }} className="text-forest-400 hover:text-gold-400 hover:bg-forest-800 px-2"><Edit2 className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(id, item.reviewerName)} disabled={deletingId === id} className="text-forest-400 hover:text-red-400 hover:bg-red-950/30 px-2"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
