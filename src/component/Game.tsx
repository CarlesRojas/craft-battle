import { default as Canvas } from '@/component/Canvas'
import List from '@/component/List'
import type { User } from '@/db/username'
import { WordInstancesProvider } from '@/integration/WordInstancesProvider'
import { useWordList } from '@/integration/WordListProvider'
import type { Language } from '@/locale/language'
import { useRef, useState } from 'react'

interface Props {
    user: User
    language: Language
}

const Game = ({ user, language }: Props) => {
    const dropArea = useRef<HTMLDivElement>(null)
    const scrollAreaMobile = useRef<HTMLDivElement>(null)
    const scrollAreaDesktop = useRef<HTMLDivElement>(null)
    const canvasArea = useRef<HTMLDivElement>(null)
    const listArea = useRef<HTMLDivElement>(null)

    const [draggingOverCanvas, setDraggingOverCanvas] = useState<boolean>(false)

    const { addWord } = useWordList()

    return (
        <WordInstancesProvider onCombine={addWord} user={user}>
            <div className="flex size-full flex-col items-center justify-center lg:flex-row" ref={dropArea}>
                <div className="w-full grow lg:h-full lg:w-[unset]">
                    <div className="size-full max-h-full min-h-full">
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

export default Game
