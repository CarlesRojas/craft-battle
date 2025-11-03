import { cn } from '@/lib/cn'
import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const buttonVariants = cva('pointer-events-none', {
    variants: {
        variant: {
            default:
                'border border-slate-600 bg-slate-700/70 text-white group-hover:bg-slate-700/90 group-focus-visible:bg-slate-700/90',
            constructive:
                'border border-green-900 bg-green-900/40 text-white group-hover:bg-green-900/60 group-focus-visible:bg-green-900/60',
            destructive:
                'border border-red-900 bg-red-900/40 text-white group-hover:bg-red-900/60 group-focus-visible:bg-red-900/60',
        },
    },

    defaultVariants: {
        variant: 'default',
    },
})

function Button({
    className,
    children,
    variant,
    backgroundColor,
    asChild = false,
    ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean; backgroundColor?: string }) {
    const Comp = asChild ? Slot : 'button'

    return (
        <Comp
            data-slot="button"
            className={cn(
                "group font-goldman relative inline-flex shrink-0 items-center justify-center gap-2 text-lg font-medium tracking-wide whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'h-10 px-4 py-2 has-[>svg]:px-3',
                className,
            )}
            {...props}
        >
            <div className="pointer-events-none absolute -inset-1.5 hidden bg-white/70 group-hover:block group-focus-visible:block" />

            <div
                className={cn(
                    'pointer-events-none absolute -inset-1 hidden bg-neutral-950 group-hover:block group-focus-visible:block',
                    backgroundColor,
                )}
            />

            <div
                className={cn(
                    'pointer-events-none absolute -inset-x-1.5 inset-y-1.5 hidden bg-neutral-950 group-hover:block group-focus-visible:block',
                    backgroundColor,
                )}
            />

            <div
                className={cn(
                    'pointer-events-none absolute inset-x-1.5 -inset-y-1.5 hidden bg-neutral-950 group-hover:block group-focus-visible:block',
                    backgroundColor,
                )}
            />

            <div className={cn('pointer-events-none absolute inset-0', buttonVariants({ variant }))} />

            <div className="z-10 inline-flex size-full items-center justify-center gap-2">{children}</div>
        </Comp>
    )
}

export { Button, buttonVariants }
