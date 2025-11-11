import { CANVAS_PADDING } from '@/component/Canvas'
import type { Doc, Id } from '@/db/_generated/dataModel'
import { useAutoResetState } from '@/hook/useAutoResetState'
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
    const { updateSize, newInstances, removeNewInstance } = useWordInstances()

    const wordRef = useRef<HTMLDivElement>(null)

    const [isNew, setIsNew] = useAutoResetState(false, 2000)

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

    useEffect(() => {
        if (!instanceId || instanceId.startsWith('temporal-id') || !newInstances.includes(instanceId)) return

        setIsNew(true)
        removeNewInstance(instanceId)
    }, [instanceId, newInstances, removeNewInstance, setIsNew])

    return (
        <animated.div
            className={cn(
                'group relative flex h-10 max-h-10 min-h-10 w-fit items-center justify-center gap-2 px-3 py-2',
                isLoading && 'pointer-events-none animate-pulse',
                instanceId && instanceId.startsWith('temporal-id') && 'pointer-events-none',
            )}
            ref={wordRef}
        >
            <img
                src={'/asset/shine.webp'}
                alt="shine"
                className={cn(
                    'pointer-events-none absolute top-1/2 left-1/2 -z-20 size-32 max-h-32 min-h-32 max-w-32 min-w-32 -translate-x-1/2 -translate-y-1/2 rotate-0 opacity-0 invert-50 dark:invert-0',
                    isNew && 'animate-new',
                )}
            />

            <div
                className={cn(
                    'bg-neutral-150 absolute inset-0 -z-10 border border-neutral-400 group-hover:bg-neutral-200',
                    'dark:border-neutral-700 dark:bg-neutral-900 dark:group-hover:bg-neutral-800',
                    className,
                    isLoading &&
                        'pointer-events-none animate-pulse border-sky-400 bg-sky-200 dark:border-sky-800 dark:bg-sky-950',
                )}
            />

            <span className={cn(isLoading && 'opacity-0')}>{word.icon}</span>

            <span className={cn('font-medium whitespace-nowrap capitalize', isLoading && 'opacity-0')}>
                {word.text}
            </span>

            {isLoading && (
                <Loader className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin stroke-3 text-black dark:text-white" />
            )}
        </animated.div>
    )
}

export default WordCapsule
