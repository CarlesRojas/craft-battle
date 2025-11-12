import { v } from 'convex/values'
import type { BingoDifficulty } from '../src/data/bingo'
import { asyncReduce } from '../src/lib/asyncReduce'
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
        const games = [
            async () =>
                await ctx.db
                    .query('bingo')
                    .withIndex('player1', q => q.eq('player1Id', args.player1Id))
                    .first(),
            async () =>
                await ctx.db
                    .query('bingo')
                    .withIndex('player1', q => q.eq('player1Id', args.player2Id))
                    .first(),
            async () =>
                await ctx.db
                    .query('bingo')
                    .withIndex('player2', q => q.eq('player2Id', args.player1Id))
                    .first(),
            async () =>
                await ctx.db
                    .query('bingo')
                    .withIndex('player2', q => q.eq('player2Id', args.player2Id))
                    .first(),
        ]

        for (const getGame of games) {
            const existingGame = await getGame()

            if (existingGame) {
                const existingObjectives = await ctx.db
                    .query('objective')
                    .withIndex('game', q => q.eq('gameId', existingGame._id))
                    .collect()

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

                await Promise.all(existingObjectives.map(async objective => await ctx.db.delete(objective._id)))

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

        let objectives = await Promise.all(
            objectiveDepths.map(async depth => {
                let word: Doc<'combination'> | null = null

                while (!word) {
                    word = await ctx.db
                        .query('combination')
                        .withIndex('random_depth', q => q.eq('depth', depth).gte('random', Math.random()))
                        .first()
                }

                return word
            }),
        )

        objectives = await asyncReduce(
            objectives,
            async (acc: Array<Doc<'combination'>>, current, index) => {
                const isDuplicate = acc.some(obj => obj.result === current.result)

                let currentWord = current
                if (isDuplicate) {
                    let newWord: Doc<'combination'> | null = null
                    const depth = objectiveDepths[index]

                    while (!newWord) {
                        const randomWord = await ctx.db
                            .query('combination')
                            .withIndex('random_depth', q => q.eq('depth', depth).gte('random', Math.random()))
                            .first()

                        if (randomWord && !acc.some(obj => obj.result === randomWord.result)) newWord = randomWord
                    }

                    currentWord = newWord
                }

                acc.push(currentWord)
                return acc
            },
            [],
        )

        const gameId = await ctx.db.insert('bingo', {
            ...args,
            player1Entered: false,
            player2Entered: false,
        })

        await Promise.all(
            objectives.map(obj =>
                ctx.db.insert('objective', {
                    gameId,
                    text: obj.result,
                    icon: obj.icon,
                    completed: false,
                    playerId: undefined,
                }),
            ),
        )

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
            .query('bingo')
            .withIndex('player1', q => q.eq('player1Id', args.playerId))
            .first()

        let opponent = game?.player2Id ? await ctx.db.get(game.player2Id) : null

        if (!game) {
            game = await ctx.db
                .query('bingo')
                .withIndex('player2', q => q.eq('player2Id', args.playerId))
                .first()
            opponent = game?.player1Id ? await ctx.db.get(game.player1Id) : null
        }

        if (!game || !opponent) return null

        const objectives = await ctx.db
            .query('objective')
            .withIndex('game', q => q.eq('gameId', game._id))
            .collect()

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

        return { game, words, instances: instances.flat(), objectives, opponent }
    },
})

export const completeObjective = mutation({
    args: {
        gameId: v.id('bingo'),
        objectiveId: v.id('objective'),
        playerId: v.id('user'),
    },
    handler: async (ctx, { gameId, objectiveId, playerId }) => {
        await ctx.db.patch(objectiveId, { playerId })

        const gameObjectives = await ctx.db
            .query('objective')
            .withIndex('game', q => q.eq('gameId', gameId))
            .collect()

        const wordsToWin = Math.ceil(WORDS_PER_GAME / 2.0)
        const playerWordCount = gameObjectives.reduce((acc, obj) => {
            if (obj.playerId === playerId) return acc + 1
            return acc
        }, 0)

        if (playerWordCount >= wordsToWin) await ctx.db.patch(gameId, { winner: playerId })
    },
})

export const registerPresence = mutation({
    args: {
        gameId: v.id('bingo'),
        isPlayer1: v.boolean(),
    },
    handler: async (ctx, { gameId, isPlayer1 }) => {
        isPlayer1
            ? await ctx.db.patch(gameId, { player1Entered: true })
            : await ctx.db.patch(gameId, { player2Entered: true })
    },
})
