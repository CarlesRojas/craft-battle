import CreateBingoGame from '@/component/game/CreateBingoGame'
import Invites from '@/component/Invites'
import { getUser } from '@/data/getUser'
import { cn } from '@/lib/cn'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { useState } from 'react'

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

    const [isLoading, setIsLoading] = useState(false)

    return (
        <main className="full-page relative flex items-center justify-center overflow-y-auto pt-8">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader className="size-12 animate-spin" />
                </div>
            )}

            <div
                className={cn(
                    'flex h-fit w-full max-w-lg flex-col items-center gap-12 place-self-start px-3 py-6',
                    isLoading && 'pointer-events-none opacity-0',
                )}
            >
                <CreateBingoGame language={language} user={user} />

                <Invites language={language} user={user} setIsLoading={setIsLoading} currentRoute={'/new/bingo'} />
            </div>
        </main>
    )
}
