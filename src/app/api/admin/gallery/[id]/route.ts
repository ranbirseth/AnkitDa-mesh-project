import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { GalleryModel } from '@/models/Gallery';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/adminAuth';
import { z } from 'zod';

const GalleryUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  alt: z.string().min(1).optional(),
  caption: z.string().optional(),
  category: z.enum(['rooms', 'building', 'kitchen', 'terrace', 'bathroom']).optional(),
  image: z.object({
    id: z.string().min(1),
    url: z.string().url(),
    alt: z.string().min(1),
  }).optional(),
  relatedRoomId: z.string().optional(),
  featured: z.boolean().optional(),
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
    const parsed = GalleryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    await connectDB();

    const item = await GalleryModel.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    revalidateTag('gallery', 'max');

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error('[gallery_put] Error:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
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

    const item = await GalleryModel.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    revalidateTag('gallery', 'max');

    return NextResponse.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error: any) {
    console.error('[gallery_delete] Error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
