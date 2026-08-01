import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { TestimonialModel } from '@/models/Testimonial';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/adminAuth';
import { z } from 'zod';

const TestimonialUpdateSchema = z.object({
  reviewerName: z.string().min(1).optional(),
  reviewerRole: z.string().min(1).optional(),
  reviewerInitials: z.string().max(4).optional(),
  avatarUrl: z.string().url().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  content: z.string().min(1).optional(),
  source: z.enum(['direct', 'google', 'booking', 'word-of-mouth']).optional(),
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
    const parsed = TestimonialUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    await connectDB();

    const item = await TestimonialModel.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!item) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    revalidateTag('testimonials', 'max');

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error('[testimonials_put] Error:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
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

    const item = await TestimonialModel.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    revalidateTag('testimonials', 'max');

    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    console.error('[testimonials_delete] Error:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
