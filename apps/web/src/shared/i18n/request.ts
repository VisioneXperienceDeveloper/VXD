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

  // Get current pathname from header set in middleware
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  // Determine area file to load
  let areaFile = '';
  if (pathname.includes('/about')) areaFile = 'about';
  else if (pathname.includes('/projects')) areaFile = 'projects';
  else if (pathname.includes('/contact')) areaFile = 'contact';
  else if (pathname.includes('/privacy') || pathname.includes('/terms')) areaFile = 'legal';
  // Homepage detection (matches /, /ko, /en, /ko/, /en/)
  else if (
    pathname === '/' || 
    pathname === `/${locale}` || 
    pathname === `/${locale}/` || 
    pathname.endsWith(`/${locale}`) ||
    pathname.endsWith(`/${locale}/`)
  ) {
    areaFile = 'home';
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[I18n] Locale: ${locale}, Path: ${pathname}, Area: ${areaFile || 'none'}`);
  }

  // Load common messages (Header, Footer, etc.)
  const common = (await import(`../../../messages/${locale}/common.json`)).default;

  // Load area-specific messages if applicable
  let areaMessages = {};
  if (areaFile) {
    try {
      areaMessages = (await import(`../../../messages/${locale}/${areaFile}.json`)).default;
    } catch (e) {
      console.warn(`Could not load messages for area: ${areaFile}`, e);
    }
  } 
  
  // FALLBACK: If areaFile couldn't be determined (e.g. middleware header missing),
  // load all major areas to prevent MISSING_MESSAGE errors in metadata/build.
  if (!areaFile || Object.keys(areaMessages).length === 0) {
    try {
      const [home, about, projects, legal, contact] = await Promise.all([
        import(`../../../messages/${locale}/home.json`).then(m => m.default).catch(() => ({})),
        import(`../../../messages/${locale}/about.json`).then(m => m.default).catch(() => ({})),
        import(`../../../messages/${locale}/projects.json`).then(m => m.default).catch(() => ({})),
        import(`../../../messages/${locale}/legal.json`).then(m => m.default).catch(() => ({})),
        import(`../../../messages/${locale}/contact.json`).then(m => m.default).catch(() => ({}))
      ]);
      areaMessages = {...home, ...about, ...projects, ...legal, ...contact};
    } catch (e) {
      console.error("Critical: Failed to load fallback messages", e);
    }
  }

  return {
    locale,
    messages: {
      ...common,
      ...areaMessages
    }
  };
});
