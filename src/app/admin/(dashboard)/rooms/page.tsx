'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Room {
  id: string;
  _id?: string;
  name: string;
  priceMonthly: number;
  status: 'available' | 'filled' | 'maintenance';
  featured: boolean;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/rooms');
      const data = await res.json();
      if (data.success) {
        // normalize _id → id
        const normalized = (data.data || []).map((r: any) => ({ ...r, id: r._id?.toString() || r.id }));
        setRooms(normalized);
      }
    } catch {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRooms();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete room');
      toast.success('Room deleted successfully');
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gold-400 font-bold">Rooms Management</h1>
          <p className="text-forest-300 mt-1">Manage rooms, pricing, and availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={fetchRooms} className="text-forest-400 hover:text-forest-50" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold" asChild>
            <Link href="/admin/rooms/new">
              <Plus className="w-4 h-4 mr-2" /> Add New Room
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-forest-900/50 border border-forest-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto -mx-0">
          <table className="w-full text-left text-sm text-forest-200 min-w-[600px]">
            <thead className="bg-forest-950/50 text-forest-300 uppercase font-medium border-b border-forest-800">
              <tr>
                <th className="px-4 sm:px-6 py-4">Room Name</th>
                <th className="px-4 sm:px-6 py-4">Price / Mo</th>
                <th className="px-4 sm:px-6 py-4">Status</th>
                <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">Featured</th>
                <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-forest-400">
                    Loading rooms...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-forest-400">
                    No rooms found. Add a room to get started.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-forest-800/30 transition-colors">
                    <td className="px-4 sm:px-6 py-4 font-medium text-forest-50">{room.name}</td>
                    <td className="px-4 sm:px-6 py-4">₹{room.priceMonthly.toLocaleString('en-IN')}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge
                        variant={room.status === 'available' ? 'available' : room.status === 'maintenance' ? 'maintenance' : 'filled'}
                      >
                        {room.status}
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      {room.featured ? (
                        <CheckCircle className="w-4 h-4 text-gold-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-forest-600" />
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-forest-300 hover:text-gold-400 hover:bg-forest-800"
                        asChild
                      >
                        <Link href={`/admin/rooms/${room.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-forest-400 hover:text-red-400 hover:bg-red-950/30"
                        onClick={() => handleDelete(room.id, room.name)}
                        disabled={deletingId === room.id}
                        title="Delete room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
