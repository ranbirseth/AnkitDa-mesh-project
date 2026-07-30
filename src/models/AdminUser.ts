import mongoose, { Schema, Document } from 'mongoose';

export type AdminRole = 'OWNER' | 'EDITOR';

export interface IAdminUser extends Document {
  email: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['OWNER', 'EDITOR'], default: 'EDITOR' },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in development
export const AdminUser = (mongoose.models.AdminUser as mongoose.Model<IAdminUser>) || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
