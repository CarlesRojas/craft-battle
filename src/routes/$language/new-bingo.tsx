import BingoNewGame from '@/component/BingoNewGame'
import { getUser } from '@/data/getUser'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$language/new-bingo')({
    component: NewBingoGamePage,
    beforeLoad: async ({ context: { convex, language } }) => {
        const user = await getUser({ convex })
        if (!user) throw redirect({ to: '/$language', params: { language } })

        return { user }
    },
})

function NewBingoGamePage() {
    const { user, language } = Route.useRouteContext()
    console.log('SELECT', user)

    return (
        <main className="full-page relative flex items-center justify-center pt-8">
            <BingoNewGame language={language} user={user} />
        </main>
    )
}
