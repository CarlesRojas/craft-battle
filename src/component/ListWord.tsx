import WordCapsule from '@/component/WordCapsule'
import { Doc, Id } from '@/db/_generated/dataModel'
import { WordInstance } from '@/db/instance'
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
    isMobile?: boolean
    setDraggingOverCanvas: (draggingOverCanvas: boolean) => void
}

const ListWord = ({ word, canvasArea, scrollArea, isMobile = false, setDraggingOverCanvas }: Props) => {
    const { addInstance, getOverlappingInstance, clearOverlapped, combine } = useWordInstances()

    const [activeInstance, setActiveInstance] = useState<boolean>(false)
    const wordRef = useRef<HTMLDivElement>(null)
    const clickOffset = useRef({ x: 0, y: 0, width: 0, height: 0 })
    const isDragging = useRef(false)

    const [spring, api] = useSpring(() => ({ x: 0, y: 0, reset: true }))

    const scrollTop = isMobile ? 0 : (scrollArea.current?.scrollTop ?? 0)
    const scrollLeft = isMobile ? (scrollArea.current?.scrollLeft ?? 0) : 0

    const bind = useDrag(
        ({ down, offset: [ox, oy], xy: [x, y], first, last, movement: [mx, my] }) => {
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
                            canvasRect.x,
                            canvasRect.x + canvasRect.width - clickOffset.current.width,
                        ),
                        y: clamp(
                            y - clickOffset.current.y,
                            canvasRect.y,
                            canvasRect.y + canvasRect.height - clickOffset.current.height,
                        ),
                    }

                    if (overlappingInstance) combine(overlappingInstance, newInstance)
                    else addInstance(newInstance)
                }

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
            className={cn('h-fit', isMobile && 'touch-pan-x', !isMobile && 'cursor-grab touch-none')}
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
                    style={{ x: spring.x.to(value => value - scrollLeft), y: spring.y.to(value => value - scrollTop) }}
                    className="absolute z-20"
                >
                    <WordCapsule word={word} className="bg-neutral-800" />
                </animated.div>
            )}

            <WordCapsule word={word} />
        </div>
    )
}

export default ListWord
