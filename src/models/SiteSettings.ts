import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  type: 'hero' | 'cta' | 'footer' | 'location' | 'contact' | 'virtual-tour' | 'why-choose-us';
  data: any; // Flexible schema for singletons
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    type: { 
      type: String, 
      required: true, 
      unique: true, 
      enum: ['hero', 'cta', 'footer', 'location', 'contact', 'virtual-tour', 'why-choose-us'] 
    },
    data: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    minimize: false, // Prevent mongoose from removing empty objects
  }
);

export const SiteSettingsModel = (mongoose.models.SiteSettings as mongoose.Model<ISiteSettings>) || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
