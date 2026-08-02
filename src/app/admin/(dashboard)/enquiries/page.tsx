'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw, Search, Trash2, Eye, X, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  roomType?: string;
  roomName?: string;
  message?: string;
  source?: string;
  status: 'new' | 'contacted' | 'closed';
  adminNotes?: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

const STATUS_CONFIG = {
  new: { label: 'New', icon: Clock, cls: 'bg-amber-500/15 text-amber-300 border-amber-500/20' },
  contacted: { label: 'Contacted', icon: CheckCircle, cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' },
  closed: { label: 'Closed', icon: XCircle, cls: 'bg-forest-700/30 text-forest-300 border-forest-600/20' },
};

const ic = 'w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm';

function fmt(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      params.set('limit', '100');
      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems((data.data || []).map((i: any) => ({ ...i, _id: i._id?.toString() || i.id })));
        setTotal(data.meta?.total || 0);
      }
    } catch { toast.error('Failed to load enquiries'); }
    finally { setLoading(false); }
  }, [statusFilter, search]);

  useEffect(() => { void fetchItems(); }, [fetchItems]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this enquiry? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Enquiry deleted');
      setItems(p => p.filter(i => i._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err: any) { toast.error(err.message); }
    finally { setDeletingId(null); }
  };

  const handleStatusChange = async (id: string, status: Enquiry['status']) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      toast.success('Status updated');
      setItems(p => p.map(i => i._id === id ? { ...i, status } : i));
      if (selected?._id === id) setSelected(prev => prev ? { ...prev, status } : prev);
    } catch (err: any) { toast.error(err.message); }
    finally { setUpdatingId(null); }
  };

  const newCount = items.filter(i => i.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gold-400 font-bold flex items-center gap-3">
            Enquiries
            {newCount > 0 && (
              <span className="inline-flex items-center justify-center h-6 min-w-6 rounded-full bg-amber-500 text-forest-950 text-xs font-bold px-1.5">{newCount}</span>
            )}
          </h1>
          <p className="text-forest-300 mt-1">{total} total enquiry{total !== 1 ? 'ies' : ''} received from the website.</p>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchItems} className="text-forest-400 hover:text-forest-50" title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-500" />
          <input
            type="search"
            placeholder="Search by name, phone, email, room..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={ic + ' pl-9'}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={ic + ' sm:w-44'}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Main content: list + detail */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* List */}
        <div className="flex-1 min-w-0 bg-forest-900/50 border border-forest-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 text-gold-400 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-forest-400">
              <Search className="w-8 h-8 opacity-40" />
              <p>No enquiries found.</p>
            </div>
          ) : (
            <div className="divide-y divide-forest-800">
              {items.map(item => {
                const cfg = STATUS_CONFIG[item.status];
                const isSelected = selected?._id === item._id;
                return (
                  <div
                    key={item._id}
                    className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${isSelected ? 'bg-forest-800/50' : 'hover:bg-forest-800/30'}`}
                    onClick={() => setSelected(isSelected ? null : item)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-forest-50 text-sm">{item.name}</span>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                          <cfg.icon className="w-3 h-3" />{cfg.label}
                        </span>
                        {item.roomName && <span className="text-xs text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full">{item.roomName}</span>}
                      </div>
                      <p className="text-forest-400 text-xs mt-0.5">{item.phone}{item.email ? ` · ${item.email}` : ''}</p>
                      {item.message && <p className="text-forest-500 text-xs mt-1 line-clamp-1">{item.message}</p>}
                      <p className="text-forest-600 text-xs mt-1">{fmt(item.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="sm" variant="ghost" className="text-forest-400 hover:text-gold-400 hover:bg-forest-800 px-2" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); void handleDelete(item._id); }}
                        disabled={deletingId === item._id}
                        className="text-forest-400 hover:text-red-400 hover:bg-red-950/30 px-2" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-full lg:w-96 shrink-0 bg-forest-900/50 border border-forest-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-serif text-gold-400 font-semibold">Enquiry Detail</h2>
              <button onClick={() => setSelected(null)} className="text-forest-400 hover:text-forest-50 p-1 rounded hover:bg-forest-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Name', selected.name],
                ['Phone', selected.phone],
                ['Email', selected.email || '—'],
                ['WhatsApp', selected.whatsapp || selected.phone],
                ['Room', selected.roomName || selected.roomType || '—'],
                ['Source', selected.source || 'website'],
                ['Received', fmt(selected.createdAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-wider text-forest-500 mb-0.5">{label}</p>
                  <p className="text-forest-100 font-medium">{value}</p>
                </div>
              ))}
              {selected.message && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-forest-500 mb-0.5">Message</p>
                  <p className="text-forest-200 leading-relaxed bg-forest-950/50 rounded-lg p-3 text-sm">{selected.message}</p>
                </div>
              )}
            </div>
            <div className="border-t border-forest-800 pt-4 space-y-2">
              <p className="text-xs uppercase tracking-wider text-forest-500 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {(['new', 'contacted', 'closed'] as const).map(s => {
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => void handleStatusChange(selected._id, s)}
                      disabled={updatingId === selected._id || selected.status === s}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all disabled:opacity-50 ${selected.status === s ? cfg.cls + ' font-bold' : 'border-forest-700 text-forest-300 hover:border-forest-600 hover:bg-forest-800'}`}
                    >
                      <cfg.icon className="w-3 h-3" />{cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
