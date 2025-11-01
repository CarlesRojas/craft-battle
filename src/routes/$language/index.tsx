import { getTranslation } from '@/locale/getTranslation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$language/')({ component: Home })

function Home() {
    const { language } = Route.useRouteContext()
    const t = getTranslation(language)

    return <main className="full-page flex items-center justify-center p-4">{t.meta.appName}</main>
}
