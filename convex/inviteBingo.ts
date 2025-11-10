import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getSent = query({
    args: {
        senderId: v.id('user'),
    },
    handler: async (ctx, { senderId }) => {
        const invites = await ctx.db
            .query('inviteBingo')
            .withIndex('sender', q => q.eq('senderId', senderId))
            .collect()

        return Promise.all(
            invites.map(async invite => ({
                ...invite,
                receiver: await ctx.db.get(invite.receiverId),
                sender: await ctx.db.get(invite.senderId),
            })),
        )
    },
})

export const getReceived = query({
    args: {
        receiverId: v.id('user'),
    },
    handler: async (ctx, { receiverId }) => {
        const invites = await ctx.db
            .query('inviteBingo')
            .withIndex('receiver', q => q.eq('receiverId', receiverId))
            .collect()

        return Promise.all(
            invites.map(async invite => ({
                ...invite,
                receiver: await ctx.db.get(invite.receiverId),
                sender: await ctx.db.get(invite.senderId),
            })),
        )
    },
})

export const create = mutation({
    args: {
        senderId: v.id('user'),
        receiverId: v.id('user'),
        difficulty: v.union(v.literal('EASY'), v.literal('MEDIUM'), v.literal('HARD')),
    },
    handler: async (ctx, args) => {
        const existingInvites = await ctx.db
            .query('inviteBingo')
            .withIndex('users', q => q.eq('senderId', args.senderId).eq('receiverId', args.receiverId))
            .collect()
        if (existingInvites.length > 0) await Promise.all(existingInvites.map(invite => ctx.db.delete(invite._id)))

        const reverseInvites = await ctx.db
            .query('inviteBingo')
            .withIndex('users', q => q.eq('senderId', args.receiverId).eq('receiverId', args.senderId))
            .collect()
        if (reverseInvites.length > 0) await Promise.all(reverseInvites.map(invite => ctx.db.delete(invite._id)))

        return await ctx.db.insert('inviteBingo', args)
    },
})

export const remove = mutation({
    args: {
        inviteId: v.id('inviteBingo'),
    },
    handler: async (ctx, { inviteId }) => {
        return await ctx.db.delete(inviteId)
    },
})

export const deleteFromPlayer = mutation({
    args: {
        playerId: v.id('user'),
    },
    handler: async (ctx, { playerId }) => {
        const senderSentInvites = await ctx.db
            .query('inviteBingo')
            .withIndex('sender', q => q.eq('senderId', playerId))
            .collect()

        const senderReceivedInvites = await ctx.db
            .query('inviteBingo')
            .withIndex('receiver', q => q.eq('receiverId', playerId))
            .collect()

        await Promise.all([...senderSentInvites, ...senderReceivedInvites].map(invite => ctx.db.delete(invite._id)))
    },
})
