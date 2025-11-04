import WordCapsule from '@/component/WordCapsule'
import type { WordInstance } from '@/integration/WordInstancesProvider'
import { useWordInstances } from '@/integration/WordInstancesProvider'
import { clamp } from '@/lib/clamp'
import { cn } from '@/lib/cn'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

interface Props {
    word: WordInstance
    canvasArea: RefObject<HTMLDivElement | null>
    isMobile?: boolean
    setDraggingOverCanvas: (draggingOverCanvas: boolean) => void
}

const CanvasWord = ({ word, canvasArea, setDraggingOverCanvas }: Props) => {
    const { overlappedWordId, getOverlappingWord, clearOverlapped, combine, removeInstance, updateSize } =
        useWordInstances()

    const [isDragging, setIsDragging] = useState(false)

    const wordRef = useRef<HTMLDivElement>(null)
    const clickOffset = useRef({ x: 0, y: 0, width: 0, height: 0 })

    const [spring, api] = useSpring(() => ({ x: 0, y: 0, reset: true }))

    const bind = useDrag(
        ({ down, offset: [ox, oy], xy: [x, y], first, last }) => {
            const updatedWord: WordInstance = {
                ...word,
                x: x - clickOffset.current.x,
                y: y - clickOffset.current.y,
                width: clickOffset.current.width,
                height: clickOffset.current.height,
            }

            const overlappingWord = getOverlappingWord(updatedWord)

            if (first) {
                setIsDragging(true)
                if (!wordRef.current) return
                const wordRect = wordRef.current.getBoundingClientRect()

                clickOffset.current = {
                    x: x - wordRect.left,
                    y: y - wordRect.top,
                    width: wordRect.width,
                    height: wordRect.height,
                }
            }

            let insideCanvas = false
            if (canvasArea.current) {
                const canvasRect = canvasArea.current.getBoundingClientRect()

                insideCanvas = !(
                    updatedWord.x + updatedWord.width < canvasRect.x ||
                    canvasRect.x + canvasRect.width < updatedWord.x ||
                    updatedWord.y + updatedWord.height < canvasRect.y ||
                    canvasRect.y + canvasRect.height < updatedWord.y
                )

                setDraggingOverCanvas(insideCanvas)
            }

            if (last) {
                if (canvasArea.current) {
                    const canvasRect = canvasArea.current.getBoundingClientRect()

                    if (!insideCanvas) removeInstance(word.id)
                    else if (overlappingWord) combine(overlappingWord, updatedWord)
                    else
                        updateSize({
                            ...updatedWord,
                            x: clamp(
                                x - clickOffset.current.x,
                                canvasRect.x,
                                canvasRect.x + canvasRect.width - clickOffset.current.width,
                            ),
                            y: clamp(
                                y - clickOffset.current.y,
                                canvasRect.y,
                                canvasRect.y + canvasRect.height - clickOffset.current.height,
                            ),
                        })
                }

                setIsDragging(false)
                setDraggingOverCanvas(false)
                clearOverlapped()
                api.stop()
            }

            api.start({ x: ox, y: oy, immediate: down })
        },
        { from: () => [0, 0] },
    )

    useEffect(() => {
        api.set({ x: 0, y: 0 })
    }, [word.x, word.y, api])

    return (
        <animated.div
            {...bind()}
            ref={wordRef}
            style={{ ...spring }}
            className={cn(
                'absolute z-10 cursor-grab touch-none',
                isDragging && 'z-30',
                word.isLoading && 'pointer-events-none',
            )}
        >
            <WordCapsule
                id={word.id}
                word={word.text}
                icon={word.icon}
                explanation={word.explanation}
                className={overlappedWordId === word.id ? 'border-sky-800 bg-sky-950' : ''}
                isLoading={word.isLoading}
                isNewCombination={word.width === 0 && word.height === 0}
            />
        </animated.div>
    )
}

export default CanvasWord
