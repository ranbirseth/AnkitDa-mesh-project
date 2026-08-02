import { notFound } from 'next/navigation';
import type { Room } from '@/types';
import { RoomDetailClient } from './RoomDetailClient';

async function getRoomBySlug(slug: string): Promise<Room | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/rooms?slug=${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success || !data.data) return null;
    const r = data.data;
    return { ...r, id: r._id?.toString() || r.id };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return { title: 'Room Not Found — Ankit Da Mess' };
  return {
    title: `${room.name} — Ankit Da Mess`,
    description: room.shortDescription,
    openGraph: {
      title: `${room.name} — Ankit Da Mess`,
      description: room.shortDescription,
      images: room.primaryImage?.url ? [room.primaryImage.url] : [],
    },
  };
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) notFound();
  return <RoomDetailClient room={room} />;
}
