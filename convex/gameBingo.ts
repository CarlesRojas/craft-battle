import { v } from 'convex/values'
import type { BingoDifficulty } from '../src/data/bingo'
import type { Doc } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

const DEFAULT_WORDS: Array<Omit<Doc<'word'>, '_id' | '_creationTime' | 'gameId' | 'playerId'>> = [
    { text: 'water', icon: '💧' },
    { text: 'fire', icon: '🔥' },
    { text: 'wind', icon: '💨' },
    { text: 'earth', icon: '🌍' },
]

const DIFFICULTY_DEPTH_LIMITS: Record<BingoDifficulty, [number, number]> = {
    EASY: [3, 5],
    MEDIUM: [6, 8],
    HARD: [9, 11],
}

const WORDS_PER_GAME = 5

export const create = mutation({
    args: {
        inviteId: v.id('inviteBingo'),
        player1Id: v.id('user'),
        player2Id: v.id('user'),
        difficulty: v.union(v.literal('EASY'), v.literal('MEDIUM'), v.literal('HARD')),
    },
    handler: async (ctx, args) => {
        const games = await Promise.all([
            ctx.db
                .query('bingoGame')
                .withIndex('player1', q => q.eq('player1Id', args.player1Id))
                .first(),
            ctx.db
                .query('bingoGame')
                .withIndex('player1', q => q.eq('player1Id', args.player2Id))
                .first(),
            ctx.db
                .query('bingoGame')
                .withIndex('player2', q => q.eq('player2Id', args.player1Id))
                .first(),
            ctx.db
                .query('bingoGame')
                .withIndex('player2', q => q.eq('player2Id', args.player2Id))
                .first(),
        ])

        for (const existingGame of games) {
            if (existingGame) {
                const existingGameWords = (
                    await Promise.all([
                        ctx.db
                            .query('word')
                            .withIndex('player', q => q.eq('gameId', existingGame._id).eq('playerId', args.player1Id))
                            .collect(),
                        ctx.db
                            .query('word')
                            .withIndex('player', q => q.eq('gameId', existingGame._id).eq('playerId', args.player2Id))
                            .collect(),
                    ])
                ).flat()

                const existingGameWordInstances = (
                    await Promise.all(
                        existingGameWords.map(async word =>
                            ctx.db
                                .query('instance')
                                .withIndex('word', q => q.eq('wordId', word._id))
                                .collect(),
                        ),
                    )
                ).flat()

                await Promise.all(existingGameWordInstances.map(async instance => await ctx.db.delete(instance._id)))

                await Promise.all(existingGameWords.map(async word => await ctx.db.delete(word._id)))

                await ctx.db.delete(existingGame._id)
            }
        }

        const [minDepth, maxDepth] = DIFFICULTY_DEPTH_LIMITS[args.difficulty]
        const objectiveDepths = Array.from(
            { length: WORDS_PER_GAME },
            _ => Math.floor(Math.random() * (maxDepth - minDepth + 1)) + minDepth,
        )

        const objectivesGroups = await Promise.all(
            objectiveDepths.map(async depth =>
                ctx.db
                    .query('combination')
                    .withIndex('depth', q => q.eq('depth', depth))
                    .collect(),
            ),
        )
        const objectives = objectivesGroups.map(group => group[Math.floor(Math.random() * group.length)])

        const gameId = await ctx.db.insert('bingoGame', { ...args, objectives: objectives.map(obj => obj.result) })

        await Promise.all(
            DEFAULT_WORDS.map(async word => await ctx.db.insert('word', { ...word, playerId: args.player1Id, gameId })),
        )
        await Promise.all(
            DEFAULT_WORDS.map(async word => await ctx.db.insert('word', { ...word, playerId: args.player2Id, gameId })),
        )

        return gameId
    },
})

export const get = query({
    args: {
        playerId: v.id('user'),
    },
    handler: async (ctx, args) => {
        let game = await ctx.db
            .query('bingoGame')
            .withIndex('player1', q => q.eq('player1Id', args.playerId))
            .first()

        if (!game)
            game = await ctx.db
                .query('bingoGame')
                .withIndex('player2', q => q.eq('player2Id', args.playerId))
                .first()

        if (!game) return null

        const words = await ctx.db
            .query('word')
            .withIndex('player', q => q.eq('gameId', game._id).eq('playerId', args.playerId))
            .collect()

        const instances = await Promise.all(
            words.map(async ({ _id, ...word }) =>
                (
                    await ctx.db
                        .query('instance')
                        .withIndex('word', q => q.eq('wordId', _id))
                        .collect()
                ).map(instance => ({ ...word, ...instance })),
            ),
        )

        return { game, words, instances: instances.flat() }
    },
})
