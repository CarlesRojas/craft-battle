import { env } from '@/env'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexProvider as InternalConvexProvider } from 'convex/react'
import type { ReactNode } from 'react'

export function getConvexContext() {
    const convexQueryClient = new ConvexQueryClient(env.VITE_CONVEX_URL)
    return { convexQueryClient }
}

interface Props {
    children: ReactNode
    convexQueryClient: ConvexQueryClient
}

export default function ConvexProvider({ children, convexQueryClient }: Props) {
    return <InternalConvexProvider client={convexQueryClient.convexClient}>{children}</InternalConvexProvider>
}
