import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Media } from '@/models/Media';
import { cloudinary } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/adminAuth';

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']);

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const folder = searchParams.get('folder');

    await connectDB();

    const query = folder ? { folder } : {};
    const items = await Media.find(query).sort({ createdAt: -1 }).limit(limit);
    const total = await Media.countDocuments(query);

    return NextResponse.json({ success: true, data: items, meta: { total } });
  } catch (error: any) {
    console.error('[media_get] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'ankit-da-mess/general';
    const altText = formData.get('altText') as string | undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    await connectDB();

    const media = await Media.create({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      filename: file.name,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      folder,
      altText: altText || file.name,
    });

    return NextResponse.json({ success: true, data: media });
  } catch (error: any) {
    console.error('[media_post] Error:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}
