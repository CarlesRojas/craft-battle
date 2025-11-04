import type { Doc, Id } from '@/db/_generated/dataModel'
import { useWordInstances } from '@/integration/WordInstancesProvider'
import { cn } from '@/lib/cn'
import { animated, useSpring } from '@react-spring/web'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface Props {
    word: Doc<'word'>
    instanceId?: Id<'instance'>
    isLoading?: boolean
    className?: string
    isNewCombination?: boolean
}

const WordCapsule = ({ word, instanceId, className, isLoading = false, isNewCombination = false }: Props) => {
    const { updateSize } = useWordInstances()

    const props = useSpring({
        from: { backgroundColor: 'oklch(26.9% 0 240.79)' },
        to: { backgroundColor: 'oklch(44.3% 0.11 240.79)' },
    })

    const wordRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isNewCombination && wordRef.current) console.log(instanceId)
        if (isNewCombination && wordRef.current && instanceId && !instanceId.startsWith('temporal-id')) {
            const rect = wordRef.current.getBoundingClientRect()

            updateSize({ _id: instanceId, width: rect.width, height: rect.height })
        }
    }, [instanceId, updateSize, isNewCombination])

    return (
        <animated.div
            className={cn(
                'relative flex h-10 max-h-10 min-h-10 w-fit items-center justify-center gap-2 border border-neutral-800 bg-neutral-900 p-2 px-3 hover:bg-neutral-800',
                className,
                isLoading && 'pointer-events-none animate-pulse bg-sky-600!',
                instanceId && instanceId.startsWith('temporal-id') && 'pointer-events-none',
            )}
            style={isNewCombination ? props : {}}
            ref={wordRef}
        >
            <span className={cn(isLoading && 'opacity-0')}>{word.icon}</span>

            <span className={cn('font-medium capitalize', isLoading && 'opacity-0')}>{word.text}</span>

            {isLoading && (
                <Loader className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin stroke-3 text-neutral-900" />
            )}
        </animated.div>
    )
}

export default WordCapsule
