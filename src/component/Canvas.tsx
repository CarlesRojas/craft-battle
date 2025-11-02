import Word from '@/component/Word'
import { useWordInstances } from '@/integration/WordInstancesProvider'
import { RefObject } from 'react'

interface Props {
    innerRef: RefObject<HTMLDivElement>
}

const Canvas = ({ innerRef }: Props) => {
    const { instances, overlappedWordId } = useWordInstances()

    return (
        <div className="w-full grow bg-green-500/10 md:h-full md:w-[unset]" ref={innerRef}>
            {instances.map(instance => (
                <div key={instance.id} className="absolute" style={{ left: instance.x, top: instance.y }}>
                    <Word
                        id={instance.id}
                        icon={instance.icon}
                        explanation={instance.explanation}
                        word={instance.text}
                        className={overlappedWordId === instance.id ? 'bg-sky-800' : ''}
                        isLoading={instance.isLoading}
                        isNewCombination={instance.width === 0 && instance.height === 0}
                    />
                </div>
            ))}
        </div>
    )
}

export default Canvas
