import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { TestimonialModel } from '@/models/Testimonial';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/adminAuth';
import { z } from 'zod';

const TestimonialCreateSchema = z.object({
  reviewerName: z.string().min(1),
  reviewerRole: z.string().min(1),
  reviewerInitials: z.string().max(4).optional(),
  avatarUrl: z.string().url().optional(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1),
  source: z.enum(['direct', 'google', 'booking', 'word-of-mouth']).default('direct'),
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
    const items = await TestimonialModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).limit(limit);
    const total = await TestimonialModel.countDocuments(query);

    return NextResponse.json({ success: true, data: items, meta: { total } });
  } catch (error: any) {
    console.error('[testimonials_get] Error:', error);
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
    const parsed = TestimonialCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    await connectDB();
    const item = await TestimonialModel.create(parsed.data);

    revalidateTag('testimonials', 'max');

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    console.error('[testimonials_post] Error:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
