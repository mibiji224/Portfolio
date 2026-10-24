import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Clock, PenLine, X } from 'lucide-react'
import PageShell from '@/components/PageShell'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { FALLBACK_BLOG } from '@/data/profile'

const WORDS_PER_MINUTE = 200

const paragraphs = (body) => body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

const readingTime = (body) => Math.max(1, Math.round(body.trim().split(/\s+/).length / WORDS_PER_MINUTE))

const formatDate = (iso) =>
    iso
        ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : ''

// A post with no header photo yet gets a quiet placeholder instead of a gap.
const Cover = ({ post, className }) =>
    post.cover_image ? (
        <img src={post.cover_image} alt="" loading="lazy" decoding="async" className={`w-full object-cover ${className}`} />
    ) : (
        <div className={`flex w-full items-center justify-center bg-secondary ${className}`}>
            <PenLine className="h-10 w-10 text-primary-strong" />
        </div>
    )

const Meta = ({ post }) => (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <span>{formatDate(post.published_at)}</span>
        <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {readingTime(post.body)} min read
        </span>
    </p>
)

const Blog = () => {
    const { blog } = useOutletContext()
    const posts = blog?.length ? blog : FALLBACK_BLOG
    const [open, setOpen] = useState(null)

    return (
        <PageShell
            index="07"
            label="blog"
            title="Blog"
            description="Notes on work, growth and the things I'm figuring out along the way."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {posts.map((post) => (
                    <button
                        key={post.id}
                        type="button"
                        onClick={() => setOpen(post)}
                        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all duration-300 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <div className="overflow-hidden">
                            <Cover post={post} className="h-48 transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                            <Meta post={post} />
                            <h2 className="mt-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary-strong">
                                {post.title}
                            </h2>
                            {post.excerpt && (
                                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                            )}
                            <span className="mt-auto pt-4 text-xs font-semibold text-primary-strong">Read post</span>
                        </div>
                    </button>
                ))}
            </div>

            <Dialog open={Boolean(open)} onOpenChange={(next) => !next && setOpen(null)}>
                {open && (
                    <DialogContent
                        showCloseButton={false}
                        className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto p-0"
                    >
                        <button
                            type="button"
                            onClick={() => setOpen(null)}
                            aria-label="Close"
                            className="absolute right-3 top-3 z-10 rounded-full border border-border bg-background/90 p-1.5 text-foreground backdrop-blur hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <Cover post={open} className="h-48 sm:h-64" />

                        <article className="p-5 sm:p-8">
                            <Meta post={open} />
                            <DialogTitle className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                {open.title}
                            </DialogTitle>
                            <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
                                {paragraphs(open.body).map((text, i) => <p key={i}>{text}</p>)}
                            </div>
                        </article>
                    </DialogContent>
                )}
            </Dialog>
        </PageShell>
    )
}

export default Blog
