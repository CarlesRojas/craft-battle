import CanvasWordInstance from '@/component/CanvasWordInstance'
import { Button } from '@/component/ui/button'
import { Sound, useAudio } from '@/integration/AudioProvider'
import { useTheme } from '@/integration/ThemeProvider'
import { useWordInstances } from '@/integration/WordInstancesProvider'
import { clamp } from '@/lib/clamp'
import { cn } from '@/lib/cn'
import { BrushCleaning } from 'lucide-react'
import type { RefObject } from 'react'
import { useDebounceCallback, useEventListener } from 'usehooks-ts'

interface Props {
    innerRef: RefObject<HTMLDivElement | null>
    draggingOverCanvas: boolean
    setDraggingOverCanvas: (draggingOverCanvas: boolean) => void
}

export const CANVAS_PADDING = 12

const Canvas = ({ innerRef, draggingOverCanvas, setDraggingOverCanvas }: Props) => {
    const { instances, replaceInstances, loadingInstances, clearInstances } = useWordInstances()
    const { theme: resolvedTheme } = useTheme()
    const { play } = useAudio()

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
            <div className="relative size-full">
                <div
                    className={cn(
                        'target-tl pointer-events-none absolute inset-1.5 hidden bg-black/70 dark:bg-white/70',
                        draggingOverCanvas && 'block',
                    )}
                />
                <div
                    className={cn(
                        'target-tr pointer-events-none absolute inset-1.5 hidden bg-black/70 dark:bg-white/70',
                        draggingOverCanvas && 'block',
                    )}
                />
                <div
                    className={cn(
                        'target-bl pointer-events-none absolute inset-1.5 hidden bg-black/70 dark:bg-white/70',
                        draggingOverCanvas && 'block',
                    )}
                />
                <div
                    className={cn(
                        'target-br pointer-events-none absolute inset-1.5 hidden bg-black/70 dark:bg-white/70',
                        draggingOverCanvas && 'block',
                    )}
                />

                <div className="relative size-full">
                    <Button
                        size="smallIcon"
                        variant="ghost"
                        className="absolute top-4 right-4"
                        onClick={() => {
                            play(Sound.CLEAR)
                            clearInstances()
                        }}
                        disabled={instances.length === 0}
                    >
                        <BrushCleaning className={cn('size-5', resolvedTheme === 'dark' && 'stroke-[2.5]')} />
                    </Button>
                </div>
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
