import { env } from '@/env'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexProvider as InternalConvexProvider } from 'convex/react'
import type { ReactNode } from 'react'

const convexQueryClient = new ConvexQueryClient(env.VITE_CONVEX_URL)

interface Props {
    children: ReactNode
}

export default function ConvexProvider({ children }: Props) {
    return <InternalConvexProvider client={convexQueryClient.convexClient}>{children}</InternalConvexProvider>
}
