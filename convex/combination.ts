import { v } from 'convex/values'
import { normalize } from '../src/lib/normalize'
import { mutation, query } from './_generated/server'

export const get = query({
    args: {
        word1: v.string(),
        word2: v.string(),
    },
    handler: async (ctx, { word1, word2 }) => {
        const word1Normalized = normalize(word1, true, true)
        const word2Normalized = normalize(word2, true, true)

        const result = await ctx.db
            .query('combination')
            .withIndex('words', q => q.eq('word1', word1Normalized).eq('word2', word2Normalized))
            .first()

        if (result) return result

        return await ctx.db
            .query('combination')
            .withIndex('words', q => q.eq('word1', word2Normalized).eq('word2', word1Normalized))
            .first()
    },
})

export const create = mutation({
    args: {
        word1: v.string(),
        word2: v.string(),
        result: v.string(),
        icon: v.string(),
        depth: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const resultNormalized = normalize(args.result, true, true)
        const word1Normalized = normalize(args.word1, true, true)
        const word2Normalized = normalize(args.word2, true, true)

        let newDepth = args.depth ?? 0

        if (args.depth === undefined) {
            const word1Combination = await ctx.db
                .query('combination')
                .withIndex('result', q => q.eq('result', word1Normalized))
                .collect()
            const minWord1Depth = word1Combination.reduce(
                (min, combination) => Math.min(min, combination.depth),
                Number.MAX_SAFE_INTEGER,
            )

            const word2Combination = await ctx.db
                .query('combination')
                .withIndex('result', q => q.eq('result', word2Normalized))
                .collect()
            const minWord2Depth = word2Combination.reduce(
                (min, combination) => Math.min(min, combination.depth),
                Number.MAX_SAFE_INTEGER,
            )

            newDepth = Math.max(minWord1Depth, minWord2Depth) + 1
        }

        const combinationId = await ctx.db.insert('combination', {
            ...args,
            depth: newDepth,
            word1: word1Normalized,
            word2: word2Normalized,
            result: resultNormalized,
        })

        return (await ctx.db.get(combinationId))!
    },
})
