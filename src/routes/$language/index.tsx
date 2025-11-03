import CreateUsername from '@/component/CreateUsername'
import { api } from '@/db/_generated/api'
import { createLocalStorage } from '@/lib/localStorage'
import { getTranslation } from '@/locale/getTranslation'
import { createFileRoute } from '@tanstack/react-router'
import { useConvex } from 'convex/react'
import { Loader } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import z from 'zod'

export const Route = createFileRoute('/$language/')({ component: App })

const usernameStorage = createLocalStorage(
    'USERNAME',
    z
        .object({
            username: z.string(),
            key: z.string(),
        })
        .optional(),
    undefined,
)

function App() {
    const { language } = Route.useRouteContext()
    const t = getTranslation(language)

    const convex = useConvex()

    const [username, setUsername] = useState<string | null>(null)
    const [loaded, setLoaded] = useState(false)

    const loadUsername = useCallback(async () => {
        const storedUsername = usernameStorage.get()

        if (storedUsername) {
            const result = await convex.mutation(api.username.create, storedUsername)
            if (result) setUsername(storedUsername.username)
            else usernameStorage.remove()
        }

        setLoaded(true)
    }, [])

    const onUsernameCreated = useCallback(({ username, key }: { username: string; key: string }) => {
        setUsername(username)
        usernameStorage.set({ username, key })
    }, [])

    useEffect(() => {
        loadUsername()
    }, [loadUsername])

    console.log(loaded)

    return (
        <main className="full-page flex items-center justify-center">
            {!loaded && <Loader className="size-8 animate-spin" />}

            {loaded && !!username && <p>{t.home.welcome.replace('{{USER}}', username)}</p>}

            {loaded && !username && <CreateUsername language={language} onUsernameCreated={onUsernameCreated} />}
        </main>
    )
}
