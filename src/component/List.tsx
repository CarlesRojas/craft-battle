import ListFilter from '@/component/ListFilter'
import { default as ListWord } from '@/component/ListWord'
import { useWordList } from '@/integration/WordListProvider'
import type { Language } from '@/locale/language'
import type { RefObject } from 'react'

interface Props {
    scrollAreaMobile: RefObject<HTMLDivElement | null>
    scrollAreaDesktop: RefObject<HTMLDivElement | null>
    listArea: RefObject<HTMLDivElement | null>
    canvasArea: RefObject<HTMLDivElement | null>
    setDraggingOverCanvas: (draggingOverCanvas: boolean) => void
    language: Language
}

const List = ({
    scrollAreaMobile,
    scrollAreaDesktop,
    listArea,
    canvasArea,
    setDraggingOverCanvas,
    language,
}: Props) => {
    const { list } = useWordList()

    return (
        <div
            ref={listArea}
            className="relative h-fit w-full border-l border-neutral-500/50 lg:h-full lg:w-[unset] lg:max-w-96 lg:min-w-96 dark:border-neutral-500/30"
        >
            <div
                className="h-[calc(100%-4rem) hidden max-h-[calc(100%-4rem)] min-h-[calc(100%-4rem)] w-full overflow-y-auto p-3 lg:flex"
                ref={scrollAreaDesktop}
            >
                <div className="flex h-fit w-full flex-wrap gap-3 overflow-y-auto" ref={scrollAreaDesktop}>
                    {list.map(word => (
                        <ListWord
                            key={word._id}
                            word={word}
                            scrollArea={scrollAreaDesktop}
                            canvasArea={canvasArea}
                            setDraggingOverCanvas={setDraggingOverCanvas}
                        />
                    ))}
                </div>
            </div>

            <div
                className="grid h-52 max-h-52 min-h-52 w-full grid-rows-4 gap-3 overflow-x-auto border-t border-neutral-500/50 p-3 pb-0 lg:hidden dark:border-neutral-500/30"
                ref={scrollAreaMobile}
            >
                {Array.from({ length: 4 }, (_, mod) => (
                    <div className="flex gap-3" key={mod}>
                        {list.map(
                            (word, i) =>
                                i % 4 === mod && (
                                    <ListWord
                                        key={word._id}
                                        word={word}
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

            <div className="relative h-16 max-h-16 min-h-16 w-full">
                <ListFilter language={language} />
            </div>
        </div>
    )
}

export default List
