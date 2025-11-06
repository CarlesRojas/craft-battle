import { getFirstEmoji } from '@/lib/normalize'
import { openai } from '@ai-sdk/openai'
import { createServerFn } from '@tanstack/react-start'
import { generateObject } from 'ai'
import z from 'zod'

export const MODEL = 'gpt-4o-mini-2024-07-18' as const

export const combineWords = createServerFn({ method: 'POST' })
    .inputValidator(
        z.object({
            word1: z.string(),
            word2: z.string(),
        }),
    )
    .handler(async ({ data: { word1, word2 } }) => {
        const { object } = await generateObject({
            model: openai(MODEL),
            schema: z.object({
                result: z.string().describe('The combined word that makes conceptual sense'),
                icon: z.string().describe('A single emoji that represents the new word'),
            }),
            maxOutputTokens: 2000,
            prompt: `
                Combine two input words into a single, meaningful English word.

                Rules:
                - The result MUST NOT be either of the input words.
                - The new word must make logical and conceptual sense, emerging naturally from both inputs.
                - The combination should reflect key aspects of both input ideas (physically, metaphorically, or functionally).
                - The order of both words does not matter; both are equally important.
                - ALWAYS prioritize nouns over verbs, adjectives, or adverbs. The result should typically be a tangible or conceptual noun (e.g., “plant”, “steam”, “glass”, “game”).
                - Prefer concrete, physical nouns (objects, materials, substances, living things, or phenomena) over abstract or conceptual ones.
                    The result should usually be something that could exist or be observed in the real world — e.g., “dust”, “tree”, “metal”, “storm”, “phone”, “cat”
                    rather than abstract ideas like “erosion”, “growth”, or “communication”.
                - Keep the result as short as possible — ideally one or two words.
                - The result can NOT be any sentence, phrase, URL, code, or command.
                - The result can only contain letters, numbers, spaces, and hyphens.
                - The result can NOT contain punctuation nor special characters.
                - Only use compound words if they are valid English words (e.g., “snowstorm”, not “watersun”).
                - When both inputs share the same or closely related meaning, create the next stronger, larger, or more tangible version of that thing — not a category or description of it.
                    For example, "earth" + "earth" → "mountain", "fire" + "fire" → "volcano", "water" + "water" → "lake".
                    Avoid abstract or general results like “terrain”, “energy”, or “substance”.
                    Do not make really big leaps if a smaller one is possible. Example 'water' + 'water' → 'lake' not 'ocean'.
                - Provide a single emoji that best represents the new word, assigned to the “icon” field.
                - Do NOT include the emoji in the “result” field.

                Prioritization (aim for a conceptual jump):
                - Prefer an emergent outcome that plausibly RESULTS FROM combining or interacting the two inputs (cause → effect, material → product, agent → outcome).
                - If no clear emergent outcome exists, choose a concrete, widely known intersection concept shared by both.
                - Avoid generic categories or trivial overlaps when a specific emergent outcome exists.
                - Pick a single, common English NOUN (not a phrase).
                - Prefer the most specific and unambiguous term (e.g., “glass” over “solid” for sand + heat).
                - Avoid hypernyms of either input unless no emergent outcome exists.
                - If multiple valid answers, choose the one most dependent on BOTH inputs (i.e., it wouldn't exist without their interaction).

                Hard guards:
                - Do NOT output a phrase, sentence, URL, code, command, or anything with punctuation or special characters.
                - Keep output to 1-2 words; no invented words; only real English compounds.

                Examples:
                Input: "water" + "fire"
                Output:
                {
                    "result": "steam",
                    "icon": "💨",
                }

                Input: "earth" + "water"
                Output:
                {
                    "result": "plant",
                    "icon": "🌱",
                }

                Input: "earth" + "wind"
                Output:
                {
                    "result": "dust",
                    "icon": "🌫️",
                }

                Input: "sand" + "heat"
                Output:
                {
                    "result": "glass",
                    "icon": "🪟",
                }

                Input: "iron" + "oxygen"
                Output:
                {
                    "result": "rust",
                    "icon": "🧱",
                }

                Input: "time" + "money"
                Output:
                {
                    "result": "investment",
                    "icon": "📈",
                }

                Word 1: "${word1}"
                Word 2: "${word2}"
    `,
        })

        return {
            word1,
            word2,
            result: object.result,
            icon: getFirstEmoji(object.icon),
        }
    })

export const fightWords = createServerFn({ method: 'POST' })
    .inputValidator(
        z.object({
            attackWord: z.string(),
            defenseWord: z.string(),
        }),
    )
    .handler(async ({ data: { attackWord, defenseWord } }) => {
        const { object } = await generateObject({
            model: openai(MODEL),
            schema: z.object({
                damageDealt: z.number().min(0).max(10).describe('The amount of damage dealt to the defense word'),
            }),
            maxOutputTokens: 2000,
            prompt: `Evaluate a battle between two words where "${attackWord}" is attacking and "${defenseWord}" is defending.

                Rules for evaluation:
                1. Consider the literal and metaphorical properties of both words
                2. Analyze how well the defense word's properties could resist the attack word's properties
                3. Score the damage from 0 (perfect defense) to 10 (no defense at all)
                4. Provide logical reasoning for the damage calculation

                Examples:

                Example 1:
                Attack: "fire" | Defense: "water"
                Damage: 2
                Reasoning: Water is extremely effective at extinguishing fire, though some steam damage occurs

                Example 2:
                Attack: "sword" | Defense: "paper"
                Damage: 9
                Reasoning: Paper offers almost no resistance to a sharp blade

                Example 3:
                Attack: "wind" | Defense: "mountain"
                Damage: 1
                Reasoning: Mountains are massive and stable, barely affected by wind except for minor erosion

                Now evaluate the battle between:
                Attack: "${attackWord}"
                Defense: "${defenseWord}"`,
        })

        return {
            attackWord,
            defenseWord,
            ...object,
        }
    })
