import Word from '@/component/Word'
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
                <div key={instance.id} className="absolute" style={{ left: instance.x, top: instance.y }}>
                    <Word word={instance.text} />
                </div>
            ))}
        </div>
    )
}

export default Canvas
