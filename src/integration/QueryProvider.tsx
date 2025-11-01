import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

export function getQueryContext() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
            },
        },
    })

    return { queryClient }
}

interface Props {
    children: ReactNode
    queryClient: QueryClient
}

export function QueryProvider({ children, queryClient }: Props) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
