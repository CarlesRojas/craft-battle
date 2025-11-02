import Word from '@/component/Word'
import { useWordInstances } from '@/integration/WordInstancesProvider'
import { clamp } from '@/lib/clamp'
import { cn } from '@/lib/cn'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { RefObject, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

interface Props {
    word: string
    canvasArea: RefObject<HTMLDivElement>
    scrollArea: RefObject<HTMLDivElement>
    isMobile?: boolean
}

const ListWord = ({ word, canvasArea, scrollArea, isMobile = false }: Props) => {
    const { addInstance } = useWordInstances()

    const [activeInstance, setActiveInstance] = useState<boolean>(false)
    const wordRef = useRef<HTMLDivElement>(null)
    const clickOffset = useRef({ x: 0, y: 0, width: 0, height: 0 })
    const isDragging = useRef(false)

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0, reset: true }))

    const scrollTop = isMobile ? 0 : (scrollArea.current?.scrollTop ?? 0)
    const scrollLeft = isMobile ? (scrollArea.current?.scrollLeft ?? 0) : 0
    const canvasRect = canvasArea.current?.getBoundingClientRect()

    const bind = useDrag(
        ({ down, offset: [ox, oy], xy: [x, y], first, last, movement: [mx, my] }) => {
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

            if (last) {
                setActiveInstance(false)

                if (canvasArea.current && isDragging.current) {
                    const canvasRect = canvasArea.current.getBoundingClientRect()

                    const wordRect = {
                        x: x - clickOffset.current.x,
                        y: y - clickOffset.current.y,
                        width: clickOffset.current.width,
                        height: clickOffset.current.height,
                    }

                    const overlapping = !(
                        wordRect.x + wordRect.width < canvasRect.x ||
                        canvasRect.x + canvasRect.width < wordRect.x ||
                        wordRect.y + wordRect.height < canvasRect.y ||
                        canvasRect.y + canvasRect.height < wordRect.y
                    )

                    if (overlapping)
                        addInstance({
                            id: uuid(),
                            text: word,
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
            className={cn(isMobile && 'touch-pan-x', !isMobile && 'cursor-grab touch-none')}
            onClick={() => {
                if (!isDragging.current && canvasRect && wordRef.current) {
                    const wordRect = wordRef.current.getBoundingClientRect()
                    const padding = 8

                    addInstance({
                        id: uuid(),
                        text: word,
                        x: canvasRect.x + padding + Math.random() * (canvasRect.width - wordRect.width - padding * 2),
                        y: canvasRect.y + padding + Math.random() * (canvasRect.height - wordRect.height - padding * 2),
                    })
                }
            }}
        >
            {activeInstance && (
                <animated.div
                    style={{ x: x.to(value => value - scrollLeft), y: y.to(value => value - scrollTop) }}
                    className="absolute"
                >
                    <Word word={word} className="bg-neutral-700" />
                </animated.div>
            )}

            <Word word={word} />
        </div>
    )
}

export default ListWord
