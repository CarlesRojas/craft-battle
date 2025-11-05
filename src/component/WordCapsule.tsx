import { CANVAS_PADDING } from '@/component/Canvas'
import type { Doc, Id } from '@/db/_generated/dataModel'
import { Sound, useAudio } from '@/integration/AudioProvider'
import { useWordInstances } from '@/integration/WordInstancesProvider'
import { clamp } from '@/lib/clamp'
import { cn } from '@/lib/cn'
import { animated } from '@react-spring/web'
import { Loader } from 'lucide-react'
import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

interface Props {
    word: Doc<'word'>
    instanceId?: Id<'instance'>
    isLoading?: boolean
    className?: string
    isNewCombination?: boolean
    canvasRef?: RefObject<HTMLDivElement | null>
}

const WordCapsule = ({
    word,
    instanceId,
    className,
    isLoading = false,
    isNewCombination = false,
    canvasRef,
}: Props) => {
    const { updateSize } = useWordInstances()
    const { play } = useAudio()

    const wordRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (
            !isNewCombination ||
            !wordRef.current ||
            !canvasRef?.current ||
            !instanceId ||
            instanceId.startsWith('temporal-id')
        )
            return

        const wordRect = wordRef.current.getBoundingClientRect()
        const canvasRect = canvasRef.current.getBoundingClientRect()

        updateSize({
            _id: instanceId,
            width: wordRect.width,
            height: wordRect.height,
            x: clamp(
                wordRect.x,
                canvasRect.x + CANVAS_PADDING,
                canvasRect.x + canvasRect.width - wordRect.width - CANVAS_PADDING,
            ),
            y: clamp(
                wordRect.y,
                canvasRect.y + CANVAS_PADDING,
                canvasRect.y + canvasRect.height - wordRect.height - CANVAS_PADDING,
            ),
        })
    }, [instanceId, updateSize, isNewCombination, canvasRef])

    return (
        <animated.div
            className={cn(
                'relative flex h-10 max-h-10 min-h-10 w-fit items-center justify-center gap-2 border border-neutral-300 bg-neutral-200 p-2 px-3 hover:bg-neutral-300',
                'dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800',
                className,
                isLoading &&
                    'pointer-events-none animate-pulse border-sky-400 bg-sky-200 dark:border-sky-800 dark:bg-sky-950',
                instanceId && instanceId.startsWith('temporal-id') && 'pointer-events-none',
            )}
            onPointerDown={() => play(Sound.CLICK)}
            ref={wordRef}
        >
            <span className={cn(isLoading && 'opacity-0')}>{word.icon}</span>

            <span className={cn('font-medium capitalize', isLoading && 'opacity-0')}>{word.text}</span>

            {isLoading && (
                <Loader className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin stroke-3 text-black dark:text-white" />
            )}
        </animated.div>
    )
}

export default WordCapsule
