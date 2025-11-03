import Word from '@/component/Word'
import { useWordInstances, WordInstance } from '@/integration/WordInstancesProvider'
import { clamp } from '@/lib/clamp'
import { cn } from '@/lib/cn'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { RefObject, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

interface Props {
    word: string
    icon: string
    canvasArea: RefObject<HTMLDivElement>
    scrollArea: RefObject<HTMLDivElement>
    isMobile?: boolean
}

const ListWord = ({ word, icon, canvasArea, scrollArea, isMobile = false }: Props) => {
    const { addInstance, getOverlappingWord, clearOverlapped, combine } = useWordInstances()

    const [activeInstance, setActiveInstance] = useState<boolean>(false)
    const wordRef = useRef<HTMLDivElement>(null)
    const clickOffset = useRef({ x: 0, y: 0, width: 0, height: 0 })
    const isDragging = useRef(false)

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0, reset: true }))

    const scrollTop = isMobile ? 0 : (scrollArea.current?.scrollTop ?? 0)
    const scrollLeft = isMobile ? (scrollArea.current?.scrollLeft ?? 0) : 0

    const bind = useDrag(
        ({ down, offset: [ox, oy], xy: [x, y], first, last, movement: [mx, my] }) => {
            const updatedWord: WordInstance = {
                id: uuid(),
                text: word,
                icon,
                x: x - clickOffset.current.x,
                y: y - clickOffset.current.y,
                width: clickOffset.current.width,
                height: clickOffset.current.height,
            }

            const overlappingWord = getOverlappingWord(updatedWord)

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

                    const insideCanvas = !(
                        updatedWord.x + updatedWord.width < canvasRect.x ||
                        canvasRect.x + canvasRect.width < updatedWord.x ||
                        updatedWord.y + updatedWord.height < canvasRect.y ||
                        canvasRect.y + canvasRect.height < updatedWord.y
                    )

                    if (insideCanvas) {
                        const newWordInstance: WordInstance = {
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
                        }

                        if (overlappingWord) combine(overlappingWord, newWordInstance)
                        else addInstance(newWordInstance)
                    }
                }

                clearOverlapped()
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
                        id: uuid(),
                        text: word,
                        icon,
                        x: canvasRect.x + padding + Math.random() * (canvasRect.width - wordRect.width - padding * 2),
                        y: canvasRect.y + padding + Math.random() * (canvasRect.height - wordRect.height - padding * 2),
                        width: wordRect.width,
                        height: wordRect.height,
                    })
                }
            }}
        >
            {activeInstance && (
                <animated.div
                    style={{ x: x.to(value => value - scrollLeft), y: y.to(value => value - scrollTop) }}
                    className="absolute z-20"
                >
                    <Word word={word} icon={icon} className="bg-neutral-700" />
                </animated.div>
            )}

            <Word word={word} icon={icon} />
        </div>
    )
}

export default ListWord
