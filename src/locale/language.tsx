import { z } from 'zod'

export enum Language {
    EN = 'en',
    ES = 'es',
}
export const DEFAULT_LANGUAGE = Language.EN
export const LANGUAGES = Object.values(Language)
export const LANGUAGE_COOKIE_NAME = 'AMBIBOOK_LANGUAGE'
export const LanguageSchema = z.nativeEnum(Language)

export const LanguageObjectSchema = z.object({
    home: z.object({
        welcome: z.string(),
    }),

    meta: z.object({
        appName: z.string(),
        description: z.string(),
    }),

    form: z.object({
        cancel: z.string(),
        clear: z.string(),
        create: z.string(),
        update: z.string(),
        delete: z.string(),
        save: z.string(),
        edit: z.string(),

        label: z.object({
            username: z.string(),
        }),

        error: z.object({
            generic: z.string(),
            minLength: z.string(),
            maxLength: z.string(),
            required: z.string(),
            invalid: z.string(),
            alphanumeric: z.string(),
            usernameTaken: z.string(),
        }),
    }),

    footer: z.object({
        privacyPolicy: z.string(),
        termsAndConditions: z.string(),
        copyright: z.string(),
    }),

    enum: z.object({
        language: z.object(Object.fromEntries(Object.values(Language).map(item => [item, z.string()]))),
    }),
})
export type LanguageObject = z.infer<typeof LanguageObjectSchema>
