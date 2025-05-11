export type Locale = (typeof locales)[number];

export const locales = ['en', 'am'] as const;
export const defaultLocale: Locale = 'en';