import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
    combination: defineTable({
        word1: v.string(),
        word2: v.string(),
        result: v.string(),
        explanation: v.string(),
        icon: v.string(),
    }).index('words', ['word1', 'word2']),

    fight: defineTable({
        attackWord: v.string(),
        defenseWord: v.string(),
        damageDealt: v.number(),
        explanation: v.string(),
    }).index('words', ['attackWord', 'defenseWord']),

    user: defineTable({
        username: v.string(),
        normalizedUsername: v.string(),
        key: v.string(),
    })
        .index('username', ['normalizedUsername'])
        .searchIndex('user', { searchField: 'normalizedUsername' }),

    invite: defineTable({
        senderId: v.id('user'),
        receiverId: v.id('user'),
    })
        .index('sender', ['senderId'])
        .index('receiver', ['receiverId']),

    game: defineTable({
        playerId: v.id('user'),
    }).index('player', ['playerId']),

    bingoGame: defineTable({
        player1Id: v.id('user'),
        player2Id: v.id('user'),
        objectives: v.array(v.string()),
    })
        .index('player1', ['player1Id'])
        .index('player2', ['player2Id']),

    word: defineTable({
        text: v.string(),
        icon: v.string(),
        explanation: v.optional(v.string()),
        gameId: v.union(v.id('game'), v.id('bingoGame')),
        playerId: v.id('user'),
    })
        .index('player', ['gameId', 'playerId'])
        .index('word', ['text']),
})
