import { default as Canvas } from '@/component/Canvas'
import { default as ListWord } from '@/component/ListWord'
import { WordInstancesProvider } from '@/integration/WordInstancesProvider'
import { useWordList } from '@/integration/WordListProvider'
import { useRef, useState } from 'react'

const Game = () => {
    const dropArea = useRef<HTMLDivElement>(null)
    const scrollAreaMobile = useRef<HTMLDivElement>(null)
    const scrollAreaDesktop = useRef<HTMLDivElement>(null)
    const canvasArea = useRef<HTMLDivElement>(null)
    const listArea = useRef<HTMLDivElement>(null)
    const selectArea = useRef<HTMLDivElement>(null)

    const [draggingOverCanvas, setDraggingOverCanvas] = useState<boolean>(false)

    const { list, addWord } = useWordList()

    return (
        <WordInstancesProvider onCombine={addWord}>
            <div className="flex size-full flex-col items-center justify-center md:flex-row" ref={dropArea}>
                <div className="w-full grow md:h-full md:w-[unset]">
                    <div className="h-28 max-h-28 min-h-28 w-full bg-orange-500/10" ref={selectArea}></div>

                    <div className="h-[calc(100%-7rem)] max-h-[calc(100%-7rem)] min-h-[calc(100%-7rem)] w-full">
                        <Canvas
                            innerRef={canvasArea}
                            draggingOverCanvas={draggingOverCanvas}
                            setDraggingOverCanvas={setDraggingOverCanvas}
                        />
                    </div>
                </div>
                <div ref={listArea} className="relative h-fit w-full md:h-full md:w-[unset] md:max-w-96 md:min-w-96">
                    <div
                        className="h-[calc(100%-3rem) hidden max-h-[calc(100%-3rem)] min-h-[calc(100%-3rem)] w-full overflow-y-auto p-3 md:flex"
                        ref={scrollAreaDesktop}
                    >
                        <div className="flex h-fit w-full flex-wrap gap-3 overflow-y-auto" ref={scrollAreaDesktop}>
                            {list.map(word => (
                                <ListWord
                                    key={word.id}
                                    word={word.text}
                                    icon={word.icon}
                                    scrollArea={scrollAreaDesktop}
                                    canvasArea={canvasArea}
                                    setDraggingOverCanvas={setDraggingOverCanvas}
                                />
                            ))}
                        </div>
                    </div>

                    <div
                        className="grid h-55 max-h-55 min-h-55 w-full grid-rows-4 gap-3 overflow-x-auto p-3 md:hidden"
                        ref={scrollAreaMobile}
                    >
                        {Array.from({ length: 4 }, (_, mod) => (
                            <div className="flex gap-3">
                                {list.map(
                                    (word, i) =>
                                        i % 4 === mod && (
                                            <ListWord
                                                key={word.id}
                                                word={word.text}
                                                icon={word.icon}
                                                scrollArea={scrollAreaMobile}
                                                canvasArea={canvasArea}
                                                setDraggingOverCanvas={setDraggingOverCanvas}
                                                isMobile
                                            />
                                        ),
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="h-12 max-h-12 min-h-12 w-full bg-orange-500/10"></div>
                </div>
            </div>
        </WordInstancesProvider>
    )
}

export default Game
