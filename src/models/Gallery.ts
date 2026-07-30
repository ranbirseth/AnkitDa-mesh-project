import mongoose, { Schema, Document } from 'mongoose';
import { GalleryCategory } from '@/types';

export interface IGalleryItem extends Document {
  title: string;
  alt: string;
  caption?: string;
  category: Exclude<GalleryCategory, 'all'>;
  image: {
    id: string;
    url: string;
    alt: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
  };
  relatedRoomId?: string;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String },
    category: { type: String, required: true, enum: ['rooms', 'building', 'kitchen', 'terrace', 'bathroom'] },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
      alt: { type: String, required: true },
      width: { type: Number },
      height: { type: Number },
      blurDataURL: { type: String },
    },
    relatedRoomId: { type: String },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const GalleryModel = (mongoose.models.GalleryItem as mongoose.Model<IGalleryItem>) || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);
