import ConvexProvider, { getConvexContext } from '@/integration/ConvexProvider'
import { QueryProvider, getQueryContext } from '@/integration/QueryProvider'
import { Language } from '@/locale/language'
import { routeTree } from '@/routeTree.gen'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import type { ReactNode } from 'react'

export const getRouter = () => {
    const queryContext = getQueryContext()
    const convexQueryClient = getConvexContext()

    const router = createRouter({
        routeTree,
        context: {
            query: queryContext.queryClient,
            convex: convexQueryClient.convexQueryClient,
            language: Language.EN,
            user: null,
        },
        defaultPreload: 'intent',
        Wrap: (props: { children: ReactNode }) => {
            return (
                <QueryProvider {...queryContext}>
                    <ConvexProvider {...convexQueryClient}>{props.children}</ConvexProvider>
                </QueryProvider>
            )
        },
    })

    setupRouterSsrQueryIntegration({ router, queryClient: queryContext.queryClient })

    return router
}
