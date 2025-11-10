import { Button } from '@/component/ui/button'
import { getUser } from '@/data/getUser'
import { api } from '@/db/_generated/api'
import { Sound, useAudio } from '@/integration/AudioProvider'
import { getTranslation } from '@/locale/getTranslation'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useConvex, useQuery as useConvexQuery } from 'convex/react'
import { useState } from 'react'

export const Route = createFileRoute('/mode')({
    component: SelectGamePage,
    ssr: false,
    beforeLoad: async ({ context: { convex } }) => {
        const user = await getUser({ convex })
        if (!user) throw redirect({ to: '/' })

        return { user }
    },
})

function SelectGamePage() {
    const { user, language } = Route.useRouteContext()
    const t = getTranslation(language)
    const router = useRouter()
    const convex = useConvex()
    const { play } = useAudio()

    const [isLoading, setIsLoading] = useState(false)
    const activeClassicGame = useConvexQuery(api.game.get, { playerId: user._id })

    return (
        <main className="full-page relative flex h-fit items-center justify-center overflow-y-auto pt-8">
            <div className="flex h-fit w-full max-w-lg flex-col items-center gap-12 place-self-start px-3 py-6">
                <h1 className="font-goldman w-full text-left text-3xl tracking-wider text-balance text-sky-600 dark:text-sky-500">
                    {t.common.welcomeUser.replace('{{USER}}', user.username)}
                </h1>

                {activeClassicGame && !isLoading && (
                    <div className="flex w-full flex-col items-center gap-4">
                        <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.mode.activeGames}</h2>

                        <ul className="flex w-full flex-col gap-4">
                            <li className="flex w-full items-center justify-between gap-4 border border-neutral-300 bg-neutral-300/50 p-2 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <span className="pl-2 leading-tight font-medium opacity-80">{t.mode.classicGame}</span>

                                <Button
                                    variant="constructive"
                                    onClick={() => {
                                        play(Sound.CLICK)
                                        router.navigate({ to: '/game' })
                                    }}
                                >
                                    {t.mode.continue}
                                </Button>
                            </li>
                        </ul>
                    </div>
                )}

                <div className="flex w-full flex-col items-center gap-4">
                    <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.mode.choose}</h2>

                    <ul className="grid w-full grid-rows-3 gap-4">
                        <Button
                            onClick={async () => {
                                setIsLoading(true)
                                play(Sound.CLICK)
                                await convex.mutation(api.game.create, { playerId: user._id })
                                router.navigate({ to: '/game' })
                            }}
                            size="fit"
                            variant="white"
                            className="size-full items-start"
                            disabled={isLoading}
                        >
                            <div className="flex flex-col justify-start">
                                <h3 className="font-goldman w-full text-left text-xl tracking-wide text-sky-600 dark:text-sky-500">
                                    {t.mode.classic.title}
                                </h3>

                                <p className="font-montserrat text-left text-sm whitespace-normal opacity-80">
                                    {t.mode.classic.description}
                                </p>
                            </div>
                        </Button>

                        <Button
                            onClick={() => {
                                play(Sound.CLICK)
                                router.navigate({ to: '/new-bingo' })
                            }}
                            size="fit"
                            variant="white"
                            className="size-full items-start"
                            disabled
                        >
                            <div className="flex flex-col justify-start">
                                <h3 className="font-goldman w-full text-left text-xl tracking-wide text-sky-600 dark:text-sky-500">
                                    {t.mode.bingo.title}{' '}
                                    <span className="text-black dark:text-white">- {t.mode.comingSoon}</span>
                                </h3>

                                <p className="font-montserrat text-left text-sm whitespace-normal opacity-80">
                                    {t.mode.bingo.description}
                                </p>
                            </div>
                        </Button>

                        <Button
                            onClick={() => {
                                play(Sound.CLICK)
                                router.navigate({ to: '/new-battle' })
                            }}
                            size="fit"
                            variant="white"
                            className="size-full items-start"
                            disabled
                        >
                            <div className="flex flex-col justify-start">
                                <h3 className="font-goldman w-full text-left text-xl tracking-wide text-sky-600 dark:text-sky-500">
                                    {t.mode.battle.title}{' '}
                                    <span className="text-black dark:text-white">- {t.mode.comingSoon}</span>
                                </h3>

                                <p className="font-montserrat text-left text-sm whitespace-normal opacity-80">
                                    {t.mode.battle.description}
                                </p>
                            </div>
                        </Button>
                    </ul>
                </div>
            </div>
        </main>
    )
}
