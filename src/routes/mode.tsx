import Invites from '@/component/Invites'
import { Button } from '@/component/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/component/ui/dialog'
import { getUser } from '@/data/getUser'
import { api } from '@/db/_generated/api'
import { Sound, useAudio } from '@/integration/AudioProvider'
import { cn } from '@/lib/cn'
import { getTranslation } from '@/locale/getTranslation'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useConvex, useQuery as useConvexQuery } from 'convex/react'
import { Loader } from 'lucide-react'
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
    const navigate = useNavigate({ from: '/mode' })
    const convex = useConvex()
    const { play } = useAudio()

    const [isLoadingClassic, setIsLoadingClassic] = useState(false)
    const [isLoadingBingo, setIsLoadingBingo] = useState(false)
    const activeClassicGame = useConvexQuery(api.classic.get, { playerId: user._id })
    const activeBingoGame = useConvexQuery(api.bingo.get, { playerId: user._id })

    const hasActiveClassicGame = !!activeClassicGame
    const hasActiveBingoGame = !!activeBingoGame && !activeBingoGame.game.winner

    const ClassicButton = (
        <div className="flex flex-col justify-start">
            <h3 className="font-goldman w-full text-left text-xl tracking-wide text-sky-600 dark:text-sky-500">
                {t.mode.classic.title}
            </h3>

            <p className="font-montserrat text-left text-sm whitespace-normal opacity-80">
                {t.mode.classic.description}
            </p>
        </div>
    )

    const BingoButton = (
        <div className="flex flex-col justify-start">
            <h3 className="font-goldman w-full text-left text-xl tracking-wide text-sky-600 dark:text-sky-500">
                {t.mode.bingo.title}
            </h3>

            <p className="font-montserrat text-left text-sm whitespace-normal opacity-80">{t.mode.bingo.description}</p>
        </div>
    )

    const startClassicGame = async () => {
        setIsLoadingClassic(true)
        play(Sound.CLICK)
        await convex.mutation(api.classic.create, { playerId: user._id })
        navigate({ to: '/play/classic' })
    }

    const startBingoGame = () => {
        play(Sound.CLICK)
        navigate({ to: '/new/bingo' })
    }

    return (
        <main className="full-page relative flex h-fit items-center justify-center overflow-y-auto pt-8">
            {isLoadingClassic && (
                <div className="absolute inset-0 flex items-center justify-center opacity-80">
                    <Loader className="size-12 animate-spin" />
                </div>
            )}

            {isLoadingBingo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-80">
                    <Loader className="size-12 animate-spin" />
                    <p>{t.bingo.loading}</p>
                </div>
            )}

            <div
                className={cn(
                    'flex h-fit w-full max-w-lg flex-col items-center gap-12 place-self-start px-3 py-6',
                    (isLoadingClassic || isLoadingBingo) && 'pointer-events-none opacity-0',
                )}
            >
                <h1 className="font-goldman w-full text-left text-3xl tracking-wider text-balance text-sky-600 dark:text-sky-500">
                    {t.common.welcomeUser.replace('{{USER}}', user.username)}
                </h1>

                {(hasActiveClassicGame || hasActiveBingoGame) && (
                    <div className="flex w-full flex-col items-center gap-4">
                        <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.mode.activeGames}</h2>

                        <ul className="flex w-full flex-col gap-4">
                            {hasActiveClassicGame && (
                                <li className="flex w-full items-center justify-between gap-4 border border-neutral-300 bg-neutral-300/50 p-2 dark:border-neutral-800 dark:bg-neutral-800/50">
                                    <span className="pl-2 leading-tight font-medium opacity-80">
                                        {t.mode.classicGame}
                                    </span>

                                    <Button
                                        variant="constructive"
                                        onClick={() => {
                                            play(Sound.CLICK)
                                            navigate({ to: '/play/classic' })
                                        }}
                                    >
                                        {t.mode.continue}
                                    </Button>
                                </li>
                            )}

                            {hasActiveBingoGame && (
                                <li className="flex w-full items-center justify-between gap-4 border border-neutral-300 bg-neutral-300/50 p-2 dark:border-neutral-800 dark:bg-neutral-800/50">
                                    <span className="pl-2 leading-tight font-medium opacity-80">
                                        {t.mode.bingoGame.replace('{{OPPONENT}}', activeBingoGame.opponent.username)}
                                    </span>

                                    <Button
                                        variant="constructive"
                                        onClick={() => {
                                            play(Sound.CLICK)
                                            navigate({ to: '/play/bingo' })
                                        }}
                                    >
                                        {t.mode.continue}
                                    </Button>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                <div className="flex w-full flex-col items-center gap-4">
                    <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.mode.choose}</h2>

                    <ul className="grid w-full grid-rows-2 gap-4">
                        {hasActiveClassicGame && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="fit" variant="white" className="size-full items-start">
                                        {ClassicButton}
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t.mode.dialog.classicTitle}</DialogTitle>
                                        <DialogDescription>{t.mode.dialog.classicSubtitle}</DialogDescription>
                                    </DialogHeader>

                                    <DialogFooter className="sm:justify-end">
                                        <DialogClose asChild>
                                            <Button type="button" variant="white">
                                                {t.mode.dialog.cancel}
                                            </Button>
                                        </DialogClose>

                                        <DialogClose asChild>
                                            <Button onClick={startClassicGame} type="button" variant="constructive">
                                                {t.mode.dialog.start}
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        {!hasActiveClassicGame && (
                            <Button
                                onClick={startClassicGame}
                                size="fit"
                                variant="white"
                                className="size-full items-start"
                            >
                                {ClassicButton}
                            </Button>
                        )}

                        {hasActiveBingoGame && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="fit" variant="white" className="size-full items-start">
                                        {BingoButton}
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {t.mode.dialog.bingoTitle.replace(
                                                '{{OPPONENT}}',
                                                activeBingoGame.opponent.username,
                                            )}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {t.mode.dialog.bingoSubtitle.replace(
                                                '{{OPPONENT}}',
                                                activeBingoGame.opponent.username,
                                            )}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <DialogFooter className="sm:justify-end">
                                        <DialogClose asChild>
                                            <Button type="button" variant="white">
                                                {t.mode.dialog.cancel}
                                            </Button>
                                        </DialogClose>

                                        <DialogClose asChild>
                                            <Button onClick={startBingoGame} type="button" variant="constructive">
                                                {t.mode.dialog.start}
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        {!hasActiveBingoGame && (
                            <Button
                                onClick={startBingoGame}
                                size="fit"
                                variant="white"
                                className="size-full items-start"
                            >
                                {BingoButton}
                            </Button>
                        )}
                    </ul>
                </div>

                <Invites language={language} user={user} setIsLoading={setIsLoadingBingo} currentRoute={'/mode'} />
            </div>
        </main>
    )
}
