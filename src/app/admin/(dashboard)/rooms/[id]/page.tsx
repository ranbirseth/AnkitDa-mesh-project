import { notFound } from 'next/navigation';
import RoomForm from '../RoomForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getRoomById(id: string) {
  try {
    // Fetch from the admin rooms API — runs server-side
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/admin/rooms`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rooms = data.data || [];
    // Find by _id or id
    return rooms.find((r: any) => r._id?.toString() === id || r.id === id) || null;
  } catch {
    return null;
  }
}

export default async function EditRoomPage({ params }: PageProps) {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) {
    notFound();
  }

  // Normalize _id → id for the form
  const initialData = {
    ...room,
    id: room._id?.toString() || room.id,
    primaryImage: room.primaryImage || { id: '', url: '', alt: '' },
    features: room.features || [],
    gallery: room.gallery || [],
  };

  return <RoomForm initialData={initialData} roomId={id} />;
}
