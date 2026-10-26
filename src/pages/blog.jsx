import { useMemo } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowUpRight, Newspaper } from 'lucide-react'
import PageShell from '@/components/PageShell'
import { BENTO_GRID, BentoSkeleton, BentoTile, planBento } from '@/components/BlogShared'
import { FALLBACK_BLOG } from '@/data/profile'
import { postPath } from '@/lib/blog'
import { cn } from '@/lib/utils'

const Blog = () => {
    const { blog } = useOutletContext()
    const posts = blog?.length ? blog : FALLBACK_BLOG
    const preview = posts.slice(0, 7)
    const remaining = Math.max(0, posts.length - preview.length)
    // One layout plan per visit; it holds still while someone reads.
    const spans = useMemo(() => planBento(preview.length + 1), [preview.length])
    const ctaSpan = spans[preview.length]
    const ctaTall = /(?:col-span-[234]|row-span-2)/.test(ctaSpan)

    return (
    <PageShell
        index="07"
        label="blog"
        title="Blog"
        description="Notes on work, growth and the things I'm figuring out along the way."
    >
        <div className={BENTO_GRID}>
            {preview.map((post, i) => (
                    <BentoTile
                        key={post.id}
                        post={post}
                        span={spans[i]}
                        to={postPath(post)}
                    />
            ))}

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
    </PageShell>
    )
}

export default Blog
