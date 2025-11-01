import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_COOKIE_NAME, LanguageSchema } from '@/locale/language'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, getRequestHeader, setCookie } from '@tanstack/react-start/server'
import acceptLanguage from 'accept-language'

export const getLanguageFromPathname = (pathname: string) => {
    for (const language of LANGUAGES) if (pathname.startsWith(`/${language}`)) return language
    return null
}

export const getLanguage = createServerFn({ method: 'GET' }).handler(() => {
    const cookieLanguage = LanguageSchema.safeParse(getCookie(LANGUAGE_COOKIE_NAME))
    if (cookieLanguage.success) return cookieLanguage.data

    acceptLanguage.languages(LANGUAGES)
    const browserLanguage = LanguageSchema.safeParse(acceptLanguage.get(getRequestHeader('accept-language')))
    if (browserLanguage.success) return browserLanguage.data

    return DEFAULT_LANGUAGE
})

export const setLanguage = createServerFn({ method: 'POST' })
    .inputValidator(LanguageSchema)
    .handler(({ data: language }) => {
        setCookie(LANGUAGE_COOKIE_NAME, language)
    })
