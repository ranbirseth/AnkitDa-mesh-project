import mongoose, { Schema, Document } from 'mongoose';

export interface IAmenity extends Document {
  name: string;
  iconKey: string;
  description?: string;
  category: 'standard' | 'premium' | 'security' | 'lifestyle';
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AmenitySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    iconKey: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true, enum: ['standard', 'premium', 'security', 'lifestyle'] },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const AmenityModel = (mongoose.models.Amenity as mongoose.Model<IAmenity>) || mongoose.model<IAmenity>('Amenity', AmenitySchema);
