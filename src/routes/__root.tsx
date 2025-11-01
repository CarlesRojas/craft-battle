import Header from '@/component/Header'
import { getLanguage, getLanguageFromPathname } from '@/data/language'
import ConvexProvider from '@/integration/ConvexProvider'
import { seo } from '@/lib/seo'
import type { Language } from '@/locale/language'
import appCss from '@/style.css?url'
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
import { HeadContent, Scripts, createRootRouteWithContext, redirect } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface MyRouterContext {
    queryClient: QueryClient
    language: Language
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'theme-color', content: '#010a0a' }, // TODO Change theme
            ...seo({ title: 'Ambibook', description: `Read or listen to books with extra ambiance` }),
        ],
        links: [
            { rel: 'stylesheet', href: appCss },
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo_180.png' },
            { rel: 'icon', href: '/favicon.ico' },
            { rel: 'manifest', href: '/manifest.json' },
        ],
    }),

    beforeLoad: async ({ location }) => {
        const path = location.pathname
        const pathnameLanguage = getLanguageFromPathname(path)

        if (!pathnameLanguage) {
            const language = await getLanguage()
            throw redirect({ to: `/${language}${path}` as any })
        }

        return { language: pathnameLanguage }
    },

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

            <body className="size-full overflow-hidden bg-neutral-950 text-neutral-50 selection:bg-sky-500/40">
                <ConvexProvider>
                    <Header />
                    {children}
                </ConvexProvider>

                <Scripts />
            </body>
        </html>
    )
}
