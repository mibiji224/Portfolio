import * as React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-border bg-secondary text-muted-foreground',
        outline: 'border-primary/20 bg-primary/10 text-primary-strong',
        ghost: 'border-transparent bg-transparent text-muted-foreground',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs font-semibold',
        sm: 'px-2 py-1 text-[10px] font-medium',
        xs: 'px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  }
)

function Badge({ className, variant, size, ...props }) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
