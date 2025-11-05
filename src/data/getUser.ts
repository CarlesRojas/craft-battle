import { api } from '@/db/_generated/api'
import type { User } from '@/db/username'
import { isLocalStorageAvailable, LOCAL_STORAGE_PREFIX } from '@/lib/storage'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import z from 'zod'

interface Props {
    convex: ConvexQueryClient
}

const UserSchema = z.object({ username: z.string(), key: z.string() }).nullable()

export const getUser = async ({ convex }: Props) => {
    if (!isLocalStorageAvailable()) return

    const storedUser = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_USER`)
    const parsedUser = UserSchema.safeParse(storedUser ? JSON.parse(storedUser) : null)
    if (!parsedUser.success) return null

    let user: User | null = null

    if (parsedUser.data) {
        user = await convex.convexClient.mutation(api.username.create, parsedUser.data)
        if (!user) localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}_USER`)
    }

    return user
}

export const setUser = (user: User, key: string) => {
    if (!isLocalStorageAvailable()) return
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_USER`, JSON.stringify({ username: user.username, key }))
}
