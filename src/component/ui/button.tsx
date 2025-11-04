import { cn } from '@/lib/cn'
import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { type ComponentProps } from 'react'

const buttonVariants = cva(
    "group font-goldman relative inline-flex shrink-0 items-center justify-center gap-2 text-lg font-medium tracking-wide whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    'border border-sky-900 bg-sky-900/40 text-white hover:bg-sky-900/60 focus-visible:bg-sky-900/60',
                white: 'border border-neutral-800 bg-neutral-800/40 text-white hover:bg-neutral-800/60 focus-visible:bg-neutral-800/60',
                constructive:
                    'border border-green-900 bg-green-900/40 text-white hover:bg-green-900/60 focus-visible:bg-green-900/60',
                destructive:
                    'border border-red-900 bg-red-900/40 text-white hover:bg-red-900/60 focus-visible:bg-red-900/60',
            },
            size: {
                default: 'h-10 min-w-28 px-4 py-2 has-[>svg]:px-3',
                fit: 'h-fit min-w-28 p-4',
                icon: 'size-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

function Button({
    className,
    children,
    variant,
    size,
    asChild = false,
    ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'button'

    return (
        <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}>
            <div>
                <div className="target-tl pointer-events-none absolute -inset-1.5 hidden bg-white/70 group-hover:block group-focus-visible:block" />
                <div className="target-tr pointer-events-none absolute -inset-1.5 hidden bg-white/70 group-hover:block group-focus-visible:block" />
                <div className="target-bl pointer-events-none absolute -inset-1.5 hidden bg-white/70 group-hover:block group-focus-visible:block" />
                <div className="target-br pointer-events-none absolute -inset-1.5 hidden bg-white/70 group-hover:block group-focus-visible:block" />

                <div className="z-10 inline-flex size-full items-center justify-center gap-2">{children}</div>
            </div>
        </Comp>
    )
}

export { Button, buttonVariants }
