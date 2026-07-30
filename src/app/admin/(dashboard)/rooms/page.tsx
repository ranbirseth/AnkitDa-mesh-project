import { roomsService } from '@/services';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function AdminRoomsPage() {
  const result = await roomsService.getRooms(false, 100);
  const rooms = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gold-400 font-bold">Rooms Management</h1>
          <p className="text-forest-300 mt-1">Manage rooms, pricing, and availability.</p>
        </div>
        <Button className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold" asChild>
          <Link href="/admin/rooms/new">
            <Plus className="w-4 h-4 mr-2" /> Add New Room
          </Link>
        </Button>
      </div>

      <div className="bg-forest-900/50 border border-forest-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-forest-200">
            <thead className="bg-forest-950/50 text-forest-300 uppercase font-medium border-b border-forest-800">
              <tr>
                <th className="px-6 py-4">Room Name</th>
                <th className="px-6 py-4">Price / Mo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800">
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-forest-400">
                    No rooms found. Add a room to get started.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-forest-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-forest-50">{room.name}</td>
                    <td className="px-6 py-4">₹{room.priceMonthly.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={room.status === 'available' ? 'available' : room.status === 'maintenance' ? 'maintenance' : 'filled'}
                      >
                        {room.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {room.featured ? <CheckCircle className="w-4 h-4 text-gold-400" /> : <XCircle className="w-4 h-4 text-forest-600" />}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" className="text-forest-300 hover:text-gold-400 hover:bg-forest-800" asChild>
                        <Link href={`/admin/rooms/${room.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-forest-400 hover:text-red-400 hover:bg-red-950/30">
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
