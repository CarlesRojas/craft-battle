import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import { mutation } from './_generated/server'

export const add = mutation({
    args: {
        wordId: v.id('word'),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),

        icon: v.string(),
        playerId: v.id('user'),
        text: v.string(),
        gameId: v.union(v.id('game'), v.id('bingoGame')),
        _creationTime: v.number(),
    },
    handler: async (ctx, { wordId, x, y, width, height }) => {
        const word = await ctx.db.get(wordId)
        if (!word) return

        const instanceId = await ctx.db.insert('instance', { wordId, x, y, width, height })
    },
})

export const remove = mutation({
    args: {
        instanceId: v.id('instance'),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.instanceId)
    },
})

export const removeAll = mutation({
    args: {
        instances: v.array(v.id('instance')),
    },
    handler: async (ctx, args) => {
        await Promise.all(args.instances.map(async id => await ctx.db.delete(id)))
    },
})

export const replaceAll = mutation({
    args: {
        instances: v.array(
            v.object({
                _id: v.id('instance'),
                x: v.number(),
                y: v.number(),
                width: v.number(),
                height: v.number(),

                wordId: v.id('word'),
                icon: v.string(),
                playerId: v.id('user'),
                text: v.string(),
                gameId: v.union(v.id('game'), v.id('bingoGame')),
                _creationTime: v.number(),
            }),
        ),
    },
    handler: async (ctx, args) => {
        await Promise.all(
            args.instances.map(
                async ({ _id, x, y, width, height }) => await ctx.db.patch(_id, { x, y, width, height }),
            ),
        )
    },
})

export const update = mutation({
    args: {
        instanceId: v.id('instance'),
        x: v.optional(v.number()),
        y: v.optional(v.number()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const instance = await ctx.db.get(args.instanceId)
        if (!instance) return

        await ctx.db.patch(args.instanceId, {
            x: args.x ?? instance.x,
            y: args.y ?? instance.y,
            width: args.width ?? instance.width,
            height: args.height ?? instance.height,
        })
    },
})

export type CreateInstance = Omit<Doc<'instance'>, '_id' | '_creationTime'>
export type WordInstance = Omit<Doc<'word'>, '_id'> & Doc<'instance'>
