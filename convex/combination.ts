import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const get = query({
    args: {
        word1: v.string(),
        word2: v.string(),
    },
    handler: async (ctx, { word1, word2 }) => {
        return await ctx.db
            .query('combination')
            .withIndex('words', q => q.eq('word1', word1).eq('word2', word2))
            .first()
    },
})

export const create = mutation({
    args: {
        word1: v.string(),
        word2: v.string(),
        result: v.string(),
        explanation: v.string(),
        icon: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('combination', args)
    },
})
