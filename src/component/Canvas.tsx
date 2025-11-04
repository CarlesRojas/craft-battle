import CanvasWord from '@/component/CanvasWord'
import { useWordInstances } from '@/integration/WordInstancesProvider'
import { clamp } from '@/lib/clamp'
import type { RefObject } from 'react'
import { useDebounceCallback, useEventListener } from 'usehooks-ts'
interface Props {
    innerRef: RefObject<HTMLDivElement | null>
}

const Canvas = ({ innerRef }: Props) => {
    const { instances, replaceInstances } = useWordInstances()

    const onResize = useDebounceCallback(() => {
        const rect = innerRef.current?.getBoundingClientRect()
        if (!rect) return

        replaceInstances(
            instances.map(instance => ({
                ...instance,
                x: clamp(instance.x, rect.x, rect.x + rect.width - instance.width),
                y: clamp(instance.y, rect.y, rect.y + rect.height - instance.height),
            })),
        )
    }, 200)

    useEventListener('resize', onResize)

    return (
        <div className="size-full" ref={innerRef}>
            <div className="relative size-full">
                <div className="target-tl pointer-events-none absolute inset-1.5 bg-white" />
                <div className="target-tr pointer-events-none absolute inset-1.5 bg-white" />
                <div className="target-bl pointer-events-none absolute inset-1.5 bg-white" />
                <div className="target-br pointer-events-none absolute inset-1.5 bg-white" />
            </div>

            {instances.map(instance => (
                <div key={instance.id} className="absolute" style={{ left: instance.x, top: instance.y }}>
                    <CanvasWord word={instance} canvasArea={innerRef} />
                </div>
            ))}
        </div>
    )
}

export default Canvas
