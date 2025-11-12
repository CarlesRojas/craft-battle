import { Button } from '@/component/ui/button'
import { BingoDifficulty } from '@/data/bingo'
import { getUser } from '@/data/getUser'
import { api } from '@/db/_generated/api'
import { cn } from '@/lib/cn'
import { getTranslation } from '@/locale/getTranslation'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery as useConvexQuery } from 'convex/react'
import { Loader } from 'lucide-react'

export const Route = createFileRoute('/win/bingo')({
    component: BingoWinPage,
    ssr: false,
    beforeLoad: async ({ context: { convex } }) => {
        const user = await getUser({ convex })
        if (!user) throw redirect({ to: '/' })

        const game = await convex.convexClient.query(api.bingo.get, { playerId: user._id })
        if (!game) throw redirect({ to: '/' })

        return { user, game }
    },
})

function BingoWinPage() {
    const { user, language } = Route.useRouteContext()
    const t = getTranslation(language)
    const navigate = useNavigate()

    const game = useConvexQuery(api.bingo.get, { playerId: user._id })

    if (!game)
        return (
            <div className="absolute inset-0 flex items-center justify-center opacity-80">
                <Loader className="size-12 animate-spin" />
            </div>
        )

    const isWinner = game.game.winner === user._id
    const opponentName = game.opponent.username

    const handleGoToMenu = async () => {
        await navigate({ to: '/mode' })
    }

    return (
        <main className="full-page relative flex items-center justify-center overflow-y-auto pt-8">
            <div className={cn('flex h-fit w-full max-w-lg flex-col items-center gap-12 place-self-start px-3 py-6')}>
                <div className="flex w-full flex-col items-center gap-3">
                    <div className="text-6xl">{isWinner ? '🏆' : '💔'}</div>

                    <h1
                        className={cn(
                            'font-goldman text-3xl font-bold tracking-wider text-balance',
                            isWinner && 'text-yellow-500 dark:text-yellow-500',
                            !isWinner && 'text-rose-600 dark:text-rose-400',
                        )}
                    >
                        {isWinner ? t.bingo.win.victory : t.bingo.win.defeat}
                    </h1>

                    <p className="text-lg font-medium opacity-60">
                        {isWinner
                            ? t.bingo.win.victorySubtitle.replace('{{OPPONENT}}', opponentName)
                            : t.bingo.win.defeatSubtitle.replace('{{OPPONENT}}', opponentName)}
                    </p>
                </div>

                <div className="flex w-full flex-col items-center gap-3">
                    <h2 className="font-goldman w-fit text-2xl tracking-wide opacity-80">
                        {t.bingo.win.summary.title}
                    </h2>

                    <div className="flex w-full flex-col items-center gap-2">
                        <div className="flex gap-3">
                            <span className="opacity-70 dark:opacity-60">{t.bingo.win.summary.difficulty}:</span>

                            <span
                                className={cn(
                                    'font-medium tracking-wide',
                                    game.game.difficulty === BingoDifficulty.EASY &&
                                        'text-green-600 dark:text-green-400',
                                    game.game.difficulty === BingoDifficulty.MEDIUM && 'text-sky-600 dark:text-sky-400',
                                    game.game.difficulty === BingoDifficulty.HARD && 'text-red-600 dark:text-red-400',
                                )}
                            >
                                {t.enum.difficulty[game.game.difficulty]}
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <span className="opacity-70 dark:opacity-60">{t.bingo.win.summary.yourScore}:</span>

                            <span className="font-medium tracking-wide">
                                {game.objectives.reduce((acc, cur) => acc + (cur.playerId === user._id ? 1 : 0), 0)}
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <span className="opacity-70 dark:opacity-60">{t.bingo.win.summary.opponentScore}:</span>

                            <span className="font-medium tracking-wide">
                                {game.objectives.reduce(
                                    (acc, cur) => acc + (cur.playerId && cur.playerId !== user._id ? 1 : 0),
                                    0,
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col items-center gap-3">
                    <Button onClick={handleGoToMenu} className="w-full">
                        {t.bingo.win.backToMenu}
                    </Button>
                </div>
            </div>
        </main>
    )
}
