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

export const PostByline = () => (
    <p className="mt-2 text-sm text-muted-foreground">Written by Desiree Soronio</p>
)

export const Cover = ({ post, className }) =>
    post.cover_image
        ? <img src={post.cover_image} alt="" loading="lazy" decoding="async" className={`w-full object-cover ${className}`} />
        : null

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

                {post.cover_image && <Cover post={post} className="h-48 sm:h-64" />}

                <article className="p-5 sm:p-8">
                    <Meta post={post} />
                    <DialogTitle className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {post.title}
                    </DialogTitle>
                    <PostByline />
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

// Each tile chooses its own width and height. The mixed spans intentionally
// avoid a repeated band pattern; dense placement packs the varied shapes.
const TILE_SHAPES = [
    'sm:col-span-2 lg:col-span-1',
    'sm:col-span-2 lg:col-span-2',
    'sm:col-span-2 lg:col-span-3',
    'sm:col-span-2 lg:col-span-1 lg:row-span-2',
    'sm:col-span-2 lg:col-span-2 lg:row-span-2',
    'sm:col-span-2 lg:col-span-1 lg:row-span-3',
    'sm:col-span-2 lg:col-span-3 lg:row-span-2',
]

// Span classes for every tile, including the dashboard's final CTA.
export const planBento = (tileCount) => {
    const spans = []
    for (let i = 0; i < tileCount; i += 1) {
        const recent = spans.slice(-2)
        const choices = TILE_SHAPES.filter((shape) => !recent.includes(shape))
        spans.push(choices[Math.floor(Math.random() * choices.length)])
    }
    return spans
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
    const roomy = /(?:col-span-[23]|row-span-[23])/.test(span ?? '')

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
            {post.cover_image && (
                <img
                    src={post.cover_image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            )}
            {post.cover_image && (
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/15" />
            )}

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
                        roomy ? 'text-lg sm:text-2xl' : 'text-base'
                    )}
                >
                    {post.title}
                </h2>
                {roomy && post.excerpt && (
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
