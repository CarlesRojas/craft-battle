import { FunctionOnce } from '@/lib/functionOnce'
import { LOCAL_STORAGE_PREFIX, isLocalStorageAvailable } from '@/lib/storage'
import { createContext, use, useEffect, useState } from 'react'

export type ResolvedTheme = 'dark' | 'light'
export type Theme = ResolvedTheme | 'system'

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

interface ThemeProviderState {
    theme: Theme
    resolvedTheme: ResolvedTheme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: 'system',
    resolvedTheme: 'light',
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = `${LOCAL_STORAGE_PREFIX}_THEME`,
}: ThemeProviderProps) {
    const canStorage = isLocalStorageAvailable()
    const [theme, setTheme] = useState<Theme>(
        () => (canStorage ? (localStorage.getItem(storageKey) as Theme | null) : defaultTheme) || defaultTheme,
    )
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')

    useEffect(() => {
        const root = window.document.documentElement
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        function updateTheme() {
            root.classList.remove('light', 'dark')

            if (theme === 'system') {
                const systemTheme = mediaQuery.matches ? 'dark' : 'light'
                setResolvedTheme(systemTheme)
                root.classList.add(systemTheme)
                return
            }

            setResolvedTheme(theme)
            root.classList.add(theme)
        }

        mediaQuery.addEventListener('change', updateTheme)
        updateTheme()

        return () => mediaQuery.removeEventListener('change', updateTheme)
    }, [theme])

    const value = {
        theme,
        resolvedTheme,
        setTheme: (newTheme: Theme) => {
            if (canStorage) localStorage.setItem(storageKey, newTheme)
            setTheme(newTheme)
        },
    }

    return (
        <ThemeProviderContext value={value}>
            <FunctionOnce param={storageKey}>
                {key => {
                    if (!canStorage) return
                    const storageTheme: string | null = localStorage.getItem(key)

                    if (
                        storageTheme === 'dark' ||
                        ((storageTheme === null || storageTheme === 'system') &&
                            window.matchMedia('(prefers-color-scheme: dark)').matches)
                    ) {
                        document.documentElement.classList.add('dark')
                    }
                }}
            </FunctionOnce>
            {children}
        </ThemeProviderContext>
    )
}

export function useTheme() {
    const context = use(ThemeProviderContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!context) throw new Error('useTheme must be used within a ThemeProvider')

    return context
}
