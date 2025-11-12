import { default as Canvas } from '@/component/Canvas'
import List from '@/component/List'
import Marquee from '@/component/Marquee'
import { api } from '@/db/_generated/api'
import type { User } from '@/db/username'
import type { CreateWord } from '@/db/word'
import { WordInstancesProvider } from '@/integration/WordInstancesProvider'
import { useWordList } from '@/integration/WordListProvider'
import { cn } from '@/lib/cn'
import { getTranslation } from '@/locale/getTranslation'
import type { Language } from '@/locale/language'
import { useNavigate } from '@tanstack/react-router'
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from 'convex/react'
import { Loader } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
    user: User
    language: Language
}

const BingoGame = ({ user, language }: Props) => {
    const t = getTranslation(language)
    const navigate = useNavigate({ from: '/play/bingo' })

    const dropArea = useRef<HTMLDivElement>(null)
    const scrollAreaMobile = useRef<HTMLDivElement>(null)
    const scrollAreaDesktop = useRef<HTMLDivElement>(null)
    const canvasArea = useRef<HTMLDivElement>(null)
    const listArea = useRef<HTMLDivElement>(null)
    const selectArea = useRef<HTMLDivElement>(null)

    const [draggingOverCanvas, setDraggingOverCanvas] = useState<boolean>(false)

    const { addWord } = useWordList()

    const completeObjective = useConvexMutation(api.bingo.completeObjective)
    const registerPresence = useConvexMutation(api.bingo.registerPresence)

    const game = useConvexQuery(api.bingo.get, { playerId: user._id })

    useEffect(() => {
        if (!game) navigate({ to: '/mode' })
        else if (game.game.winner) navigate({ to: '/win/bingo' })
        else {
            const isPlayer1 = game.game.player1Id === user._id

            if ((isPlayer1 && !game.game.player1Entered) || (!isPlayer1 && !game.game.player2Entered))
                registerPresence({ gameId: game.game._id, isPlayer1 })
        }
    }, [game, navigate, registerPresence, user])

    const checkObjectives = useCallback(
        async (createdWord: CreateWord) => {
            if (!game) return false

            const completedObjective = game.objectives.find(
                objective => !objective.playerId && objective.text === createdWord.text,
            )
            if (!completedObjective) return false

            await completeObjective({ gameId: game.game._id, playerId: user._id, objectiveId: completedObjective._id })
            return true
        },
        [completeObjective, game, user],
    )

    if (!game || !game.game.player1Entered || !game.game.player2Entered)
        return (
            <div className="relative flex size-full items-center justify-center pt-8">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-80">
                    <Loader className="size-12 animate-spin" />
                    <p>{t.bingo.loading}</p>
                </div>
            </div>
        )

    return (
        <WordInstancesProvider onCombine={addWord} user={user} getGameQuery={api.bingo.get}>
            <div className="flex size-full flex-col items-center justify-center lg:flex-row" ref={dropArea}>
                <div className="w-full grow lg:h-full lg:w-[unset]">
                    <div
                        className={cn(
                            'id mx-auto flex h-fit w-full flex-col items-center gap-3 border-b border-neutral-500/50 p-3 lg:grid-cols-3 dark:border-neutral-500/30',
                            'h-[233px] max-h-[233px] min-h-[233px]',
                            'sm:h-[209px] sm:max-h-[209px] sm:min-h-[209px]',
                            'lg:h-[157px] lg:max-h-[157px] lg:min-h-[157px]',
                        )}
                        ref={selectArea}
                    >
                        <div className="flex h-fit w-full max-w-3xl flex-col justify-between sm:flex-row sm:items-center sm:gap-3">
                            <h2 className="font-goldman w-full text-xl tracking-wide whitespace-nowrap text-sky-600 opacity-80 dark:text-sky-500">
                                {t.bingo.objectives}
                            </h2>

                            <div className="flex h-fit w-fit items-center gap-4">
                                <div className="flex w-fit items-center justify-center gap-2">
                                    <span className="font-medium whitespace-nowrap capitalize">{t.bingo.you}:</span>

                                    <div
                                        className={cn(
                                            'size-4 max-h-4 min-h-4 max-w-4 min-w-4 rounded-full border',
                                            'border-green-600/60 bg-green-400/10',
                                            'dark:border-green-900/80 dark:bg-green-900/20',
                                        )}
                                    />
                                </div>

                                <div className="flex w-fit items-center justify-center gap-2">
                                    <span className="font-medium whitespace-nowrap capitalize">
                                        {t.bingo.opponent}:
                                    </span>

                                    <div
                                        className={cn(
                                            'size-4 max-h-4 min-h-4 max-w-4 min-w-4 rounded-full border',
                                            'border-red-600/40 bg-red-400/10',
                                            'dark:border-red-900/80 dark:bg-red-900/20',
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid w-full max-w-3xl grid-cols-2 gap-3 lg:grid-cols-3">
                            {game.objectives.map(objective => (
                                <div
                                    key={objective._id}
                                    className={cn(
                                        'relative h-10 max-h-10 min-h-10 border py-2',
                                        // 'border-sky-500/80 bg-sky-500/10',
                                        // 'dark:border-sky-900/80 dark:bg-sky-900/20',
                                        'bg-neutral-150 border-neutral-400/50',
                                        'dark:border-neutral-700/50 dark:bg-neutral-900',

                                        objective.playerId === user._id && 'border-green-600/60 bg-green-400/10',
                                        objective.playerId === user._id &&
                                            'dark:border-green-900/80 dark:bg-green-900/20',

                                        objective.playerId &&
                                            objective.playerId !== user._id &&
                                            'border-red-600/40 bg-red-400/10',
                                        objective.playerId &&
                                            objective.playerId !== user._id &&
                                            'dark:border-red-900/80 dark:bg-red-900/20',
                                    )}
                                >
                                    <Marquee>
                                        <div className="flex size-full items-center justify-center gap-2">
                                            <span>{objective.icon}</span>

                                            <span className="font-medium whitespace-nowrap capitalize">
                                                {objective.text}
                                            </span>
                                        </div>
                                    </Marquee>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className={cn(
                            'w-full',
                            'h-[calc(100%-233px)] max-h-[calc(100%-233px)] min-h-[calc(100%-233px)]',
                            'sm:h-[calc(100%-209px)] sm:max-h-[calc(100%-209px)] sm:min-h-[calc(100%-209px)]',
                            'lg:h-[calc(100%-157px)] lg:max-h-[calc(100%-157px)] lg:min-h-[calc(100%-157px)]',
                        )}
                    >
                        <Canvas
                            innerRef={canvasArea}
                            draggingOverCanvas={draggingOverCanvas}
                            setDraggingOverCanvas={setDraggingOverCanvas}
                            onCombine={checkObjectives}
                        />
                    </div>
                </div>

                <List
                    scrollAreaMobile={scrollAreaMobile}
                    scrollAreaDesktop={scrollAreaDesktop}
                    listArea={listArea}
                    canvasArea={canvasArea}
                    setDraggingOverCanvas={setDraggingOverCanvas}
                    language={language}
                    onCombine={checkObjectives}
                />
            </div>
        </WordInstancesProvider>
    )
}

export default BingoGame
