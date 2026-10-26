import { ArrowUpRight, Clock, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// Bits shared by the blog bento on the dashboard scroll and the full
// /blog/all page: the reader dialog, the bento tile and its layout plan.

const WORDS_PER_MINUTE = 200

export const paragraphs = (body) => body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

export const readingTime = (body) => Math.max(1, Math.round(body.trim().split(/\s+/).length / WORDS_PER_MINUTE))

export const MarkdownBody = ({ body }) => (
    <div className="space-y-5 text-sm leading-relaxed text-foreground/90 sm:text-base [&_a]:font-medium [&_a]:text-primary-strong [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_del]:line-through [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:border-border [&_li]:ml-5 [&_li]:pl-1 [&_ol]:list-decimal [&_p]:whitespace-pre-wrap [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-secondary [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-bold [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-secondary [&_th]:p-2 [&_ul]:list-disc">
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                ),
                img: ({ src, alt }) => (
                    <img src={src} alt={alt ?? ''} loading="lazy" className="my-4 max-h-[32rem] rounded-xl object-contain" />
                ),
            }}
        >
            {body}
        </ReactMarkdown>
    </div>
)

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
        <div className={`w-full bg-secondary ${className}`} />
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
                    <div className="mt-6">
                        <MarkdownBody body={post.body} />
                    </div>
                </article>
            </DialogContent>
        )}
    </Dialog>
)

// The grid both blog views lay their tiles into. Dense flow plus a planned
// span sequence (below) keep the surface packed edge to edge.
export const BENTO_GRID =
    'grid grid-cols-1 grid-flow-row-dense auto-rows-[9rem] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[8rem] sm:gap-5'

// Tile shapes. Hero is 2x2, tall is a full column of the band, wide a full
// strip, standard a single cell. On sm the grid is 2 columns and every tile
// just stacks full-width, so holes are impossible below lg.
const SHAPES = {
    hero: 'sm:col-span-2 sm:row-span-2',
    tall: 'sm:col-span-2 sm:row-span-2 lg:col-span-1',
    wide: 'sm:col-span-2',
    std: 'sm:col-span-2 lg:col-span-1',
}

// The layout is planned band by band: each band is an ordered group of tiles
// that fills one 4-column x 2-row strip exactly, so no whitespace can appear
// between cards, whatever combination is drawn. Each visit draws a different
// plan; it stays put while someone reads.
const HERO_BANDS = [
    [SHAPES.hero, SHAPES.tall, SHAPES.tall],
    [SHAPES.tall, SHAPES.hero, SHAPES.tall],
]
const HERO_PAIR = [SHAPES.hero, SHAPES.hero]
const TALL_BAND = [SHAPES.tall, SHAPES.tall, SHAPES.tall, SHAPES.tall]
const WIDE_BAND = [SHAPES.wide, SHAPES.wide, SHAPES.wide, SHAPES.wide]
const MIXED_BAND = [SHAPES.wide, SHAPES.std, SHAPES.std, SHAPES.wide, SHAPES.std, SHAPES.std]

const FILLER_BANDS = [HERO_BANDS[0], HERO_BANDS[1], HERO_PAIR, TALL_BAND, WIDE_BAND, MIXED_BAND]
// The closing band must end on a tall or standard slot, so the CTA tile
// (always last, bottom-right of the whole grid) stays compact.
const CLOSING_BAND_LENGTHS = [3, 4, 6]

// Span classes for every tile, CTA included as the final entry.
export const planBento = (tileCount) => {
    // Choose the closing band's size first: what's left before it must be
    // coverable by whole filler bands (i.e. never a lone 1-cell remainder).
    const lengths = CLOSING_BAND_LENGTHS.filter(
        (len) => tileCount - len === 0 || tileCount - len >= 2
    )
    // With fewer tiles than any closing band needs, a strip of standard
    // cards still tiles every row exactly — a safe fallback.
    if (!lengths.length) return Array(tileCount).fill(SHAPES.std)

    const closingLength = lengths[Math.floor(Math.random() * lengths.length)]
    const closers = { 3: HERO_BANDS, 4: [TALL_BAND], 6: [MIXED_BAND] }
    const pool = closers[closingLength]
    const closing = pool[Math.floor(Math.random() * pool.length)]

    const bands = []
    let remaining = tileCount - closingLength
    while (remaining > 0) {
        const eligible = FILLER_BANDS.filter(
            (band) => band.length <= remaining && remaining - band.length !== 1
        )
        const band = eligible[Math.floor(Math.random() * eligible.length)]
        bands.push(band)
        remaining -= band.length
    }
    bands.push(closing)
    return bands.flat()
}

// An empty slot waiting for a future post: just a dashed frame, no content.
export const BentoSkeleton = ({ span, className }) => (
    <div
        aria-hidden="true"
        className={cn(
            'rounded-xl border border-dashed border-primary/25 bg-secondary/40',
            span,
            className
        )}
    />
)

// One bento box: the cover fills the whole tile, a soft gradient keeps the
// text legible, and the headline plus excerpt sit at the bottom edge.
export const BentoTile = ({ post, span, to, className }) => {
    const big = /row-span-2/.test(span ?? '')

    return (
        <Link
            to={to}
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
                <div className="absolute inset-0 bg-secondary" />
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
        </Link>
    )
}
