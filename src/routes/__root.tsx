import Header from '@/component/Header'
import Particles from '@/component/Particles'
import type { User } from '@/db/username'
import { AudioProvider } from '@/integration/AudioProvider'
import { ThemeProvider } from '@/integration/ThemeProvider'
import { seo } from '@/lib/seo'
import type { Language } from '@/locale/language'
import appCss from '@/style.css?url'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import '@fontsource/goldman/400.css'
import '@fontsource/goldman/700.css'
import '@fontsource/montserrat/100.css'
import '@fontsource/montserrat/200.css'
import '@fontsource/montserrat/300.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/800.css'
import '@fontsource/montserrat/900.css'
import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface MyRouterContext {
    query: QueryClient
    convex: ConvexQueryClient
    language: Language
    user: User | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'theme-color', content: '#0a0a0a' },
            ...seo({
                title: 'Craft Battle',
                description: `Craft attack and defense words to battle online against other players.`,
            }),
        ],
        links: [
            { rel: 'stylesheet', href: appCss },
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo_180.png' },
            { rel: 'icon', href: '/favicon.ico' },
            { rel: 'manifest', href: '/manifest.json' },
        ],
    }),

    ssr: false,
    shellComponent: RootDocument,
    notFoundComponent: () => <div>Not Found</div>,
})

interface Props {
    children: ReactNode
}

function RootDocument({ children }: Props) {
    const { language } = Route.useRouteContext()

    return (
        <html
            lang={language}
            suppressHydrationWarning
            className="h-dvh max-h-dvh min-h-dvh w-dvw max-w-dvw min-w-dvw touch-none"
        >
            <head>
                <HeadContent />
            </head>

            <ThemeProvider>
                <AudioProvider>
                    <body className="font-montserrat size-full overflow-hidden bg-neutral-50 text-neutral-950 selection:bg-sky-700/60 dark:bg-neutral-950 dark:text-neutral-50">
                        <Header language={language} />

                        <Particles
                            particleCount={300}
                            particleSpread={20}
                            speed={0.05}
                            particleBaseSize={80}
                            moveParticlesOnHover
                            particleHoverFactor={0.3}
                            className="absolute inset-0 -z-10 size-full dark:opacity-70"
                        />

                        {children}

                        <Scripts />
                    </body>
                </AudioProvider>
            </ThemeProvider>
        </html>
    )
}
