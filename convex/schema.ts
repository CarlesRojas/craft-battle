import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
    // USER
    // ##############################################################

    user: defineTable({
        username: v.string(),
        normalizedUsername: v.string(),
        key: v.string(),
    })
        .index('username', ['normalizedUsername'])
        .searchIndex('user', { searchField: 'normalizedUsername' }),

    // WORD
    // ##############################################################

    word: defineTable({
        text: v.string(),
        icon: v.string(),

        gameId: v.union(v.id('classic'), v.id('bingo')),
        playerId: v.id('user'),
    })
        .index('player', ['gameId', 'playerId'])
        .index('playerWord', ['text', 'playerId']),

    instance: defineTable({
        wordId: v.id('word'),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
    }).index('word', ['wordId']),

    combination: defineTable({
        word1: v.string(),
        word2: v.string(),
        result: v.string(),

        depth: v.number(),
        icon: v.string(),
        random: v.number(),
    })
        .index('words', ['word1', 'word2'])
        .index('result', ['result'])
        .index('depth', ['depth'])
        .index('random_depth', ['depth', 'random']),

    // CLASSIC
    // ##############################################################

    classic: defineTable({
        playerId: v.id('user'),
    }).index('player', ['playerId']),

    // BINGO
    // ##############################################################

    bingo: defineTable({
        player1Id: v.id('user'),
        player2Id: v.id('user'),
        objectives: v.array(v.string()),
        inviteId: v.id('inviteBingo'),
        difficulty: v.union(v.literal('EASY'), v.literal('MEDIUM'), v.literal('HARD')),
    })
        .index('player1', ['player1Id'])
        .index('player2', ['player2Id']),

    inviteBingo: defineTable({
        senderId: v.id('user'),
        receiverId: v.id('user'),
        difficulty: v.union(v.literal('EASY'), v.literal('MEDIUM'), v.literal('HARD')),
    })
        .index('sender', ['senderId'])
        .index('receiver', ['receiverId'])
        .index('users', ['senderId', 'receiverId']),

    // BATTLE
    // ##############################################################

    fight: defineTable({
        attackWord: v.string(),
        defenseWord: v.string(),
        damageDealt: v.number(),
    }).index('words', ['attackWord', 'defenseWord']),
})
