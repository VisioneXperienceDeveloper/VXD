import {getRequestConfig} from 'next-intl/server';
import {headers} from 'next/headers';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Get current pathname from header set in middleware (proxy.ts)
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  // Determine area file to load based on the request path
  let areaFile = '';
  if (pathname.includes('/about')) areaFile = 'about';
  else if (pathname.includes('/projects')) areaFile = 'projects';
  else if (pathname.includes('/contact')) areaFile = 'contact';
  else if (pathname.includes('/privacy') || pathname.includes('/terms')) areaFile = 'legal';
  else if (
    pathname === '/' || 
    pathname === `/${locale}` || 
    pathname === `/${locale}/` || 
    pathname.endsWith(`/${locale}`) ||
    pathname.endsWith(`/${locale}/`)
  ) {
    areaFile = 'home';
  }

  // Load area-specific messages if applicable
  let areaMessages = {};
  if (areaFile) {
    try {
      // Use explicit switch-case for dynamic imports to satisfy Turbopack/Webpack
      // The bundler needs to see static-like strings to resolve the modules correctly.
      switch (areaFile) {
        case 'home':
          areaMessages = (await import(`../../../messages/${locale}/home.json`)).default;
          break;
        case 'about':
          areaMessages = (await import(`../../../messages/${locale}/about.json`)).default;
          break;
        case 'projects':
          areaMessages = (await import(`../../../messages/${locale}/projects.json`)).default;
          break;
        case 'legal':
          areaMessages = (await import(`../../../messages/${locale}/legal.json`)).default;
          break;
        case 'contact':
          areaMessages = (await import(`../../../messages/${locale}/contact.json`)).default;
          break;
      }
    } catch (e) {
      console.warn(`[I18n] Could not load messages for area: ${areaFile}`, e);
    }
  }

  // FALLBACK: If areaFile failed to load or wasn't determined (e.g. build time),
  // load critical messages to prevent MISSING_MESSAGE errors.
  if (Object.keys(areaMessages).length === 0) {
    try {
      const [home, about] = await Promise.all([
        import(`../../../messages/${locale}/home.json`).then(m => m.default).catch(() => ({})),
        import(`../../../messages/${locale}/about.json`).then(m => m.default).catch(() => ({}))
      ]);
      areaMessages = {...home, ...about};
    } catch (e) {
      // Ignore fallback errors
    }
  }

  // Load common messages (Header, Footer, Navigation) - always needed
  const common = (await import(`../../../messages/${locale}/common.json`)).default;

  return {
    locale,
    messages: {
      ...common,
      ...areaMessages
    }
  };
});
