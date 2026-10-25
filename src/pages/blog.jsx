import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowUpRight, Newspaper } from 'lucide-react'
import PageShell from '@/components/PageShell'
import { BENTO_GRID, BentoSkeleton, BentoTile, PostDialog, planBento } from '@/components/BlogShared'
import { FALLBACK_BLOG } from '@/data/profile'
import { cn } from '@/lib/utils'

// The dashboard shows a bento taste of the blog only; the rest of the
// entries live on /blog/all, which the last tile opens. Empty slots pad the
// rest of the bento out until real posts fill them. Including the CTA there
// are 8 tiles — three full bands on desktop, one screen tall.
const TILE_COUNT = 8

const Blog = () => {
    const { blog } = useOutletContext()
    const posts = blog?.length ? blog : FALLBACK_BLOG
    const preview = posts.slice(0, TILE_COUNT - 1)
    const tiles = [
        ...preview,
        ...Array(Math.max(0, TILE_COUNT - 1 - preview.length)).fill(null),
    ]
    const remaining = Math.max(0, posts.length - (TILE_COUNT - 1))
    const [open, setOpen] = useState(null)
    // One layout plan per visit; it holds still while someone reads.
    const spans = useMemo(() => planBento(TILE_COUNT), [])
    const ctaSpan = spans[TILE_COUNT - 1]
    const ctaTall = /row-span-2/.test(ctaSpan)

    return (
    <PageShell
        index="07"
        label="blog"
        title="Blog"
        description="Notes on work, growth and the things I'm figuring out along the way."
    >
        <div className={BENTO_GRID}>
            {tiles.map((post, i) =>
                post ? (
                    <BentoTile
                        key={post.id}
                        post={post}
                        span={spans[i]}
                        onClick={() => setOpen(post)}
                    />
                ) : (
                    <BentoSkeleton key={`slot-${i}`} span={spans[i]} />
                )
            )}

            <Link
                to="/blog/all"
                className={cn(
                    'group relative flex flex-col justify-center overflow-hidden rounded-xl border border-border',
                    'bg-secondary p-4 shadow-lift transition-all duration-300 hover:border-primary/50 hover:bg-primary-soft',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    ctaSpan
                )}
            >
                <Newspaper className="absolute right-4 top-4 h-5 w-5 text-primary-strong/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    want more?
                </p>
                <h2
                    className={cn(
                        'mt-1 font-bold leading-snug text-foreground',
                        ctaTall ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                    )}
                >
                    View all blog entries
                </h2>
                {ctaTall && (
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        {remaining > 0
                            ? `${remaining} more ${remaining === 1 ? 'entry' : 'entries'} on the blog page`
                            : 'Everything I have written so far'}
                    </p>
                )}
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary-strong">
                    View all <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
            </Link>
        </div>

        <PostDialog post={open} onClose={() => setOpen(null)} />
    </PageShell>
    )
}

export default Blog
