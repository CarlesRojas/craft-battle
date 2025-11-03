//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
    {
        ignores: [
            '.output/**',
            '.nitro/**',
            '.tanstack/**',
            'convex/_generated/**',
            'eslint.config.js',
            'prettier.config.js',
            'public/service-worker.js',
        ],
    },
    ...tanstackConfig,
    {
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'import/order': 'off',
        },
    },
]
