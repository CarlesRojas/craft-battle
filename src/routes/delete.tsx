import { api } from '@/db/_generated/api'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'

export const Route = createFileRoute('/delete')({
    component: RouteComponent,
    ssr: false,
})

function RouteComponent() {
    const backfillRand = useMutation(api.combination.backfillRand)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleBackfill = async () => {
        try {
            setIsLoading(true)
            setMessage('Backfilling random values...')

            const startTime = Date.now()
            const total = 6671
            const batchSize = 1000
            let iteration = 0
            let isDone = false
            let continueCursor: string | null = null

            while (!isDone) {
                const result: { isDone: boolean; continueCursor: string | null } = await backfillRand({
                    paginationOpts: {
                        numItems: batchSize,
                        cursor: continueCursor,
                    },
                })

                iteration++

                const elapsed = (Date.now() - startTime) / 1000 // seconds
                const percentage = (iteration / total) * 100
                const rate = iteration / elapsed // iterations per second
                const remaining = total - iteration
                const eta = remaining / rate // seconds remaining

                console.clear()
                console.log(
                    `Progress: ${percentage.toFixed(1)}% (${iteration.toLocaleString()}/${total.toLocaleString()} iterations)`,
                )
                console.log(`Time elapsed: ${formatTime(elapsed)}`)
                console.log(`Estimated remaining: ${formatTime(eta)}`)
                console.log(`Processing rate: ${rate.toFixed(2)} iterations/second`)

                isDone = result.isDone
                continueCursor = result.continueCursor
            }

            const totalTime = (Date.now() - startTime) / 1000
            console.log(`\nCompleted in ${formatTime(totalTime)}`)
            setMessage('Random values backfilled successfully!')
        } catch (error) {
            setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    function formatTime(seconds: number): string {
        if (seconds < 60) return `${seconds.toFixed(1)}s`

        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = (seconds % 60).toFixed(1)

        if (hours > 0) {
            return `${hours}h ${minutes}m ${remainingSeconds}s`
        } else {
            return `${minutes}m ${remainingSeconds}s`
        }
    }

    return (
        <div className="p-8">
            <h1 className="mb-4 text-2xl font-bold">Delete Route</h1>
            <div className="space-y-4">
                <p>This route contains utility functions for database maintenance.</p>
                <button
                    onClick={handleBackfill}
                    disabled={isLoading}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    {isLoading ? 'Backfilling...' : 'Backfill Random Values'}
                </button>
                {message && (
                    <div
                        className={`rounded p-3 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}
