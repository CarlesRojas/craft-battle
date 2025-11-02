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
                explanation: z
                    .string()
                    .describe('Brief explanation of how the words were combined and what the new word means'),
                icon: z.string().describe('A single emoji that represents the new word'),
            }),
            maxOutputTokens: 2000,
            prompt: `
                Combine two words into a new meaningful word.

                Rules:
                1. The result MUST NOT be either of the input words
                2. The new word should make conceptual sense
                3. The combination should reflect aspects of both input words
                4. The result should be a single word
                5. Avoid just concatenating the words together
                6. The result word should be a real English word
                7. Provide an icon that should be a single emoji that best represents the new word
                8. Provide a brief explanation of the combination logic

                Example:
                Input: "water" + "fire" -> "steam" 💨 (A combination of water and fire that produces steam)

                Word 1: "${word1}"
                Word 2: "${word2}"
                `,
        })

        return {
            word1,
            word2,
            ...object,
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
                explanation: z.string().describe('A brief explanation of why the attack was effective or not'),
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
