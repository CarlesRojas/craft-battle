import { en } from '@/locale/en'
import type { LanguageObject } from '@/locale/language'
import { DEFAULT_LANGUAGE, Language } from '@/locale/language'

export const getTranslation = (language: string): LanguageObject => {
    const parsedLanguage: Language = !Object.values(Language).includes(language as Language)
        ? DEFAULT_LANGUAGE
        : (language as Language)

    const languageObject: Record<Language, LanguageObject> = {
        [Language.EN]: en,
    }

    return languageObject[parsedLanguage]
}
