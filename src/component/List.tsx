import ListFilter from '@/component/ListFilter'
import { default as ListWord } from '@/component/ListWord'
import { Button } from '@/component/ui/button'
import { useWordList } from '@/integration/WordListProvider'
import type { Language } from '@/locale/language'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useRef, type RefObject } from 'react'
import { useDebounceCallback, useEventListener } from 'usehooks-ts'

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

    const currentStepIndex = useRef(0)

    const getSteps = () => {
        if (!scrollAreaMobile.current || !scrollAreaMobile.current.scrollHeight) return []

        return Array.from({ length: Math.floor(scrollAreaMobile.current.scrollHeight / 208) }, (_, i) => i * 208)
    }

    const scrollUp = () => {
        if (!scrollAreaMobile.current) return

        const steps = getSteps()
        if (currentStepIndex.current <= 0) return
        currentStepIndex.current = currentStepIndex.current - 1

        scrollAreaMobile.current.scrollTo({ top: steps[currentStepIndex.current], behavior: 'smooth' })
    }
    const scrollUpDebounced = useDebounceCallback(scrollUp, 300, { leading: true, maxWait: 300 })

    const scrollDown = () => {
        if (!scrollAreaMobile.current) return

        const steps = getSteps()
        if (currentStepIndex.current >= steps.length - 1) return
        currentStepIndex.current = currentStepIndex.current + 1

        scrollAreaMobile.current.scrollTo({ top: steps[currentStepIndex.current], behavior: 'smooth' })
    }
    const scrollDownDebounced = useDebounceCallback(scrollDown, 300, { leading: true, maxWait: 300 })

    const onResize = useDebounceCallback(() => {
        if (!scrollAreaMobile.current) return

        currentStepIndex.current = 0
        scrollAreaMobile.current.scrollTo({ top: 0, behavior: 'instant' })
    }, 300)

    useEventListener('resize', onResize)

    return (
        <div
            ref={listArea}
            className="relative h-fit w-full border-t border-neutral-500/50 lg:h-full lg:w-[unset] lg:max-w-96 lg:min-w-96 lg:border-t-0 lg:border-l dark:border-neutral-500/30"
        >
            <div
                className="h-[calc(100%-4rem) hidden max-h-[calc(100%-4rem)] min-h-[calc(100%-4rem)] w-full overflow-y-auto p-3 lg:flex"
                ref={scrollAreaDesktop}
            >
                <div className="flex h-fit w-full flex-wrap gap-3" ref={scrollAreaDesktop}>
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

            <div className="flex h-52 max-h-52 min-h-52 w-full pb-0 lg:hidden">
                <div
                    className="flex h-52 max-h-52 min-h-52 w-[calc(100%-3.25rem)] max-w-[calc(100%-3.25rem)] min-w-[calc(100%-3.25rem)] flex-wrap gap-3 overflow-hidden p-3 !pb-42"
                    ref={scrollAreaMobile}
                >
                    {list.map(word => (
                        <ListWord
                            key={word._id}
                            word={word}
                            scrollArea={scrollAreaMobile}
                            canvasArea={canvasArea}
                            setDraggingOverCanvas={setDraggingOverCanvas}
                        />
                    ))}
                </div>

                <div className="flex h-52 max-h-52 min-h-52 w-13 max-w-13 min-w-13 flex-col items-center justify-center gap-3 py-3 pr-3">
                    <Button size="icon" variant="ghost" onClick={scrollUpDebounced}>
                        <ArrowUp className="size-5" />
                    </Button>

                    <Button size="icon" variant="ghost" onClick={scrollDownDebounced}>
                        <ArrowDown className="size-5" />
                    </Button>
                </div>
            </div>

            <div className="relative h-16 max-h-16 min-h-16 w-full">
                <ListFilter language={language} />
            </div>
        </div>
    )
}

export default List
