import { default as Canvas } from '@/component/Canvas'
import List from '@/component/List'
import { api } from '@/db/_generated/api'
import type { User } from '@/db/username'
import { WordInstancesProvider } from '@/integration/WordInstancesProvider'
import { useWordList } from '@/integration/WordListProvider'
import type { Language } from '@/locale/language'
import { useNavigate } from '@tanstack/react-router'
import { useQuery as useConvexQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'

interface Props {
    user: User
    language: Language
}

const ClassicGame = ({ user, language }: Props) => {
    const navigate = useNavigate({ from: '/play/classic' })

    const dropArea = useRef<HTMLDivElement>(null)
    const scrollAreaMobile = useRef<HTMLDivElement>(null)
    const scrollAreaDesktop = useRef<HTMLDivElement>(null)
    const canvasArea = useRef<HTMLDivElement>(null)
    const listArea = useRef<HTMLDivElement>(null)

    const [draggingOverCanvas, setDraggingOverCanvas] = useState<boolean>(false)

    const { addWord } = useWordList()

    const game = useConvexQuery(api.classic.get, { playerId: user._id })
    useEffect(() => {
        if (!game) navigate({ to: '/mode' })
    }, [game, navigate])

    return (
        <WordInstancesProvider onCombine={addWord} user={user} getGameQuery={api.classic.get}>
            <div className="flex size-full flex-col items-center justify-center lg:flex-row" ref={dropArea}>
                <div className="w-full grow lg:h-full lg:w-[unset]">
                    <div className="size-full max-h-full min-h-full">
                        <Canvas
                            innerRef={canvasArea}
                            draggingOverCanvas={draggingOverCanvas}
                            setDraggingOverCanvas={setDraggingOverCanvas}
                            onCombine={() => Promise.resolve(false)}
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
                    onCombine={() => Promise.resolve(false)}
                />
            </div>
        </WordInstancesProvider>
    )
}

export default ClassicGame
