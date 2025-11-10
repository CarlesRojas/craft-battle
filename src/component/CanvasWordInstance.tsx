import { CANVAS_PADDING } from '@/component/Canvas'
import WordCapsule from '@/component/WordCapsule'
import type { Id } from '@/db/_generated/dataModel'
import type { WordInstance } from '@/db/instance'
import { Sound, useAudio } from '@/integration/AudioProvider'
import { useWordInstances } from '@/integration/WordInstancesProvider'
import { clamp } from '@/lib/clamp'
import { cn } from '@/lib/cn'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import type { MouseEvent, RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

interface Props {
    instance: WordInstance
    canvasArea: RefObject<HTMLDivElement | null>
    isMobile?: boolean
    isLoading?: boolean
    setDraggingOverCanvas: (draggingOverCanvas: boolean) => void
}

const CanvasWordInstance = ({ instance, canvasArea, isLoading = false, setDraggingOverCanvas }: Props) => {
    const {
        overlappedInstanceId,
        getOverlappingInstance,
        clearOverlapped,
        combine,
        removeInstance,
        updateSize,
        addInstance,
    } = useWordInstances()
    const { play } = useAudio()

    const [isDragging, setIsDragging] = useState(false)

    const instanceRef = useRef<HTMLDivElement>(null)
    const clickOffset = useRef({ x: 0, y: 0, width: 0, height: 0 })

    const [spring, api] = useSpring(() => ({ x: 0, y: 0, reset: true }))

    const bind = useDrag(
        async ({ down, offset: [ox, oy], xy: [x, y], first, last }) => {
            const updatedInstance: WordInstance = {
                ...instance,
                x: x - clickOffset.current.x,
                y: y - clickOffset.current.y,
                width: clickOffset.current.width,
                height: clickOffset.current.height,
            }

            const overlappingInstance = getOverlappingInstance(updatedInstance)

            if (first) {
                play(Sound.CLICK)
                setIsDragging(true)
                if (!instanceRef.current) return
                const wordRect = instanceRef.current.getBoundingClientRect()

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
                    updatedInstance.x + updatedInstance.width < canvasRect.x ||
                    canvasRect.x + canvasRect.width < updatedInstance.x ||
                    updatedInstance.y + updatedInstance.height < canvasRect.y ||
                    canvasRect.y + canvasRect.height < updatedInstance.y
                )

                setDraggingOverCanvas(insideCanvas)
            }

            if (last) {
                if (canvasArea.current) {
                    const canvasRect = canvasArea.current.getBoundingClientRect()

                    if (!insideCanvas) {
                        play(Sound.CLEAR)
                        removeInstance(instance._id)
                    } else if (overlappingInstance) {
                        play(Sound.BUBBLE)
                        const isNew = await combine(overlappingInstance, updatedInstance)
                        if (isNew) play(Sound.PING)
                    } else
                        updateSize({
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
    }, [instance.x, instance.y, api])

    const onRightClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        const canvasRect = canvasArea.current?.getBoundingClientRect()

        if (canvasRect && instanceRef.current) {
            play(Sound.CLICK)
            const wordRect = instanceRef.current.getBoundingClientRect()

            addInstance({
                ...instance,
                wordId: instance.wordId,
                x: clamp(
                    wordRect.x + 6,
                    canvasRect.x + CANVAS_PADDING,
                    canvasRect.x + canvasRect.width - CANVAS_PADDING,
                ),
                y: clamp(
                    wordRect.y + 6,
                    canvasRect.y + CANVAS_PADDING,
                    canvasRect.y + canvasRect.height - CANVAS_PADDING,
                ),

                width: wordRect.width,
                height: wordRect.height,
                _id: `temporal-id-${uuid()}` as Id<'instance'>,
            })
        }
    }

    const onMiddleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.button === 1) {
            e.preventDefault()

            play(Sound.CLEAR)
            removeInstance(instance._id)
        }
    }

    return (
        <animated.div
            {...bind()}
            ref={instanceRef}
            style={{ ...spring }}
            onContextMenu={onRightClick}
            onMouseDown={onMiddleClick}
            className={cn(
                'absolute z-10 cursor-grab touch-none',
                isDragging && 'z-30',
                isLoading && 'pointer-events-none',
            )}
        >
            <WordCapsule
                instanceId={instance._id}
                word={{ ...instance, _id: instance.wordId }}
                className={
                    overlappedInstanceId === instance._id
                        ? 'border-sky-400 bg-sky-200 dark:border-sky-800 dark:bg-sky-950'
                        : ''
                }
                isLoading={isLoading}
                isNewCombination={instance.width === 0 && instance.height === 0}
                canvasRef={canvasArea}
            />
        </animated.div>
    )
}

export default CanvasWordInstance
