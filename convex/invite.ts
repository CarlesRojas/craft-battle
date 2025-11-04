import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getSent = query({
    args: {
        senderId: v.id('user'),
    },
    handler: async (ctx, { senderId }) => {
        const invites = await ctx.db
            .query('invite')
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
            .query('invite')
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('invite', args)
    },
})

export const remove = mutation({
    args: {
        inviteId: v.id('invite'),
    },
    handler: async (ctx, { inviteId }) => {
        return await ctx.db.delete(inviteId)
    },
})

export const accept = mutation({
    args: {
        senderId: v.id('user'),
        receiverId: v.id('user'),
    },
    handler: async (ctx, { senderId, receiverId }) => {
        const senderSentInvites = await ctx.db
            .query('invite')
            .withIndex('sender', q => q.eq('senderId', senderId))
            .collect()

        const senderReceivedInvites = await ctx.db
            .query('invite')
            .withIndex('receiver', q => q.eq('receiverId', senderId))
            .collect()

        await Promise.all([...senderSentInvites, ...senderReceivedInvites].map(invite => ctx.db.delete(invite._id)))

        const recieverSentInvites = await ctx.db
            .query('invite')
            .withIndex('sender', q => q.eq('senderId', receiverId))
            .collect()

        const recieverReceivedInvites = await ctx.db
            .query('invite')
            .withIndex('receiver', q => q.eq('receiverId', receiverId))
            .collect()

        await Promise.all([...recieverSentInvites, ...recieverReceivedInvites].map(invite => ctx.db.delete(invite._id)))
    },
})
