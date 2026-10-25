import { ArrowUpRight, Clock, PenLine, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// Bits shared by the blog bento on the dashboard scroll and the full
// /blog/all page: the reader dialog, the bento tile and its size cycle.

const WORDS_PER_MINUTE = 200

export const paragraphs = (body) => body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

export const readingTime = (body) => Math.max(1, Math.round(body.trim().split(/\s+/).length / WORDS_PER_MINUTE))

export const formatDate = (iso) =>
    iso
        ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : ''

export const Meta = ({ post }) => (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <span>{formatDate(post.published_at)}</span>
        <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {readingTime(post.body)} min read
        </span>
    </p>
)

// A post with no header photo yet gets a quiet placeholder instead of a gap.
export const Cover = ({ post, className }) =>
    post.cover_image ? (
        <img src={post.cover_image} alt="" loading="lazy" decoding="async" className={`w-full object-cover ${className}`} />
    ) : (
        <div className={`flex w-full items-center justify-center bg-secondary ${className}`}>
            <PenLine className="h-10 w-10 text-primary-strong" />
        </div>
    )

// The reader dialog: cover, meta and the full body, one post at a time.
export const PostDialog = ({ post, onClose }) => (
    <Dialog open={Boolean(post)} onOpenChange={(next) => !next && onClose()}>
        {post && (
            <DialogContent
                showCloseButton={false}
                className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto p-0"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 z-10 rounded-full border border-border bg-background/90 p-1.5 text-foreground backdrop-blur hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <X className="h-4 w-4" />
                </button>

                <Cover post={post} className="h-48 sm:h-64" />

                <article className="p-5 sm:p-8">
                    <Meta post={post} />
                    <DialogTitle className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {post.title}
                    </DialogTitle>
                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
                        {paragraphs(post.body).map((text, i) => <p key={i}>{text}</p>)}
                    </div>
                </article>
            </DialogContent>
        )}
    </Dialog>
)

// The size cycle bento tiles are drawn from. Any window of it tiles a 4-column
// grid tightly enough that `grid-flow-dense` leaves no obvious holes, and the
// "big" sizes (anything spanning two axes or rows) carry longer previews.
export const SIZE_CYCLE = [
    'sm:col-span-2 sm:row-span-2', // 2x2 hero
    'sm:col-span-2',               // wide strip
    '',                            // standard card
    'sm:row-span-2',               // tall card
    '',                            // standard card
    'sm:col-span-2 sm:row-span-2', // 2x2 hero
    'sm:col-span-2',               // wide strip
    '',                            // standard card
    'sm:row-span-2',               // tall card
    '',                            // standard card
]

export const bentoSpan = (i, shift) => SIZE_CYCLE[(i + shift) % SIZE_CYCLE.length]

// The grid both blog views lay their tiles into. Dense flow backfills holes
// left by the 2x2 / tall / wide tiles so the surface never gaps out.
export const BENTO_GRID =
    'grid grid-flow-row-dense grid-cols-1 auto-rows-[10.5rem] gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5'

// One bento box: the cover fills the whole tile, a soft gradient keeps the
// text legible, and the headline plus excerpt sit at the bottom edge.
export const BentoTile = ({ post, span, onClick, className }) => {
    const big = /span-2/.test(span ?? '')

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'group relative flex flex-col justify-end overflow-hidden rounded-xl border border-border bg-card p-4 text-left sm:p-5',
                'transition-all duration-300 hover:border-primary/50 hover:shadow-lift',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                span,
                className
            )}
        >
            {post.cover_image ? (
                <img
                    src={post.cover_image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <PenLine className="h-8 w-8 text-primary-strong" />
                </div>
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/15" />

            <div className="relative">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>{formatDate(post.published_at)}</span>
                    <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {readingTime(post.body)} min
                    </span>
                </p>
                <h2
                    className={cn(
                        'mt-1.5 font-bold leading-snug text-foreground transition-colors group-hover:text-primary-strong',
                        big ? 'text-lg sm:text-2xl' : 'text-base'
                    )}
                >
                    {post.title}
                </h2>
                {big && post.excerpt && (
                    <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm line-clamp-3">{post.excerpt}</p>
                )}
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-strong">
                    Read post
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
            </div>
        </button>
    )
}
