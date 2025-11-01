import { Language } from '@/locale/language'

export const getPathnameWithoutLanguage = (pathname: string): string => {
    const languages = Object.values(Language)
    let parsedPathname = pathname

    for (const language of languages) {
        if (pathname.startsWith(`/${language}`)) {
            parsedPathname = pathname.replace(`/${language}`, '')
            break
        }
    }

    return parsedPathname || '/'
}
