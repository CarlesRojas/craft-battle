import { Button } from '@/component/ui/button'
import { useTheme } from '@/integration/ThemeProvider'
import { getTranslation } from '@/locale/getTranslation'
import type { Language } from '@/locale/language'
import { Link } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'

interface Props {
    language: Language
}

export default function Header({ language }: Props) {
    const t = getTranslation(language)
    const { setTheme, resolvedTheme } = useTheme()

    return (
        <header className="flex h-12 items-center justify-between border-b border-neutral-500/50 px-4 dark:border-neutral-500/30">
            <Link to={'/$language'} params={{ language }}>
                <p className="font-goldman text-xl opacity-80">{t.meta.appName}</p>
            </Link>

            <Button
                size="smallIcon"
                variant="ghost"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
                {resolvedTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
        </header>
    )
}
