import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
    return <main className="full-page flex items-center justify-center p-4">Hello</main>
}
