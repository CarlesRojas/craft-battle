import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

function Input({ className, type, backgroundColor, ...props }: ComponentProps<'input'> & { backgroundColor?: string }) {
    return (
        <div className="group relative size-fit">
            <div className="pointer-events-none absolute -inset-1.5 hidden bg-white/70 group-focus-within:block group-hover:block aria-invalid:bg-red-800/70" />

            <div
                className={cn(
                    'pointer-events-none absolute -inset-1 hidden bg-neutral-950 group-focus-within:block group-hover:block',
                    !!backgroundColor && backgroundColor,
                )}
            />

            <div
                className={cn(
                    'pointer-events-none absolute -inset-x-1.5 inset-y-1.5 hidden bg-neutral-950 group-focus-within:block group-hover:block',
                    !!backgroundColor && backgroundColor,
                )}
            />

            <div
                className={cn(
                    'pointer-events-none absolute inset-x-1.5 -inset-y-1.5 hidden bg-neutral-950 group-focus-within:block group-hover:block',
                    !!backgroundColor && backgroundColor,
                )}
            />

            <div className="pointer-events-none absolute inset-0 border border-neutral-600 bg-neutral-700/70 group-focus-within:bg-neutral-700/90 group-hover:bg-neutral-700/90" />

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
