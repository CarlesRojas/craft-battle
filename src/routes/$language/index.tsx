import Canvas from '@/component/Canvas'
import ListWord from '@/component/ListWord'
import { WordInstancesProvider } from '@/integration/WordInstancesProvider'
import { getTranslation } from '@/locale/getTranslation'
import { createFileRoute } from '@tanstack/react-router'
import { RefObject, useRef } from 'react'

export const Route = createFileRoute('/$language/')({ component: Home })

function Home() {
    const { language } = Route.useRouteContext()
    const t = getTranslation(language)

    const dropArea = useRef<HTMLDivElement>(null)
    const scrollAreaMobile = useRef<HTMLDivElement>(null)
    const scrollAreaDesktop = useRef<HTMLDivElement>(null)
    const canvasArea = useRef<HTMLDivElement>(null)
    const listArea = useRef<HTMLDivElement>(null)

    const words = [
        'ocean',
        'mountain',
        'crystal',
        'dragon',
        'thunder',
        'forest',
        'phoenix',
        'shadow',
        'volcano',
        'river',
        'storm',
        'glacier',
        'desert',
        'tornado',
        'star',
        'moon',
        'sun',
        'fire',
        'water',
        'earth',
        'wind',
        'steel',
        'diamond',
        'cloud',
        'lightning',
        'ice',
        'sand',
        'lava',
        'rock',
        'light',
        'metal',
        'wood',
        'glass',
        'sword',
        'shield',
        'time',
        'space',
        'magnet',
        'poison',
        'flower',
        'tree',
        'blade',
        'armor',
        'mist',
        'fog',
        'snow',
        'rain',
        'coral',
        'ember',
        'frost',
    ]

    return (
        <main className="full-page flex flex-col items-center justify-center md:flex-row" ref={dropArea}>
            <WordInstancesProvider>
                <Canvas innerRef={canvasArea as RefObject<HTMLDivElement>} />

                <div ref={listArea} className="relative h-fit w-full md:h-full md:w-[unset] md:max-w-96 md:min-w-96">
                    <div className="min-h-12 w-full bg-orange-500/10"></div>

                    <div
                        className="hidden max-h-[calc(100%-3rem)] w-full flex-wrap gap-3 overflow-y-auto p-3 md:flex"
                        ref={scrollAreaDesktop}
                    >
                        {words.map(word => (
                            <ListWord
                                key={word}
                                word={word}
                                scrollArea={scrollAreaDesktop as RefObject<HTMLDivElement>}
                                canvasArea={canvasArea as RefObject<HTMLDivElement>}
                            />
                        ))}
                    </div>

                    <div
                        className="grid max-h-55 min-h-55 w-full grid-rows-4 gap-3 overflow-x-auto p-3 md:hidden"
                        ref={scrollAreaMobile}
                    >
                        {Array.from({ length: 4 }, (_, mod) => (
                            <div className="flex gap-3">
                                {words.map(
                                    (word, i) =>
                                        i % 4 === mod && (
                                            <ListWord
                                                key={word}
                                                word={word}
                                                scrollArea={scrollAreaMobile as RefObject<HTMLDivElement>}
                                                canvasArea={canvasArea as RefObject<HTMLDivElement>}
                                                isMobile
                                            />
                                        ),
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </WordInstancesProvider>
        </main>
    )
}
