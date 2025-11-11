import type { ReactNode, RefObject } from 'react'
import { useRef, useState } from 'react'
import { useResizeObserver } from 'usehooks-ts'

interface Props {
    children: ReactNode
}

const MARQUEE_SPEED = 100 // In pixels per second

const Marquee = ({ children }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    const { width: containerWidth = 0 } = useResizeObserver({
        ref: containerRef as RefObject<HTMLElement>,
        box: 'border-box',
    })

    const { width: textWidth = 0 } = useResizeObserver({
        ref: textRef as RefObject<HTMLElement>,
        box: 'border-box',
    })

    const difference = textWidth - containerWidth

    return (
        <div
            ref={containerRef}
            className="relative flex h-full w-full items-center overflow-hidden mask-x-from-[calc(100%-16px)] mask-x-to-[calc(100%-2px)] whitespace-nowrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                ref={textRef}
                className="inline-block px-3 transition-transform ease-linear"
                style={{
                    transitionDuration: isHovered ? `${difference / MARQUEE_SPEED}s` : '300ms',
                    transform: `translateX(${isHovered && difference > 0 ? `-${difference}px` : '0px'})`,
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default Marquee
