import ClassicGame from '@/component/game/ClassicGame'
import { getUser } from '@/data/getUser'
import { api } from '@/db/_generated/api'
import { WordListProvider } from '@/integration/WordListProvider'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/play/classic')({
    component: ClassicPlayPage,
    ssr: false,
    beforeLoad: async ({ context: { convex } }) => {
        const user = await getUser({ convex })
        if (!user) throw redirect({ to: '/' })

        const game = await convex.convexClient.query(api.classic.get, { playerId: user._id })
        if (!game) throw redirect({ to: '/' })

        return { user }
    },
})

function ClassicPlayPage() {
    const { user, language } = Route.useRouteContext()

    return (
        <main className="full-page touch-none overflow-hidden">
            <WordListProvider user={user} getGameQuery={api.classic.get}>
                <ClassicGame user={user} language={language} />
            </WordListProvider>
        </main>
    )
}
