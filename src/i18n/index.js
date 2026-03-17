import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { translations } from './translations'

const resources = {
    de: { translation: translations.de },
    en: { translation: translations.en },
}

const normalizeLanguage = (value) => {
    if (value === 'de' || value === 'en') return value
    if (value === 'Deutsch') return 'de'
    if (value === 'English') return 'en'
    return null
}

const getInitialLanguage = () => {
    try {
        const stored = localStorage.getItem('userData')
        const parsed = stored ? JSON.parse(stored) : null
        const fromSettings = normalizeLanguage(parsed?.settings?.language)
        if (fromSettings) return fromSettings
    } catch {
        // Ignore storage errors and use default
    }

    return 'de'
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getInitialLanguage(),
        fallbackLng: 'en',
        supportedLngs: ['en', 'de'],
        nonExplicitSupportedLngs: true,
        returnEmptyString: false,
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
