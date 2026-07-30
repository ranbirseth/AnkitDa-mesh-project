import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  publicId: string;
  filename: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder: string;
  altText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    filename: { type: String, required: true },
    format: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    bytes: { type: Number, required: true },
    folder: { type: String, required: true, default: 'ankit-da-mess/general' },
    altText: { type: String },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in development
export const Media = (mongoose.models.Media as mongoose.Model<IMedia>) || mongoose.model<IMedia>('Media', MediaSchema);
