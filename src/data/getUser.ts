import { api } from '@/db/_generated/api'
import type { User } from '@/db/username'
import { createLocalStorage } from '@/lib/localStorage'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import z from 'zod'

interface Props {
    convex: ConvexQueryClient
}

const usernameStorage = createLocalStorage(
    'USERNAME',
    z.object({ username: z.string(), key: z.string() }).optional(),
    undefined,
)

export const getUser = async ({ convex }: Props) => {
    const storedUsername = usernameStorage.get()

    let user: User | null = null

    if (storedUsername) {
        user = await convex.convexClient.mutation(api.username.create, storedUsername)
        if (!user) usernameStorage.remove()
    }

    return user
}

export const setUser = (user: User, key: string) => {
    usernameStorage.set({ username: user.username, key })
}
