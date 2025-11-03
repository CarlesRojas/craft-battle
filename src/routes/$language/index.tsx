import CreateUsername from '@/component/CreateUsername'
import NewGame from '@/component/NewGame'
import { api } from '@/db/_generated/api'
import { User } from '@/db/username'
import { createLocalStorage } from '@/lib/localStorage'
import { createFileRoute } from '@tanstack/react-router'
import { useConvex } from 'convex/react'
import { Loader } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import z from 'zod'

export const Route = createFileRoute('/$language/')({ component: App })

const usernameStorage = createLocalStorage(
    'USERNAME',
    z.object({ username: z.string(), key: z.string() }).optional(),
    undefined,
)

function App() {
    const { language } = Route.useRouteContext()

    const convex = useConvex()

    const [user, setUser] = useState<User | null>(null)
    const [loaded, setLoaded] = useState(false)

    const loadUsername = useCallback(async () => {
        const storedUsername = usernameStorage.get()

        if (storedUsername) {
            const result = await convex.mutation(api.username.create, storedUsername)
            if (result) setUser(result)
            else usernameStorage.remove()
        }

        setLoaded(true)
    }, [])

    const onUsernameCreated = useCallback((user: User, key: string) => {
        setUser(user)
        usernameStorage.set({ username: user.username, key })
    }, [])

    useEffect(() => {
        loadUsername()
    }, [loadUsername])

    return (
        <main className="full-page flex items-center justify-center">
            {!loaded && <Loader className="size-8 animate-spin" />}

            {loaded && !!user && <NewGame language={language} user={user} />}

            {loaded && !user && <CreateUsername language={language} onUsernameCreated={onUsernameCreated} />}
        </main>
    )
}
