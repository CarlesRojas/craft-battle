import Canvas from '@/component/Canvas'
import ListWord from '@/component/ListWord'
import Particles from '@/component/Particles'
import { WordInstancesProvider } from '@/integration/WordInstancesProvider'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

export const Route = createFileRoute('/$language/game/')({ component: Game })

function Game() {
    const dropArea = useRef<HTMLDivElement>(null)
    const scrollAreaMobile = useRef<HTMLDivElement>(null)
    const scrollAreaDesktop = useRef<HTMLDivElement>(null)
    const canvasArea = useRef<HTMLDivElement>(null)
    const listArea = useRef<HTMLDivElement>(null)
    const selectArea = useRef<HTMLDivElement>(null)

    const [draggingOverCanvas, setDraggingOverCanvas] = useState<boolean>(false)

    const words: Array<{ id: string; text: string; icon: string }> = useMemo(
        () => [
            { id: uuid(), text: 'ocean', icon: '🌊' },
            { id: uuid(), text: 'mountain', icon: '⛰️' },
            { id: uuid(), text: 'crystal', icon: '💎' },
            { id: uuid(), text: 'dragon', icon: '🐉' },
            { id: uuid(), text: 'thunder', icon: '⚡' },
            { id: uuid(), text: 'forest', icon: '🌳' },
            { id: uuid(), text: 'phoenix', icon: '🦅' },
            { id: uuid(), text: 'shadow', icon: '👥' },
            { id: uuid(), text: 'volcano', icon: '🌋' },
            { id: uuid(), text: 'river', icon: '🏞️' },
            { id: uuid(), text: 'storm', icon: '🌪️' },
            { id: uuid(), text: 'glacier', icon: '🧊' },
            { id: uuid(), text: 'desert', icon: '🏜️' },
            { id: uuid(), text: 'tornado', icon: '🌪️' },
            { id: uuid(), text: 'star', icon: '⭐' },
            { id: uuid(), text: 'moon', icon: '🌙' },
            { id: uuid(), text: 'sun', icon: '☀️' },
            { id: uuid(), text: 'fire', icon: '🔥' },
            { id: uuid(), text: 'water', icon: '💧' },
            { id: uuid(), text: 'earth', icon: '🌍' },
            { id: uuid(), text: 'wind', icon: '💨' },
            { id: uuid(), text: 'steel', icon: '⚔️' },
            { id: uuid(), text: 'diamond', icon: '💎' },
            { id: uuid(), text: 'cloud', icon: '☁️' },
            { id: uuid(), text: 'lightning', icon: '⚡' },
            { id: uuid(), text: 'ice', icon: '❄️' },
            { id: uuid(), text: 'sand', icon: '⌛' },
            { id: uuid(), text: 'lava', icon: '🌋' },
            { id: uuid(), text: 'rock', icon: '🪨' },
            { id: uuid(), text: 'light', icon: '✨' },
            { id: uuid(), text: 'metal', icon: '🔧' },
            { id: uuid(), text: 'wood', icon: '🪵' },
            { id: uuid(), text: 'glass', icon: '🪟' },
            { id: uuid(), text: 'sword', icon: '⚔️' },
            { id: uuid(), text: 'shield', icon: '🛡️' },
            { id: uuid(), text: 'time', icon: '⌛' },
            { id: uuid(), text: 'space', icon: '🌌' },
            { id: uuid(), text: 'magnet', icon: '🧲' },
            { id: uuid(), text: 'poison', icon: '☠️' },
            { id: uuid(), text: 'flower', icon: '🌸' },
            { id: uuid(), text: 'tree', icon: '🌳' },
            { id: uuid(), text: 'blade', icon: '🗡️' },
            { id: uuid(), text: 'armor', icon: '🛡️' },
            { id: uuid(), text: 'mist', icon: '🌫️' },
            { id: uuid(), text: 'fog', icon: '🌫️' },
            { id: uuid(), text: 'snow', icon: '❄️' },
            { id: uuid(), text: 'rain', icon: '🌧️' },
            { id: uuid(), text: 'coral', icon: '🪸' },
            { id: uuid(), text: 'ember', icon: '🔥' },
            { id: uuid(), text: 'frost', icon: '❄️' },
        ],
        [],
    )

    return (
        <main className="full-page flex flex-col items-center justify-center md:flex-row" ref={dropArea}>
            <Particles
                particleColors={['#ffffff']}
                particleCount={300}
                particleSpread={20}
                speed={0.05}
                particleBaseSize={70}
                moveParticlesOnHover={true}
                particleHoverFactor={0.5}
                className="absolute -z-10 opacity-40"
            />

            <WordInstancesProvider>
                <div className="w-full grow md:h-full md:w-[unset]">
                    <div className="h-28 max-h-28 min-h-28 w-full bg-orange-500/10" ref={selectArea}></div>

                    <div className="h-[calc(100%-7rem)] max-h-[calc(100%-7rem)] min-h-[calc(100%-7rem)] w-full">
                        <Canvas
                            innerRef={canvasArea}
                            draggingOverCanvas={draggingOverCanvas}
                            setDraggingOverCanvas={setDraggingOverCanvas}
                        />
                    </div>
                </div>

                <div ref={listArea} className="relative h-fit w-full md:h-full md:w-[unset] md:max-w-96 md:min-w-96">
                    <div
                        className="h-[calc(100%-3rem) hidden max-h-[calc(100%-3rem)] min-h-[calc(100%-3rem)] w-full overflow-y-auto p-3 md:flex"
                        ref={scrollAreaDesktop}
                    >
                        <div className="flex h-fit w-full flex-wrap gap-3 overflow-y-auto" ref={scrollAreaDesktop}>
                            {words.map(word => (
                                <ListWord
                                    key={word.id}
                                    word={word.text}
                                    icon={word.icon}
                                    scrollArea={scrollAreaDesktop}
                                    canvasArea={canvasArea}
                                    setDraggingOverCanvas={setDraggingOverCanvas}
                                />
                            ))}
                        </div>
                    </div>

                    <div
                        className="grid h-55 max-h-55 min-h-55 w-full grid-rows-4 gap-3 overflow-x-auto p-3 md:hidden"
                        ref={scrollAreaMobile}
                    >
                        {Array.from({ length: 4 }, (_, mod) => (
                            <div className="flex gap-3">
                                {words.map(
                                    (word, i) =>
                                        i % 4 === mod && (
                                            <ListWord
                                                key={word.id}
                                                word={word.text}
                                                icon={word.icon}
                                                scrollArea={scrollAreaMobile}
                                                canvasArea={canvasArea}
                                                setDraggingOverCanvas={setDraggingOverCanvas}
                                                isMobile
                                            />
                                        ),
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="h-12 max-h-12 min-h-12 w-full bg-orange-500/10"></div>
                </div>
            </WordInstancesProvider>
        </main>
    )
}
