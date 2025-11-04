import Game from '@/component/Game'
import { getUser } from '@/data/getUser'
import { WordListProvider } from '@/integration/WordListProvider'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$language/game')({
    component: GamePage,
    beforeLoad: async ({ context: { convex, language } }) => {
        const user = await getUser({ convex })
        if (!user) throw redirect({ to: '/$language', params: { language } })

        return { user }
    },
})

function GamePage() {
    return (
        <main className="full-page">
            <WordListProvider>
                <Game />
            </WordListProvider>
        </main>
    )
}
