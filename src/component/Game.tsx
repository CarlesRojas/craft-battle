import { default as Canvas } from '@/component/Canvas'
import List from '@/component/List'
import type { User } from '@/db/username'
import { WordInstancesProvider } from '@/integration/WordInstancesProvider'
import { useWordList } from '@/integration/WordListProvider'
import { useRef, useState } from 'react'

interface Props {
    user: User
}

const Game = ({ user }: Props) => {
    const dropArea = useRef<HTMLDivElement>(null)
    const scrollAreaMobile = useRef<HTMLDivElement>(null)
    const scrollAreaDesktop = useRef<HTMLDivElement>(null)
    const canvasArea = useRef<HTMLDivElement>(null)
    const listArea = useRef<HTMLDivElement>(null)

    const [draggingOverCanvas, setDraggingOverCanvas] = useState<boolean>(false)

    const { list, addWord } = useWordList()

    return (
        <WordInstancesProvider onCombine={addWord} user={user}>
            <div className="flex size-full flex-col items-center justify-center md:flex-row" ref={dropArea}>
                <div className="w-full grow md:h-full md:w-[unset]">
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
                />
            </div>
        </WordInstancesProvider>
    )
}

export default Game
