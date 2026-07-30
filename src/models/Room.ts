import mongoose, { Schema, Document } from 'mongoose';
import { RoomStatus, RoomFeature } from '@/types';

export interface IRoom extends Document {
  slug: string;
  name: string;
  shortDescription: string;
  description?: string;
  priceMonthly: number;
  currency: string;
  status: RoomStatus;
  featured: boolean;
  primaryImage: {
    id: string;
    url: string;
    alt: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
  };
  gallery?: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
  features: Array<RoomFeature>;
  capacityAdults?: number;
  bedType?: string;
  roomSizeSqFt?: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String },
    priceMonthly: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['available', 'filled', 'maintenance'], default: 'available' },
    featured: { type: Boolean, default: false },
    primaryImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
      alt: { type: String, required: true },
      width: { type: Number },
      height: { type: Number },
      blurDataURL: { type: String },
    },
    gallery: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
        alt: { type: String, required: true },
      },
    ],
    features: [
      {
        id: { type: String, required: true },
        iconKey: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    capacityAdults: { type: Number },
    bedType: { type: String },
    roomSizeSqFt: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const RoomModel = (mongoose.models.Room as mongoose.Model<IRoom>) || mongoose.model<IRoom>('Room', RoomSchema);
