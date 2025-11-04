import { getUser } from '@/data/getUser'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$language/new-battle')({
    component: NewBattlePage,
    beforeLoad: async ({ context: { convex, language } }) => {
        const user = await getUser({ convex })
        if (!user) throw redirect({ to: '/$language', params: { language } })

        return { user }
    },
})

function NewBattlePage() {
    const { user } = Route.useRouteContext()

    return <main className="full-page relative flex items-center justify-center pt-8">New Battle</main>
}
