import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
    server: {
        CONVEX_DEPLOYMENT: z.string().min(1),
        OPENAI_API_KEY: z.string().min(1),
    },

    client: {
        VITE_CONVEX_URL: z.url().min(1),
    },

    runtimeEnvStrict: {
        CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
    },
    emptyStringAsUndefined: true,
    clientPrefix: 'VITE_',
})
