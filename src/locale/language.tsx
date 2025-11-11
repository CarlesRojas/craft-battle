import { Order, Sort } from '@/const/sort'
import { BingoDifficulty } from '@/data/bingo'
import { z } from 'zod'

export enum Language {
    EN = 'en',
}
export const DEFAULT_LANGUAGE = Language.EN
export const LANGUAGES = Object.values(Language)
export const LANGUAGE_COOKIE_NAME = 'CRAFT_BATTLE_LANGUAGE'
export const LanguageSchema = z.nativeEnum(Language)

export const LanguageObjectSchema = z.object({
    common: z.object({
        welcomeUser: z.string(),
    }),

    createUsername: z.object({
        welcome: z.string(),
        chooseUsername: z.string(),
    }),

    mode: z.object({
        activeGames: z.string(),
        classicGame: z.string(),
        bingoGame: z.string(),
        battleGame: z.string(),
        continue: z.string(),

        choose: z.string(),
        comingSoon: z.string(),

        classic: z.object({
            title: z.string(),
            description: z.string(),
        }),

        bingo: z.object({
            title: z.string(),
            description: z.string(),
        }),

        battle: z.object({
            title: z.string(),
            description: z.string(),
        }),
    }),

    bingo: z.object({
        findMatch: z.string(),
        findRandomOpponent: z.string(),
        searchFriend: z.string(),
        searchPlaceholder: z.string(),
        searchOpponent: z.string(),
        noResults: z.string(),
        or: z.string(),
        objectives: z.string(),
        you: z.string(),
        opponent: z.string(),

        difficulty: z.object({
            select: z.string(),
            easy: z.string(),
            medium: z.string(),
            hard: z.string(),
        }),

        invite: z.object({
            title: z.string(),
            send: z.string(),
            sent: z.string(),
            content: z.string(),
            accept: z.string(),
            reject: z.string(),
            revoke: z.string(),
        }),

        win: z.object({
            victory: z.string(),
            defeat: z.string(),

            victorySubtitle: z.string(),
            defeatSubtitle: z.string(),

            summary: z.object({
                title: z.string(),
                difficulty: z.string(),
                opponentScore: z.string(),
                yourScore: z.string(),
            }),

            rematch: z.string(),
            backToMenu: z.string(),
        }),
    }),

    game: z.object({
        search: z.string(),
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
        sort: z.object(Object.fromEntries(Object.values(Sort).map(item => [item, z.string()]))),
        order: z.object(Object.fromEntries(Object.values(Order).map(item => [item, z.string()]))),
        difficulty: z.object(Object.fromEntries(Object.values(BingoDifficulty).map(item => [item, z.string()]))),
    }),
})
export type LanguageObject = z.infer<typeof LanguageObjectSchema>
