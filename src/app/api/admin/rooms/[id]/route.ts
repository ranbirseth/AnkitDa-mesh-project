import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RoomModel } from '@/models/Room';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/adminAuth';
import { z } from 'zod';

const RoomUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  shortDescription: z.string().min(1).optional(),
  description: z.string().optional(),
  priceMonthly: z.number().positive().optional(),
  currency: z.string().optional(),
  status: z.enum(['available', 'filled', 'maintenance']).optional(),
  featured: z.boolean().optional(),
  primaryImage: z.object({
    id: z.string().min(1),
    url: z.string().url(),
    alt: z.string().min(1),
  }).optional(),
  gallery: z.array(z.object({ id: z.string().min(1), url: z.string().url(), alt: z.string().min(1) })).optional(),
  features: z.array(z.object({ id: z.string().min(1), iconKey: z.string().min(1), label: z.string().min(1) })).optional(),
  capacityAdults: z.number().int().positive().optional(),
  bedType: z.string().optional(),
  roomSizeSqFt: z.number().positive().optional(),
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
    const parsed = RoomUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    await connectDB();

    const room = await RoomModel.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    revalidateTag('rooms', 'max');

    return NextResponse.json({ success: true, data: room });
  } catch (error: any) {
    console.error('[rooms_put] Error:', error);
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
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

    const room = await RoomModel.findByIdAndDelete(id);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    revalidateTag('rooms', 'max');

    return NextResponse.json({ success: true, message: 'Room deleted successfully' });
  } catch (error: any) {
    console.error('[rooms_delete] Error:', error);
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}
