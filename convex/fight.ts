import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const get = query({
    args: {
        attackWord: v.string(),
        defenseWord: v.string(),
    },
    handler: async (ctx, { attackWord, defenseWord }) => {
        return await ctx.db
            .query('fight')
            .withIndex('words', q => q.eq('attackWord', attackWord).eq('defenseWord', defenseWord))
            .first()
    },
})

export const create = mutation({
    args: {
        attackWord: v.string(),
        defenseWord: v.string(),
        damageDealt: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('fight', args)
    },
})
