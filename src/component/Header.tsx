import type { Language } from '@/locale/language'
import { Link } from '@tanstack/react-router'

interface Props {
    language: Language
}

export default function Header({ language }: Props) {
    return (
        <header className="flex h-12 items-center bg-gray-800 px-8 text-white shadow-lg">
            <h1 className="text-xl font-semibold">
                <Link to={'/$language'} params={{ language }}>
                    Craft Battle
                </Link>
            </h1>
        </header>
    )
}
