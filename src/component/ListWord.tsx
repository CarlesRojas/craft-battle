import { useWordInstances } from '@/integration/InstancesProvider'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { RefObject, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

interface ListWordProps {
    word: string
    dropArea: RefObject<HTMLDivElement>
}

const ListWord = ({ word, dropArea }: ListWordProps) => {
    const { addInstance } = useWordInstances()

    const [activeInstance, setActiveInstance] = useState<boolean>(false)
    const wordRef = useRef<HTMLDivElement>(null)
    const clickOffset = useRef({ x: 0, y: 0 })

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

    const bind = useDrag(
        ({ down, offset: [ox, oy], xy: [x, y], first, last }) => {
            if (first) {
                console.log('first', first)
                setActiveInstance(true)

                if (!wordRef.current) return

                const wordRect = wordRef.current.getBoundingClientRect()
                clickOffset.current = { x: x - wordRect.left, y: y - wordRect.top }
            }

            if (last) {
                setActiveInstance(false)
                addInstance({ id: uuid(), text: word, x: x - clickOffset.current.x, y: y - clickOffset.current.y })
            }

            api.start({ x: ox, y: oy, immediate: down })
        },
        { bounds: dropArea },
    )

    return (
        <div
            {...bind()}
            ref={wordRef}
            className="flex h-8 w-fit cursor-grab items-center justify-center rounded bg-red-950 px-4 hover:bg-red-900"
        >
            {activeInstance && (
                <animated.div
                    style={{ x, y }}
                    className="absolute flex h-8 w-fit cursor-grab items-center justify-center rounded bg-red-950 px-4 hover:bg-red-900"
                >
                    {word}
                </animated.div>
            )}

            {word}
        </div>
    )
}

export default ListWord
