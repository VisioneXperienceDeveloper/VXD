import createMiddleware from 'next-intl/middleware';
import {routing} from './shared/i18n/routing';
import {NextRequest} from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // Add the current pathname to request headers so getRequestConfig can access it.
  const pathname = request.nextUrl.pathname;
  request.headers.set('x-pathname', pathname);
  
  // Debug log to trace path detection
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Proxy] Path: ${pathname}`);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ko|en)/:path*']
};
