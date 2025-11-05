import type { z } from 'zod'

export const LOCAL_STORAGE_PREFIX = 'CRAFT_BATTLE_'

const getLocalStorage = () => (typeof window !== 'undefined' ? window.localStorage : null)

export function createLocalStorage<T extends z.ZodType>(key: string, schema: T, defaultValue: z.infer<T>) {
    type Storage = z.infer<T>

    const get = (): Storage => {
        const ls = getLocalStorage()
        if (!ls) return schema.parse(defaultValue)

        try {
            const stored = ls.getItem(`${LOCAL_STORAGE_PREFIX}${key}`)
            if (!stored) return schema.parse(defaultValue)
            return schema.parse(JSON.parse(stored))
        } catch {
            return schema.parse(defaultValue)
        }
    }

    const set = (value: Storage) => {
        const ls = getLocalStorage()
        if (!ls) return

        try {
            ls.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, JSON.stringify(value))
        } catch {}
    }

    const remove = () => {
        const ls = getLocalStorage()
        if (!ls) return

        try {
            ls.removeItem(`${LOCAL_STORAGE_PREFIX}${key}`)
        } catch {}
    }

    return { get, set, remove }
}
