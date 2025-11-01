import { getQueryContext, QueryProvider } from '@/integration/QueryProvider'
import { Language } from '@/locale/language'
import { routeTree } from '@/routeTree.gen'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ReactNode } from 'react'

export const getRouter = () => {
    const queryContext = getQueryContext()

    const router = createRouter({
        routeTree,
        context: { ...queryContext, language: Language.EN },
        defaultPreload: 'intent',
        Wrap: (props: { children: ReactNode }) => {
            return <QueryProvider {...queryContext}>{props.children}</QueryProvider>
        },
    })

    setupRouterSsrQueryIntegration({ router, queryClient: queryContext.queryClient })

    return router
}
