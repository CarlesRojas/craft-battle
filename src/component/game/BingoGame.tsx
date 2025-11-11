import { default as Canvas } from '@/component/Canvas'
import List from '@/component/List'
import { api } from '@/db/_generated/api'
import type { User } from '@/db/username'
import { WordInstancesProvider } from '@/integration/WordInstancesProvider'
import { useWordList } from '@/integration/WordListProvider'
import type { Language } from '@/locale/language'
import { useRef, useState } from 'react'

interface Props {
    user: User
    language: Language
}

const BingoGame = ({ user, language }: Props) => {
    const dropArea = useRef<HTMLDivElement>(null)
    const scrollAreaMobile = useRef<HTMLDivElement>(null)
    const scrollAreaDesktop = useRef<HTMLDivElement>(null)
    const canvasArea = useRef<HTMLDivElement>(null)
    const listArea = useRef<HTMLDivElement>(null)
    const selectArea = useRef<HTMLDivElement>(null)

    const [draggingOverCanvas, setDraggingOverCanvas] = useState<boolean>(false)

    const { addWord } = useWordList()

    return (
        <WordInstancesProvider onCombine={addWord} user={user} getGameQuery={api.bingo.get}>
            <div className="flex size-full flex-col items-center justify-center lg:flex-row" ref={dropArea}>
                <div className="w-full grow lg:h-full lg:w-[unset]">
                    <div className="h-28 max-h-28 min-h-28 w-full bg-orange-500/10" ref={selectArea}>
                        {/* TODO add objective words for the bingo */}
                    </div>

                    <div className="h-[calc(100%-7rem)] max-h-[calc(100%-7rem)] min-h-[calc(100%-7rem)] w-full">
                        <Canvas
                            innerRef={canvasArea}
                            draggingOverCanvas={draggingOverCanvas}
                            setDraggingOverCanvas={setDraggingOverCanvas}
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
                />
            </div>
        </WordInstancesProvider>
    )
}

export default BingoGame
