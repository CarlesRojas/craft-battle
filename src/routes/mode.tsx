import { Button } from '@/component/ui/button'
import { getUser } from '@/data/getUser'
import { api } from '@/db/_generated/api'
import { Sound, useAudio } from '@/integration/AudioProvider'
import { getTranslation } from '@/locale/getTranslation'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useConvex } from 'convex/react'

export const Route = createFileRoute('/mode')({
    component: SelectGamePage,
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

    return (
        <main className="full-page relative flex items-center justify-center pt-8">
            <div className="flex w-full max-w-lg flex-col items-center gap-12 place-self-start overscroll-y-auto px-3 py-6">
                <h1 className="font-goldman w-full text-left text-3xl tracking-wider text-balance text-sky-600 dark:text-sky-500">
                    {t.common.welcomeUser.replace('{{USER}}', user.username)}
                </h1>

                <div className="flex w-full flex-col items-center gap-4">
                    <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.mode.choose}</h2>

                    <ul className="grid w-full grid-rows-3 gap-4">
                        <Button
                            onClick={async () => {
                                play(Sound.CLICK)
                                await convex.mutation(api.game.create, { playerId: user._id })
                                router.navigate({ to: '/game' })
                            }}
                            size="fit"
                            variant="white"
                            className="size-full items-start"
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
