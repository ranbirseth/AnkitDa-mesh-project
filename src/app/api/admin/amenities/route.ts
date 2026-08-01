import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AmenityModel } from '@/models/Amenity';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/adminAuth';
import { z } from 'zod';

const AmenitySchema = z.object({
  name: z.string().min(1),
  iconKey: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['standard', 'premium', 'security', 'lifestyle']),
  sortOrder: z.number().int().nonnegative().default(0),
  active: z.boolean().default(true),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const activeOnly = searchParams.get('active') === 'true';

    await connectDB();

    const query = activeOnly ? { active: true } : {};
    const items = await AmenityModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).limit(limit);
    const total = await AmenityModel.countDocuments(query);

    return NextResponse.json({ success: true, data: items, meta: { total } });
  } catch (error: any) {
    console.error('[amenities_get] Error:', error);
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
    const parsed = AmenitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    await connectDB();
    const item = await AmenityModel.create(parsed.data);

    revalidateTag('amenities', 'max');

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    console.error('[amenities_post] Error:', error);
    return NextResponse.json({ error: 'Failed to create amenity' }, { status: 500 });
  }
}
