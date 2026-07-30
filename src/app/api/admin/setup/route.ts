import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AdminUser } from '@/models/AdminUser';
import bcrypt from 'bcryptjs';
import { env } from '@/lib/env';

// This is a one-time setup endpoint to create the initial admin user.
// It will only work if there are no existing admin users in the database.
export async function POST(_req: Request) {
  try {
    await connectDB();

    const count = await AdminUser.countDocuments();
    if (count > 0) {
      return NextResponse.json({ error: 'Setup already completed. Admin users exist.' }, { status: 403 });
    }

    // Default credentials if not provided in ENV
    const email = env?.INITIAL_ADMIN_EMAIL || 'admin@ankitdamess.in';
    const password = env?.INITIAL_ADMIN_PASSWORD || 'Owner@12345!';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const owner = await AdminUser.create({
      email,
      passwordHash,
      role: 'OWNER',
    });

    return NextResponse.json({
      message: 'Initial admin created successfully.',
      email: owner.email,
      role: owner.role,
      note: 'Please change this password immediately after login if using default.',
    });
  } catch (error: any) {
    console.error('[setup] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
