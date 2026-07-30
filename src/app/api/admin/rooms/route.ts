import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RoomModel } from '@/models/Room';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/adminAuth';
import { z } from 'zod';

const RoomCreateSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().optional(),
  priceMonthly: z.number().positive(),
  currency: z.string().default('INR'),
  status: z.enum(['available', 'filled', 'maintenance']).default('available'),
  featured: z.boolean().default(false),
  primaryImage: z.object({
    id: z.string().min(1),
    url: z.string().url(),
    alt: z.string().min(1),
  }),
  gallery: z.array(z.object({ id: z.string().min(1), url: z.string().url(), alt: z.string().min(1) })).optional(),
  features: z.array(z.object({ id: z.string().min(1), iconKey: z.string().min(1), label: z.string().min(1) })).optional(),
  capacityAdults: z.number().int().positive().optional(),
  bedType: z.string().optional(),
  roomSizeSqFt: z.number().positive().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const featuredOnly = searchParams.get('featured') === 'true';

    await connectDB();

    const query = featuredOnly ? { featured: true } : {};
    const rooms = await RoomModel.find(query).sort({ createdAt: -1 }).limit(limit);
    const total = await RoomModel.countDocuments(query);

    return NextResponse.json({ success: true, data: rooms, meta: { total } });
  } catch (error: any) {
    console.error('[rooms_get] Error:', error);
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
    const parsed = RoomCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    await connectDB();
    const room = await RoomModel.create(parsed.data);

    revalidateTag('rooms');

    return NextResponse.json({ success: true, data: room }, { status: 201 });
  } catch (error: any) {
    console.error('[rooms_post] Error:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
