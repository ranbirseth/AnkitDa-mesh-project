import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnquiryModel } from '@/models/Enquiry';
import { requireAdmin } from '@/lib/adminAuth';
import { z } from 'zod';

const UpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']).optional(),
  adminNotes: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    await connectDB();
    const item = await EnquiryModel.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    console.error('[enquiry_patch]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req, { ownerOnly: true });
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    await connectDB();
    const item = await EnquiryModel.findByIdAndDelete(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[enquiry_delete]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
