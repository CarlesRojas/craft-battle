import { useWordInstances } from '@/integration/InstancesProvider'

const Canvas = () => {
    const { instances } = useWordInstances()

    return (
        <div className="w-full grow bg-green-500/10 md:h-full md:w-[unset]">
            {instances.map(instance => (
                <div
                    key={instance.id}
                    className="absolute flex h-8 w-fit cursor-grab items-center justify-center rounded bg-red-950 px-4 hover:bg-red-900"
                    style={{ left: instance.x, top: instance.y }}
                >
                    {instance.text}
                </div>
            ))}
        </div>
    )
}

export default Canvas
