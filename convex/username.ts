import { v } from 'convex/values'
import { normalize } from '../src/lib/normalize'
import type { Doc } from './_generated/dataModel'
import { internalMutation, mutation, query } from './_generated/server'

const parseUser = (user: Doc<'user'> | null) => {
    if (!user) return null
    const { key, ...userWithoutKey } = user
    return userWithoutKey
}

export const registerPresence = mutation({
    args: {
        userId: v.id('user'),
    },
    handler: async (ctx, { userId }) => {
        await ctx.db.patch(userId, { lastLogin: Date.now() })
    },
})

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

        const newUserId = await ctx.db.insert('user', {
            username,
            normalizedUsername: normalizedUsername,
            key,
            lastLogin: Date.now(),
        })
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

        return result
            .filter(user => user._id !== excludeId)
            .map(({ key, ...user }) => user)
            .slice(0, 3)
    },
})

export const clear = internalMutation({
    args: {},
    handler: async ctx => {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

        const oldUsers = await ctx.db
            .query('user')
            .withIndex('lastLogin', q => q.lt('lastLogin', thirtyDaysAgo))
            .collect()

        for (const user of oldUsers) {
            const classicGames = await ctx.db
                .query('classic')
                .withIndex('player', q => q.eq('playerId', user._id))
                .collect()

            const bingoPlayer1Games = await ctx.db
                .query('bingo')
                .withIndex('player1', q => q.eq('player1Id', user._id))
                .collect()

            const bingoPlayer2Games = await ctx.db
                .query('bingo')
                .withIndex('player2', q => q.eq('player2Id', user._id))
                .collect()

            const senderInviteGames = await ctx.db
                .query('inviteBingo')
                .withIndex('sender', q => q.eq('senderId', user._id))
                .collect()

            const receiverInviteGames = await ctx.db
                .query('inviteBingo')
                .withIndex('receiver', q => q.eq('receiverId', user._id))
                .collect()

            const searching = await ctx.db
                .query('searchingOpponent')
                .withIndex('user', q => q.eq('userId', user._id))
                .collect()

            const bingoObjectives = (
                await Promise.all(
                    [...bingoPlayer1Games, ...bingoPlayer2Games].map(
                        async game =>
                            await ctx.db
                                .query('objective')
                                .withIndex('game', q => q.eq('gameId', game._id))
                                .collect(),
                    ),
                )
            ).flat()

            const words = (
                await Promise.all(
                    [...classicGames, ...bingoPlayer1Games, ...bingoPlayer2Games].map(
                        async game =>
                            await ctx.db
                                .query('word')
                                .withIndex('game', q => q.eq('gameId', game._id))
                                .collect(),
                    ),
                )
            ).flat()

            const instances = (
                await Promise.all(
                    words.map(
                        async word =>
                            await ctx.db
                                .query('instance')
                                .withIndex('word', q => q.eq('wordId', word._id))
                                .collect(),
                    ),
                )
            ).flat()

            await Promise.all(
                [
                    user,
                    ...classicGames,
                    ...bingoPlayer1Games,
                    ...bingoPlayer2Games,
                    ...senderInviteGames,
                    ...receiverInviteGames,
                    ...searching,
                    ...bingoObjectives,
                    ...words,
                    ...instances,
                ].map(async elem => await ctx.db.delete(elem._id)),
            )
        }
    },
})

export type User = Omit<Doc<'user'>, 'key'>
