import mongoose, { Schema, Document } from 'mongoose';
import { TestimonialSource } from '@/types';

export interface ITestimonial extends Document {
  reviewerName: string;
  reviewerRole: string;
  reviewerInitials?: string;
  avatarUrl?: string;
  rating: number;
  content: string;
  source?: TestimonialSource;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    reviewerName: { type: String, required: true },
    reviewerRole: { type: String, required: true },
    reviewerInitials: { type: String },
    avatarUrl: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    source: { type: String, enum: ['direct', 'google', 'booking', 'word-of-mouth'], default: 'direct' },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const TestimonialModel = (mongoose.models.Testimonial as mongoose.Model<ITestimonial>) || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
