import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const search = mutation({
    args: {
        userId: v.id('user'),
        difficulty: v.union(v.literal('EASY'), v.literal('MEDIUM'), v.literal('HARD')),
    },
    handler: async (ctx, { userId, difficulty }) => {
        const result = await ctx.db
            .query('searchingOpponent')
            .withIndex('difficulty', q => q.eq('difficulty', difficulty))
            .first()

        if (result) {
            await ctx.db.delete(result._id)
            return result
        } else await ctx.db.insert('searchingOpponent', { userId, difficulty })

        return null
    },
})

export const isSearching = query({
    args: {
        userId: v.id('user'),
    },
    handler: async (ctx, { userId }) => {
        const result = await ctx.db
            .query('searchingOpponent')
            .withIndex('user', q => q.eq('userId', userId))
            .first()

        return !result ? null : result.difficulty
    },
})

export const cancel = mutation({
    args: {
        userId: v.id('user'),
    },
    handler: async (ctx, { userId }) => {
        const result = await ctx.db
            .query('searchingOpponent')
            .withIndex('user', q => q.eq('userId', userId))
            .collect()

        await Promise.all(result.map(async item => await ctx.db.delete(item._id)))
    },
})
