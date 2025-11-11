import { v } from 'convex/values'
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
            .query('classic')
            .withIndex('player', q => q.eq('playerId', args.playerId))
            .first()

        if (existingGame) {
            const existingGameWords = await ctx.db
                .query('word')
                .withIndex('player', q => q.eq('gameId', existingGame._id).eq('playerId', args.playerId))
                .collect()

            const existingGameWordInstances = (
                await Promise.all(
                    existingGameWords.map(async word =>
                        ctx.db
                            .query('instance')
                            .withIndex('word', q => q.eq('wordId', word._id))
                            .collect(),
                    ),
                )
            ).flat()

            await Promise.all(existingGameWordInstances.map(async instance => await ctx.db.delete(instance._id)))

            await Promise.all(existingGameWords.map(async word => await ctx.db.delete(word._id)))

            await ctx.db.delete(existingGame._id)
        }

        const gameId = await ctx.db.insert('classic', args)

        await Promise.all(
            DEFAULT_WORDS.map(async word => await ctx.db.insert('word', { ...word, playerId: args.playerId, gameId })),
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
            .query('classic')
            .withIndex('player', q => q.eq('playerId', args.playerId))
            .first()

        if (!game) return null

        const words = await ctx.db
            .query('word')
            .withIndex('player', q => q.eq('gameId', game._id).eq('playerId', args.playerId))
            .collect()

        const instances = await Promise.all(
            words.map(async ({ _id, ...word }) =>
                (
                    await ctx.db
                        .query('instance')
                        .withIndex('word', q => q.eq('wordId', _id))
                        .collect()
                ).map(instance => ({ ...word, ...instance })),
            ),
        )

        return { game, words, instances: instances.flat(), opponent: null }
    },
})
