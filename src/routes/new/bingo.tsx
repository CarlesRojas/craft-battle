import CreateBingoGame from '@/component/game/CreateBingoGame'
import { getUser } from '@/data/getUser'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/new/bingo')({
    component: NewBingoPage,
    ssr: false,
    beforeLoad: async ({ context: { convex } }) => {
        const user = await getUser({ convex })
        if (!user) throw redirect({ to: '/' })

        return { user }
    },
})

function NewBingoPage() {
    const { user, language } = Route.useRouteContext()

    return (
        <main className="full-page relative flex items-center justify-center overflow-y-auto pt-8">
            <CreateBingoGame language={language} user={user} />
        </main>
    )
}
