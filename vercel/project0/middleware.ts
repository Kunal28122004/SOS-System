import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/admin'];
const PUBLIC_ROUTES = ['/'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get('guardianangel-session');

  const isProtectedRoute = PROTECTED_ROUTES.some(route => path.startsWith(route));

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);
      if (session.isLoggedIn) {
        // If user is logged in and tries to access public route, redirect to their dashboard
        if (PUBLIC_ROUTES.includes(path)) {
          const redirectTo = session.user.role === 'admin' ? '/admin' : '/dashboard';
          return NextResponse.redirect(new URL(redirectTo, request.url));
        }

        // Role-based route protection
        if (path.startsWith('/admin') && session.user.role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (path.startsWith('/dashboard') && session.user.role !== 'user') {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      } else if (isProtectedRoute) {
         // Logged out but trying to access protected route
         return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
        // Invalid cookie, delete it and redirect to login
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('guardianangel-session');
        return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
