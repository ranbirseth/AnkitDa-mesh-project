import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Media } from '@/models/Media';
import { cloudinary } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/adminAuth';
import { GalleryModel } from '@/models/Gallery';
import { RoomModel } from '@/models/Room';

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

    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const [galleryMatch, roomMatch] = await Promise.all([
      GalleryModel.findOne({ 'image.id': media.publicId }).lean(),
      RoomModel.findOne({ $or: [{ 'primaryImage.id': media.publicId }, { 'gallery.id': media.publicId }] }).lean(),
    ]);

    if (galleryMatch || roomMatch) {
      return NextResponse.json({ error: 'Media is still referenced by a room or gallery item' }, { status: 409 });
    }

    if (media.publicId) {
      await cloudinary.uploader.destroy(media.publicId);
    }

    await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('[media_delete] Error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
