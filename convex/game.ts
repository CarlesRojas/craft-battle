import { v } from 'convex/values'
import { normalize } from '../src/lib/normalize'
import type { Doc } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

const DEFAULT_WORDS: Array<Omit<Doc<'word'>, '_id' | '_creationTime' | 'gameId' | 'playerId'>> = [
    { text: 'water', icon: '💧' },
    { text: 'fire', icon: '🔥' },
    { text: 'wind', icon: '💨' },
    { text: 'earth', icon: '🌍' },
]

export const create = mutation({
    args: {
        playerId: v.id('user'),
    },
    handler: async (ctx, args) => {
        const existingGame = await ctx.db
            .query('game')
            .withIndex('player', q => q.eq('playerId', args.playerId))
            .first()
        if (existingGame) await ctx.db.delete(existingGame._id)

        const gameId = await ctx.db.insert('game', args)

        await Promise.all(
            DEFAULT_WORDS.map(async word => {
                await ctx.db.insert('word', { ...word, playerId: args.playerId, gameId })
            }),
        )

        return gameId
    },
})

export const get = query({
    args: {
        playerId: v.id('user'),
    },
    handler: async (ctx, args) => {
        const game = await ctx.db
            .query('game')
            .withIndex('player', q => q.eq('playerId', args.playerId))
            .first()

        if (!game) return null

        const words = await ctx.db
            .query('word')
            .withIndex('player', q => q.eq('gameId', game._id).eq('playerId', args.playerId))
            .collect()

        return { game, words }
    },
})

export const addWord = mutation({
    args: {
        playerId: v.id('user'),
        gameId: v.id('game'),
        text: v.string(),
        icon: v.string(),
        explanation: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const normalizedText = normalize(args.text, true)

        const words = await ctx.db
            .query('word')
            .withIndex('word', q => q.eq('text', normalizedText))
            .collect()

        if (words.length > 0) return words[0]._id

        const wordId = await ctx.db.insert('word', { ...args, text: normalizedText })
        return wordId
    },
})

export type CreateWord = Omit<Doc<'word'>, '_id' | '_creationTime' | 'gameId' | 'playerId'>
