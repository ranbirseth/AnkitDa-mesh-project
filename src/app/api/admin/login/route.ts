import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AdminUser } from '@/models/AdminUser';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signJwt } from '@/lib/auth';
import { cookies } from 'next/headers';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // --- TEMPORARY MOCK BYPASS FOR PREVIEW ---
    // If you haven't set up MongoDB yet, this allows you to log in to see the dashboard.
    if (email === 'owner@ankitdamess.in' || email === 'admin@ankitdamess.in') {
      const token = await signJwt({
        userId: 'mock-user-id-123',
        email: email,
        role: 'OWNER',
      });

      const cookieStore = await cookies();
      cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12, // 12 hours
      });

      return NextResponse.json({
        message: 'Logged in successfully (Preview Mode)',
        user: { email: email, role: 'OWNER' },
      });
    }
    // --- END TEMPORARY MOCK BYPASS ---

    await connectDB();

    const user = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return a generic error to prevent email enumeration
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await signJwt({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return NextResponse.json({
      message: 'Logged in successfully',
      user: { email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error('[login] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
