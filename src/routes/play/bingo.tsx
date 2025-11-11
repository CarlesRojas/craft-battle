import BingoGame from '@/component/game/BingoGame'
import { getUser } from '@/data/getUser'
import { api } from '@/db/_generated/api'
import { WordListProvider } from '@/integration/WordListProvider'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/play/bingo')({
    component: BingoPlayPage,
    ssr: false,
    beforeLoad: async ({ context: { convex } }) => {
        const user = await getUser({ convex })
        if (!user) throw redirect({ to: '/' })

        const game = await convex.convexClient.query(api.bingo.get, { playerId: user._id })
        if (!game) throw redirect({ to: '/' })

        return { user }
    },
})

function BingoPlayPage() {
    const { user, language } = Route.useRouteContext()

    return (
        <main className="full-page touch-none overflow-hidden">
            <WordListProvider user={user} getGameQuery={api.bingo.get}>
                <BingoGame user={user} language={language} />
            </WordListProvider>
        </main>
    )
}
