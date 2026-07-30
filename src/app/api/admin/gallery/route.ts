import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { GalleryModel } from '@/models/Gallery';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/adminAuth';
import { z } from 'zod';

const GalleryCreateSchema = z.object({
  title: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
  category: z.enum(['rooms', 'building', 'kitchen', 'terrace', 'bathroom']),
  image: z.object({
    id: z.string().min(1),
    url: z.string().url(),
    alt: z.string().min(1),
  }),
  relatedRoomId: z.string().optional(),
  featured: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const category = searchParams.get('category');

    await connectDB();

    const query: any = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const items = await GalleryModel.find(query).sort({ createdAt: -1 }).limit(limit);
    const total = await GalleryModel.countDocuments(query);

    return NextResponse.json({ success: true, data: items, meta: { total } });
  } catch (error: any) {
    console.error('[gallery_get] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json();
    const parsed = GalleryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    await connectDB();
    const item = await GalleryModel.create(parsed.data);

    revalidateTag('gallery');

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    console.error('[gallery_post] Error:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}
