import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnquiryModel } from '@/models/Enquiry';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    await connectDB();

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { roomName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      EnquiryModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      EnquiryModel.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, data: items, meta: { total, page, limit } });
  } catch (err: any) {
    console.error('[enquiries_get]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
