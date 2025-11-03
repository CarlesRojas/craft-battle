import { useWordInstances } from '@/integration/WordInstancesProvider'
import { cn } from '@/lib/cn'
import { animated, useSpring } from '@react-spring/web'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface Props {
    id?: string
    word: string
    icon: string
    explanation?: string
    isLoading?: boolean
    className?: string
    isNewCombination?: boolean
}

const Word = ({ id, word, icon, className, isLoading = false, isNewCombination = false }: Props) => {
    const { updateSize } = useWordInstances()

    const props = useSpring({
        from: { backgroundColor: 'oklch(26.9% 0 240.79)' },
        to: { backgroundColor: 'oklch(44.3% 0.11 240.79)' },
    })

    const wordRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isNewCombination && wordRef.current && id) {
            const rect = wordRef.current.getBoundingClientRect()

            updateSize({ id, width: rect.width, height: rect.height })
        }
    }, [id, updateSize, isNewCombination])

    return (
        <animated.div
            className={cn(
                'relative flex h-10 max-h-10 min-h-10 w-fit items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 capitalize hover:bg-neutral-700',
                className,
                isLoading && 'pointer-events-none animate-pulse bg-sky-600!',
            )}
            style={isNewCombination ? props : {}}
            ref={wordRef}
        >
            <span className={cn(isLoading && 'opacity-0')}>{icon}</span>

            <span className={cn('font-medium', isLoading && 'opacity-0')}>{word}</span>

            {isLoading && (
                <Loader className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin stroke-3 text-neutral-900" />
            )}
        </animated.div>
    )
}

export default Word
