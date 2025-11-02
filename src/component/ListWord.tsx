import { useWordInstances } from '@/integration/InstancesProvider'
import { clamp } from '@/lib/clamp'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { RefObject, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

interface ListWordProps {
    word: string
    dropArea: RefObject<HTMLDivElement>
    canvasArea: RefObject<HTMLDivElement>
    listArea: RefObject<HTMLDivElement>
}

const ListWord = ({ word, dropArea, canvasArea, listArea }: ListWordProps) => {
    const { addInstance } = useWordInstances()

    const [activeInstance, setActiveInstance] = useState<boolean>(false)
    const wordRef = useRef<HTMLDivElement>(null)
    const clickOffset = useRef({ x: 0, y: 0, width: 0, height: 0 })

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0, reset: true }))

    const bind = useDrag(
        ({ down, offset: [ox, oy], xy: [x, y], first, last }) => {
            if (first) {
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

            if (last) {
                setActiveInstance(false)

                if (listArea.current && canvasArea.current) {
                    const listRect = listArea.current.getBoundingClientRect()
                    const canvasRect = canvasArea.current.getBoundingClientRect()

                    const wordRect = {
                        x: x - clickOffset.current.x,
                        y: y - clickOffset.current.y,
                        width: clickOffset.current.width,
                        height: clickOffset.current.height,
                    }

                    const overlapping = !(
                        wordRect.x + wordRect.width < listRect.x ||
                        listRect.x + listRect.width < wordRect.x ||
                        wordRect.y + wordRect.height < listRect.y ||
                        listRect.y + listRect.height < wordRect.y
                    )

                    if (!overlapping)
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
            }

            api.start({ x: ox, y: oy, immediate: down })
        },
        { bounds: dropArea, from: () => [0, 0] },
    )

    return (
        <div
            {...bind()}
            ref={wordRef}
            className="flex h-8 w-fit cursor-grab items-center justify-center rounded bg-red-950 px-4"
        >
            {activeInstance && (
                <animated.div
                    style={{ x, y }}
                    className="absolute flex h-8 w-fit cursor-grab items-center justify-center rounded bg-red-950 px-4"
                >
                    {word}
                </animated.div>
            )}

            {word}
        </div>
    )
}

export default ListWord
