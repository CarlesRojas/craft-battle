import { CANVAS_PADDING } from '@/component/Canvas'
import WordCapsule from '@/component/WordCapsule'
import type { Doc, Id } from '@/db/_generated/dataModel'
import type { WordInstance } from '@/db/instance'
import type { CreateWord } from '@/db/word'
import { Sound, useAudio } from '@/integration/AudioProvider'
import { useWordInstances } from '@/integration/WordInstancesProvider'
import { clamp } from '@/lib/clamp'
import { cn } from '@/lib/cn'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import type { RefObject } from 'react'
import { useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

interface Props {
    word: Doc<'word'>
    canvasArea: RefObject<HTMLDivElement | null>
    scrollArea: RefObject<HTMLDivElement | null>
    setDraggingOverCanvas: (draggingOverCanvas: boolean) => void
    onCombine: (resultingWord: CreateWord) => Promise<boolean>
}

const ListWord = ({ word, canvasArea, scrollArea, setDraggingOverCanvas, onCombine }: Props) => {
    const { addInstance, getOverlappingInstance, clearOverlapped, combine } = useWordInstances()
    const { play } = useAudio()

    const [activeInstance, setActiveInstance] = useState<boolean>(false)
    const wordRef = useRef<HTMLDivElement>(null)
    const clickOffset = useRef({ x: 0, y: 0, width: 0, height: 0 })
    const isDragging = useRef(false)

    const [spring, api] = useSpring(() => ({ x: 0, y: 0, reset: true }))

    const scrollTop = scrollArea.current?.scrollTop ?? 0

    const bind = useDrag(
        async ({ down, offset: [ox, oy], xy: [x, y], first, last, movement: [mx, my] }) => {
            const updatedInstance: WordInstance = {
                ...word,
                _id: `temporal-id-${uuid()}` as Id<'instance'>,
                wordId: word._id,
                x: x - clickOffset.current.x,
                y: y - clickOffset.current.y,
                width: clickOffset.current.width,
                height: clickOffset.current.height,
            }

            const overlappingInstance = getOverlappingInstance(updatedInstance)

            if (first) {
                play(Sound.CLICK)
                isDragging.current = false
                setActiveInstance(true)

                if (!wordRef.current) return
                const wordRect = wordRef.current.getBoundingClientRect()

                clickOffset.current = {
                    x: x - wordRect.left,
                    y: y - wordRect.top,
                    width: wordRect.width,
                    height: wordRect.height,
                }
            }

            if (Math.abs(mx) > 3 || Math.abs(my) > 3) isDragging.current = true

            let insideCanvas = false
            if (canvasArea.current && isDragging.current) {
                const canvasRect = canvasArea.current.getBoundingClientRect()

                insideCanvas = !(
                    updatedInstance.x + updatedInstance.width < canvasRect.x ||
                    canvasRect.x + canvasRect.width < updatedInstance.x ||
                    updatedInstance.y + updatedInstance.height < canvasRect.y ||
                    canvasRect.y + canvasRect.height < updatedInstance.y
                )

                setDraggingOverCanvas(insideCanvas)
            }

            if (last) {
                setActiveInstance(false)

                if (canvasArea.current && isDragging.current && insideCanvas) {
                    const canvasRect = canvasArea.current.getBoundingClientRect()

                    const newInstance: WordInstance = {
                        ...updatedInstance,
                        x: clamp(
                            x - clickOffset.current.x,
                            canvasRect.x + CANVAS_PADDING,
                            canvasRect.x + canvasRect.width - clickOffset.current.width - CANVAS_PADDING,
                        ),
                        y: clamp(
                            y - clickOffset.current.y,
                            canvasRect.y + CANVAS_PADDING,
                            canvasRect.y + canvasRect.height - clickOffset.current.height - CANVAS_PADDING,
                        ),
                    }

                    if (overlappingInstance) {
                        play(Sound.BUBBLE)
                        const { isNew, word: combinedWord } = await combine(overlappingInstance, newInstance)
                        const isObjective = await onCombine(combinedWord)
                        if (isObjective)
                            play(Sound.PING) // TODO add a better sound
                        else if (isNew) play(Sound.PING)
                    } else addInstance(newInstance)
                } else if (canvasArea.current && isDragging.current) play(Sound.CLEAR)

                clearOverlapped()
                setDraggingOverCanvas(false)
                api.stop()
            }

            api.start({ x: ox, y: oy, immediate: down })
        },
        { from: () => [0, 0] },
    )

    return (
        <div
            {...bind()}
            ref={wordRef}
            className={cn('h-fit cursor-grab touch-none')}
            onClick={() => {
                const canvasRect = canvasArea.current?.getBoundingClientRect()

                if (!isDragging.current && canvasRect && wordRef.current) {
                    const wordRect = wordRef.current.getBoundingClientRect()
                    const padding = 8

                    addInstance({
                        wordId: word._id,
                        x: canvasRect.x + padding + Math.random() * (canvasRect.width - wordRect.width - padding * 2),
                        y: canvasRect.y + padding + Math.random() * (canvasRect.height - wordRect.height - padding * 2),
                        width: wordRect.width,
                        height: wordRect.height,
                        ...word,
                        _id: `temporal-id-${uuid()}` as Id<'instance'>,
                    })
                }
            }}
        >
            {activeInstance && (
                <animated.div
                    style={{ x: spring.x, y: spring.y.to(value => value - scrollTop) }}
                    className="absolute z-20"
                >
                    <WordCapsule word={word} className="bg-neutral-200 dark:bg-neutral-800" />
                </animated.div>
            )}

            <WordCapsule word={word} />
        </div>
    )
}

export default ListWord
