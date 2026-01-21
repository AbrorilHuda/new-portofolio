import id from './locales/id.json';
import en from './locales/en.json';

export const locales = {
    id,
    en
} as const;

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = 'id';

/**
 * Translation function
 * @param locale - Current locale ('id' or 'en')
 * @param key - Translation key (e.g., 'nav.home')
 * @param params - Optional parameters for string interpolation
 * @returns Translated string
 */
export function t(locale: Locale, key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let value: any = locales[locale];

    for (const k of keys) {
        value = value?.[k];
    }

    if (typeof value !== 'string') {
        console.warn(`Translation key "${key}" not found for locale "${locale}"`);
        return key;
    }

    // Replace parameters like {minutes}, {year}, {heart}, etc.
    if (params) {
        return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
            return params[paramKey] !== undefined ? String(params[paramKey]) : `{${paramKey}}`;
        });
    }

    return value;
}

/**
 * Get all available locales
 */
export function getAvailableLocales(): Locale[] {
    return Object.keys(locales) as Locale[];
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
    return locale in locales;
}
