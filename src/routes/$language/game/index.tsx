import Game from '@/component/Game'
import Particles from '@/component/Particles'
import { WordListProvider } from '@/integration/WordListProvider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$language/game/')({ component: GamePage })

function GamePage() {
    return (
        <main className="full-page">
            <Particles
                particleColors={['#ffffff']}
                particleCount={300}
                particleSpread={20}
                speed={0.05}
                particleBaseSize={50}
                moveParticlesOnHover={true}
                particleHoverFactor={0.5}
                className="absolute -z-10 opacity-40"
            />

            <WordListProvider>
                <Game />
            </WordListProvider>
        </main>
    )
}
