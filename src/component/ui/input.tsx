import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

function Input({ className, type, backgroundColor, ...props }: ComponentProps<'input'> & { backgroundColor?: string }) {
    return (
        <div className="group relative size-fit border border-neutral-600 bg-neutral-700/70 focus-within:bg-neutral-700/90 hover:bg-neutral-700/90">
            <div className="target-tl pointer-events-none absolute -inset-1.5 hidden bg-white/70 group-focus-within:block group-hover:block" />
            <div className="target-tr pointer-events-none absolute -inset-1.5 hidden bg-white/70 group-focus-within:block group-hover:block" />
            <div className="target-bl pointer-events-none absolute -inset-1.5 hidden bg-white/70 group-focus-within:block group-hover:block" />
            <div className="target-br pointer-events-none absolute -inset-1.5 hidden bg-white/70 group-focus-within:block group-hover:block" />

            <input
                type={type}
                data-slot="input"
                className={cn(
                    'file:text relative z-10 h-10 w-full min-w-0 bg-transparent px-3 py-1 text-base outline-none file:inline-flex file:h-10 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    className,
                )}
                {...props}
            />
        </div>
    )
}

export { Input }
