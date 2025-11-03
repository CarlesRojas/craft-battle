import { v } from 'convex/values'
import { normalize } from '../src/lib/normalize'
import { mutation } from './_generated/server'

export const create = mutation({
    args: {
        username: v.string(),
        key: v.string(),
    },
    handler: async (ctx, { username, key }) => {
        const existingUser = await ctx.db
            .query('user')
            .withIndex('username', q => q.eq('normalizedUsername', normalize(username)))
            .first()

        if (existingUser && existingUser.key === key) return true
        else if (existingUser) return false

        await ctx.db.insert('user', { username, normalizedUsername: normalize(username), key })
        return true
    },
})
