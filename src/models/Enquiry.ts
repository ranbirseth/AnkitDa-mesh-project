import mongoose, { Schema, Document } from 'mongoose';

export type EnquiryStatus = 'new' | 'contacted' | 'closed';

export interface IEnquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  roomType?: string;
  roomId?: string;
  roomName?: string;
  roomSlug?: string;
  message?: string;
  source?: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    roomType: { type: String },
    roomId: { type: String },
    roomName: { type: String },
    roomSlug: { type: String },
    message: { type: String },
    source: { type: String, default: 'website' },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export const EnquiryModel =
  (mongoose.models.Enquiry as mongoose.Model<IEnquiry>) ||
  mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
