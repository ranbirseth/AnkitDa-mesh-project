import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RoomModel } from '@/models/Room';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    await connectDB();

    if (slug) {
      const room = await RoomModel.findOne({ slug });
      if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: room });
    }

    const rooms = await RoomModel.find({}).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ success: true, data: rooms });
  } catch (err: any) {
    console.error('[public_rooms]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
