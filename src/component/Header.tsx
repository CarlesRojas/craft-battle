import type { Language } from '@/locale/language'

interface Props {
    language: Language
}

export default function Header({ language }: Props) {
    return (
        <header className="flex h-12 items-center px-4 text-white">
            <h1 className="font-goldman text-2xl opacity-80">Craft Battle</h1>
        </header>
    )
}
