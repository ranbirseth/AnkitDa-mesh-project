import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose/jwt/verify';

// Define the paths that don't require authentication
const PUBLIC_API_ROUTES = ['/api/admin/login', '/api/admin/setup'];
const PUBLIC_PAGES = ['/admin/login'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run middleware on /admin and /api/admin routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_API_ROUTES.includes(pathname) || PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for the admin_token cookie
  const token = req.cookies.get('admin_token')?.value;

  if (!token) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    // We must read the secret here because this is Edge Runtime
    const secret = process.env.JWT_SECRET;
    const secretKey = secret ? new TextEncoder().encode(secret) : new TextEncoder().encode('fallback-dev-secret-key-do-not-use-in-prod');
    
    const { payload } = await jwtVerify(token, secretKey);

    // Pass the user context in headers for API routes
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-admin-user-id', payload.userId as string);
    requestHeaders.set('x-admin-role', payload.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Token is invalid or expired
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Delete the invalid cookie and redirect
    const response = NextResponse.redirect(new URL('/admin/login', req.url));
    response.cookies.delete('admin_token');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
