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
    }).index('username', ['normalizedUsername']),
})
