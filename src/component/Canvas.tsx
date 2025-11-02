import { useWordInstances } from '@/integration/InstancesProvider'
import { RefObject } from 'react'

interface Props {
    innerRef: RefObject<HTMLDivElement>
}

const Canvas = ({ innerRef }: Props) => {
    const { instances } = useWordInstances()

    console.log(instances)

    return (
        <div className="w-full grow bg-green-500/10 md:h-full md:w-[unset]" ref={innerRef}>
            {instances.map(instance => (
                <div
                    key={instance.id}
                    className="absolute flex h-8 w-fit cursor-grab items-center justify-center rounded bg-neutral-800 px-4"
                    style={{ left: instance.x, top: instance.y }}
                >
                    {instance.text}
                </div>
            ))}
        </div>
    )
}

export default Canvas
