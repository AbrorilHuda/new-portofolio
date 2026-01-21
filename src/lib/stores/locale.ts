import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { defaultLocale, isValidLocale, type Locale } from '$lib/i18n';

const LOCALE_STORAGE_KEY = 'preferred-locale';
function getInitialLocale(): Locale {
    if (!browser) return defaultLocale;
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isValidLocale(stored)) {
        return stored;
    }

    const browserLang = navigator.language.split('-')[0];
    if (isValidLocale(browserLang)) {
        return browserLang;
    }

    return defaultLocale;
}


function createLocaleStore() {
    const { subscribe, set } = writable<Locale>(getInitialLocale());

    return {
        subscribe,
        set: (value: Locale) => {
            if (browser) {
                localStorage.setItem(LOCALE_STORAGE_KEY, value);
            }
            set(value);
        },
        toggle: () => {
            const current = browser ? localStorage.getItem(LOCALE_STORAGE_KEY) as Locale || defaultLocale : defaultLocale;
            const newLocale: Locale = current === 'id' ? 'en' : 'id';
            if (browser) {
                localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
            }
            set(newLocale);
        }
    };
}

export const locale = createLocaleStore();
