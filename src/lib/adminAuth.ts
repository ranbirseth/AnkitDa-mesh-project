import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AdminUser } from '@/models/AdminUser';

export type AdminAuthResult =
  | { ok: true; admin: { id: string; email: string; role: 'OWNER' | 'EDITOR' } }
  | { ok: false; response: NextResponse };

export async function requireAdmin(req: Request, options?: { ownerOnly?: boolean }): Promise<AdminAuthResult> {
  const userId = req.headers.get('x-admin-user-id');
  const role = req.headers.get('x-admin-role');

  if (!userId || !role) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  try {
    await connectDB();
    const admin = await AdminUser.findById(userId).lean();

    if (!admin) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      };
    }

    const normalizedRole = admin.role === 'OWNER' || admin.role === 'EDITOR' ? admin.role : 'EDITOR';
    if (options?.ownerOnly && normalizedRole !== 'OWNER') {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      };
    }

    return {
      ok: true,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        role: normalizedRole,
      },
    };
  } catch (error) {
    console.error('[adminAuth] Error:', error);
    return {
      ok: false,
      response: NextResponse.json({ error: 'Internal server error' }, { status: 500 }),
    };
  }
}
