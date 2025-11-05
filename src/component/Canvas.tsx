import CanvasWordInstance from '@/component/CanvasWordInstance'
import { useWordInstances } from '@/integration/WordInstancesProvider'
import { clamp } from '@/lib/clamp'
import { cn } from '@/lib/cn'
import type { RefObject } from 'react'
import { useDebounceCallback, useEventListener } from 'usehooks-ts'

interface Props {
    innerRef: RefObject<HTMLDivElement | null>
    draggingOverCanvas: boolean
    setDraggingOverCanvas: (draggingOverCanvas: boolean) => void
}

export const CANVAS_PADDING = 12

const Canvas = ({ innerRef, draggingOverCanvas, setDraggingOverCanvas }: Props) => {
    const { instances, replaceInstances, loadingInstances } = useWordInstances()

    const onResize = useDebounceCallback(() => {
        const rect = innerRef.current?.getBoundingClientRect()
        if (!rect) return

        replaceInstances(
            instances.map(instance => ({
                ...instance,
                x: clamp(instance.x, rect.x + CANVAS_PADDING, rect.x + rect.width - instance.width - CANVAS_PADDING),
                y: clamp(instance.y, rect.y + CANVAS_PADDING, rect.y + rect.height - instance.height - CANVAS_PADDING),
            })),
        )
    }, 200)

    useEventListener('resize', onResize)

    return (
        <div className="size-full" ref={innerRef}>
            <div className={cn('pointer-events-none relative hidden size-full', draggingOverCanvas && 'block')}>
                <div className="target-tl pointer-events-none absolute inset-1.5 bg-black/70 dark:bg-white/70" />
                <div className="target-tr pointer-events-none absolute inset-1.5 bg-black/70 dark:bg-white/70" />
                <div className="target-bl pointer-events-none absolute inset-1.5 bg-black/70 dark:bg-white/70" />
                <div className="target-br pointer-events-none absolute inset-1.5 bg-black/70 dark:bg-white/70" />
            </div>

            {instances.map(instance => (
                <div key={instance._id} className="absolute" style={{ left: instance.x, top: instance.y }}>
                    <CanvasWordInstance
                        instance={instance}
                        canvasArea={innerRef}
                        setDraggingOverCanvas={setDraggingOverCanvas}
                        isLoading={loadingInstances.includes(instance._id)}
                    />
                </div>
            ))}
        </div>
    )
}

export default Canvas
