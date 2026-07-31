'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Trash2, RefreshCw, Edit2, X, Check } from 'lucide-react';

const ic = "w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm";
const CATS = ['standard','premium','security','lifestyle'] as const;

interface Amenity {
  _id?: string; id?: string; name: string; iconKey: string; description: string;
  category: string; sortOrder: number; active: boolean;
}

function blank(): Omit<Amenity,'_id'|'id'> {
  return { name: '', iconKey: 'Star', description: '', category: 'standard', sortOrder: 0, active: true };
}

export default function AdminAmenitiesPage() {
  const [items, setItems] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState(blank());
  const [savingNew, setSavingNew] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [editData, setEditData] = useState<Partial<Amenity>>({});
  const [deletingId, setDeletingId] = useState<string|null>(null);
  const [togglingId, setTogglingId] = useState<string|null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/amenities');
      const data = await res.json();
      if (data.success) setItems((data.data || []).map((a: any) => ({ ...a, id: a._id?.toString() || a.id })));
    } catch { toast.error('Failed to load amenities'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetchItems(); }, [fetchItems]);

  const handleAdd = async () => {
    if (!newItem.name) { toast.error('Name is required'); return; }
    setSavingNew(true);
    try {
      const res = await fetch('/api/admin/amenities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newItem) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to add');
      toast.success('Amenity added');
      setAdding(false); setNewItem(blank()); void fetchItems();
    } catch (err: any) { toast.error(err.message); } finally { setSavingNew(false); }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/amenities/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update');
      toast.success('Amenity updated'); setEditId(null); void fetchItems();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/admin/amenities/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !current }) });
      if (!res.ok) throw new Error('Failed to toggle');
      setItems((p) => p.map((a) => a.id === id ? { ...a, active: !current } : a));
    } catch (err: any) { toast.error(err.message); } finally { setTogglingId(null); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/amenities/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete');
      toast.success('Amenity deleted');
      setItems((p) => p.filter((a) => a.id !== id));
    } catch (err: any) { toast.error(err.message); } finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-3xl font-serif text-gold-400 font-bold">Amenities</h1><p className="text-forest-300 mt-1">Manage amenities shown on the public site.</p></div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={fetchItems} className="text-forest-400 hover:text-forest-50"><RefreshCw className="w-4 h-4" /></Button>
          <Button onClick={() => { setAdding(true); setNewItem(blank()); }} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold"><Plus className="w-4 h-4 mr-2" />Add Amenity</Button>
        </div>
      </div>

      {adding && (
        <div className="bg-forest-900/50 border border-gold-500/20 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">New Amenity</h2><button onClick={() => setAdding(false)}><X className="w-4 h-4 text-forest-400" /></button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs text-forest-300 mb-1">Name</label><input value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} className={ic} placeholder="e.g. High-Speed WiFi" /></div>
            <div><label className="block text-xs text-forest-300 mb-1">Icon Key (Lucide)</label><input value={newItem.iconKey} onChange={(e) => setNewItem((p) => ({ ...p, iconKey: e.target.value }))} className={ic} placeholder="e.g. Wifi, ShieldCheck" /></div>
            <div><label className="block text-xs text-forest-300 mb-1">Category</label>
              <select value={newItem.category} onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))} className={ic}>
                {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="block text-xs text-forest-300 mb-1">Sort Order</label><input type="number" value={newItem.sortOrder} onChange={(e) => setNewItem((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} className={ic} /></div>
            <div className="md:col-span-2"><label className="block text-xs text-forest-300 mb-1">Description</label><input value={newItem.description} onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))} className={ic} placeholder="Short description..." /></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={newItem.active} onChange={(e) => setNewItem((p) => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded border-forest-700 bg-forest-950 text-gold-500" /><label className="text-sm text-forest-200">Active</label></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAdding(false)} className="text-forest-400">Cancel</Button>
            <Button onClick={handleAdd} disabled={savingNew} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold">{savingNew ? 'Saving...' : 'Add Amenity'}</Button>
          </div>
        </div>
      )}

      <div className="bg-forest-900/50 border border-forest-800 rounded-xl overflow-hidden">
        {loading ? <div className="flex items-center justify-center py-16"><RefreshCw className="w-6 h-6 text-gold-400 animate-spin" /></div> :
        items.length === 0 ? <div className="text-center py-16 text-forest-400">No amenities. Add one above.</div> : (
          <table className="w-full text-sm text-left">
            <thead className="bg-forest-950/50 border-b border-forest-800 text-forest-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden md:table-cell">Icon</th>
                <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800">
              {items.map((item) => {
                const id = item.id || item._id || '';
                const isEditing = editId === id;
                return (
                  <tr key={id} className="hover:bg-forest-800/30">
                    <td className="px-4 py-3 text-forest-50 font-medium">
                      {isEditing ? <input value={editData.name ?? item.name} onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))} className={ic} /> : item.name}
                    </td>
                    <td className="px-4 py-3 text-forest-400 font-mono text-xs hidden md:table-cell">
                      {isEditing ? <input value={editData.iconKey ?? item.iconKey} onChange={(e) => setEditData((p) => ({ ...p, iconKey: e.target.value }))} className={ic} /> : item.iconKey}
                    </td>
                    <td className="px-4 py-3 text-forest-400 capitalize hidden sm:table-cell">
                      {isEditing ? <select value={editData.category ?? item.category} onChange={(e) => setEditData((p) => ({ ...p, category: e.target.value }))} className={ic}>{CATS.map((c) => <option key={c} value={c}>{c}</option>)}</select> : item.category}
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => handleToggle(id, item.active)} disabled={togglingId === id}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.active ? 'bg-gold-500' : 'bg-forest-700'}`}>
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${item.active ? 'translate-x-4' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-1">
                          <Button size="sm" onClick={() => handleSaveEdit(id)} className="bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs px-2"><Check className="w-3 h-3" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditId(null)} className="text-forest-400 text-xs px-2"><X className="w-3 h-3" /></Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => { setEditId(id); setEditData({ name: item.name, iconKey: item.iconKey, category: item.category }); }} className="text-forest-400 hover:text-gold-400 hover:bg-forest-800 px-2"><Edit2 className="w-3 h-3" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(id, item.name)} disabled={deletingId === id} className="text-forest-400 hover:text-red-400 hover:bg-red-950/30 px-2"><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
