import { v } from 'convex/values'
import { Doc } from './_generated/dataModel'
import { mutation } from './_generated/server'

const DEFAULT_WORDS: Omit<Doc<'word'>, '_id' | '_creationTime' | 'gameId' | 'playerId'>[] = [
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
        const gameId = await ctx.db.insert('game', args)

        await Promise.all(
            DEFAULT_WORDS.map(async word => {
                await ctx.db.insert('word', { ...word, playerId: args.playerId, gameId })
            }),
        )

        return gameId
    },
})

export const get = mutation({
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
