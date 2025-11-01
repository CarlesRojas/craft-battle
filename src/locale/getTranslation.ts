import { en } from '@/locale/en'
import { es } from '@/locale/es'
import type { LanguageObject } from '@/locale/language'
import { DEFAULT_LANGUAGE, Language } from '@/locale/language'

export const getTranslation = (language: string): LanguageObject => {
    const parsedLanguage: Language = !Object.values(Language).includes(language as Language)
        ? DEFAULT_LANGUAGE
        : (language as Language)

    const languageObject: Record<Language, LanguageObject> = {
        [Language.ES]: es,
        [Language.EN]: en,
    }

    return languageObject[parsedLanguage]
}
