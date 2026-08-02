import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SiteSettingsModel } from '@/models/SiteSettings';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/adminAuth';

const allowedTypes = ['hero', 'cta', 'footer', 'location', 'contact', 'virtual-tour', 'why-choose-us', 'settings', 'social-media'];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid settings type' }, { status: 400 });
    }

    await connectDB();
    const settings = await SiteSettingsModel.findOne({ type });

    if (!settings) {
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({ success: true, data: settings.data });
  } catch (error: any) {
    console.error('[settings_get] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const auth = await requireAdmin(req, { ownerOnly: true });
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { type } = await params;

    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid settings type' }, { status: 400 });
    }

    const body = await req.json();

    await connectDB();

    const settings = await SiteSettingsModel.findOneAndUpdate(
      { type },
      { data: body },
      { new: true, upsert: true }
    );

    revalidateTag(type, 'max');
    revalidateTag('settings', 'max');

    return NextResponse.json({ success: true, data: settings.data });
  } catch (error: any) {
    console.error('[settings_put] Error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
