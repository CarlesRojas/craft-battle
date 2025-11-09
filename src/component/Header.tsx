import { Button } from '@/component/ui/button'
import { useAudio } from '@/integration/AudioProvider'
import { useTheme } from '@/integration/ThemeProvider'
import { getTranslation } from '@/locale/getTranslation'
import type { Language } from '@/locale/language'
import { Link } from '@tanstack/react-router'
import { Moon, Sun, Volume2, VolumeOff } from 'lucide-react'

interface Props {
    language: Language
}

export default function Header({ language }: Props) {
    const t = getTranslation(language)
    const { setTheme, resolvedTheme } = useTheme()
    const { muted, toggleMute } = useAudio()

    return (
        <header className="flex h-12 items-center justify-between border-b border-neutral-500/50 px-4 dark:border-neutral-500/30">
            <Link to={'/'}>
                <p className="font-goldman text-xl opacity-80">{t.meta.appName}</p>
            </Link>

            <div className="flex h-full items-center gap-4">
                <Button size="smallIcon" variant="ghost" onClick={toggleMute}>
                    {muted ? <VolumeOff className="size-5" /> : <Volume2 className="size-5" />}
                </Button>

                <Button
                    size="smallIcon"
                    variant="ghost"
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                >
                    {resolvedTheme === 'dark' ? <Sun className="size-5 stroke-[2.5]" /> : <Moon className="size-5" />}
                </Button>
            </div>
        </header>
    )
}
