import { v } from 'convex/values'
import { normalize } from '../src/lib/normalize'
import type { Doc } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

const parseUser = (user: Doc<'user'> | null) => {
    if (!user) return null
    const { key, ...userWithoutKey } = user
    return userWithoutKey
}

export const isTaken = query({
    args: {
        username: v.string(),
    },
    handler: async (ctx, { username }) => {
        const normalizedUsername = normalize(username)
        const existingUser = await ctx.db
            .query('user')
            .withIndex('username', q => q.eq('normalizedUsername', normalizedUsername))
            .first()

        return !!existingUser
    },
})

export const create = mutation({
    args: {
        username: v.string(),
        key: v.string(),
    },
    handler: async (ctx, { username, key }) => {
        const normalizedUsername = normalize(username)
        const existingUser = await ctx.db
            .query('user')
            .withIndex('username', q => q.eq('normalizedUsername', normalizedUsername))
            .first()

        if (existingUser && existingUser.key === key) return parseUser(existingUser)
        else if (existingUser) return null

        const newUserId = await ctx.db.insert('user', { username, normalizedUsername: normalizedUsername, key })
        return parseUser(await ctx.db.get(newUserId))
    },
})

export const search = mutation({
    args: { searchQuery: v.string(), excludeId: v.id('user') },
    handler: async (ctx, { searchQuery, excludeId }) => {
        const result = await ctx.db
            .query('user')
            .withSearchIndex('user', q => q.search('normalizedUsername', normalize(searchQuery)))
            .take(4)

        // TODO only look for users not currently in a game

        return result
            .filter(user => user._id !== excludeId)
            .map(({ key, ...user }) => user)
            .slice(0, 3)
    },
})

export type User = Omit<Doc<'user'>, 'key'>
