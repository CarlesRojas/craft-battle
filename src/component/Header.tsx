import { getTranslation } from '@/locale/getTranslation'
import type { Language } from '@/locale/language'

interface Props {
    language: Language
}

export default function Header({ language }: Props) {
    const t = getTranslation(language)
    return (
        <header className="flex h-12 items-center border-b border-neutral-700 bg-neutral-900 px-4 text-white">
            <h1 className="font-goldman text-xl opacity-80">{t.meta.appName}</h1>
        </header>
    )
}
