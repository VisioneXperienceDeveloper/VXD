import { vi } from 'vitest';

export const useLocale = vi.fn(() => 'en');
export const useTranslations = vi.fn(() => (key: string) => key);
export const useIntlContext = vi.fn(() => ({ locale: 'en' }));
