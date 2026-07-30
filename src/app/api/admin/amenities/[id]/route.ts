import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AmenityModel } from '@/models/Amenity';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/adminAuth';
import { z } from 'zod';

const AmenityUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  iconKey: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.enum(['standard', 'premium', 'security', 'lifestyle']).optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = AmenityUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    await connectDB();

    const item = await AmenityModel.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!item) {
      return NextResponse.json({ error: 'Amenity not found' }, { status: 404 });
    }

    revalidateTag('amenities');

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error('[amenities_put] Error:', error);
    return NextResponse.json({ error: 'Failed to update amenity' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req, { ownerOnly: true });
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await params;

    await connectDB();

    const item = await AmenityModel.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ error: 'Amenity not found' }, { status: 404 });
    }

    revalidateTag('amenities');

    return NextResponse.json({ success: true, message: 'Amenity deleted successfully' });
  } catch (error: any) {
    console.error('[amenities_delete] Error:', error);
    return NextResponse.json({ error: 'Failed to delete amenity' }, { status: 500 });
  }
}
