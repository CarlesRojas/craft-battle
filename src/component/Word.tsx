import { cn } from '@/lib/cn'
import { animated, useSpring } from '@react-spring/web'

interface Props {
    word: string
    className?: string
    enterAnimation?: boolean
}

const Word = ({ word, className, enterAnimation = false }: Props) => {
    const props = useSpring({
        from: { backgroundColor: 'oklch(26.9% 0 240.79)' },
        to: { backgroundColor: 'oklch(44.3% 0.11 240.79)' },
    })

    return (
        <animated.div
            className={cn(
                'flex h-10 max-h-10 min-h-10 w-fit items-center justify-center rounded-lg bg-neutral-800 px-4 capitalize hover:bg-neutral-700',
                className,
            )}
            style={enterAnimation ? props : {}}
        >
            {word}
        </animated.div>
    )
}

export default Word
