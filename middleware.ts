import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import createIntlMiddleware from 'next-intl/middleware';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'am'],
  defaultLocale: 'en',
  localeDetection: false
});

export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl;
  const pathname = url.pathname;

  const publicPaths = ['/', '/directory', '/feasts'];
  const loginPaths = ['/login', '/admin/login'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isLoginPath = loginPaths.some((path) => pathname.startsWith(path));

  const adminPaths = ['/admin/dashboard'];
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  const churchPaths = ['/dashboard'];
  const isChurchPath = churchPaths.some((path) => pathname.startsWith(path));

  // ✅ Allow everyone to access public and login paths
  if (isPublicPath || isLoginPath) {
    return intlResponse;
  }

  try {
    if (!token) {
      return NextResponse.redirect(new URL(isAdminPath ? '/admin/login' : '/login', request.url));
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);

    if (isAdminPath && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isChurchPath && payload.role !== 'CHURCH') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return intlResponse;
  } catch (error) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0
    });
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt).*)'
  ]
};
