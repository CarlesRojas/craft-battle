import Game from '@/component/Game'
import { getUser } from '@/data/getUser'
import { api } from '@/db/_generated/api'
import { WordListProvider } from '@/integration/WordListProvider'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$language/game')({
    component: GamePage,
    beforeLoad: async ({ context: { convex, language } }) => {
        const user = await getUser({ convex })
        if (!user) throw redirect({ to: '/$language', params: { language } })

        const game = await convex.convexClient.query(api.game.get, { playerId: user._id })
        if (!game) throw redirect({ to: '/$language', params: { language } })

        return { user }
    },
})

function GamePage() {
    const { user, language } = Route.useRouteContext()

    return (
        <main className="full-page">
            <WordListProvider user={user}>
                <Game user={user} language={language} />
            </WordListProvider>
        </main>
    )
}
