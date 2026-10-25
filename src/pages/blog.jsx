import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowUpRight, Newspaper } from 'lucide-react'
import PageShell from '@/components/PageShell'
import { BentoTile, PostDialog, bentoSpan } from '@/components/BlogShared'
import { FALLBACK_BLOG } from '@/data/profile'

// The dashboard shows a bento taste of the blog only; the rest of the
// entries live on /blog/all, which the last tile opens.
const PREVIEW_COUNT = 7

const CTA_SPAN = 'sm:col-span-2 sm:row-span-2'

const Blog = () => {
    const { blog } = useOutletContext()
    const posts = blog?.length ? blog : FALLBACK_BLOG
    const preview = posts.slice(0, PREVIEW_COUNT)
    const remaining = Math.max(0, posts.length - PREVIEW_COUNT)
    const [open, setOpen] = useState(null)
    // Each visit cuts the size cycle at a different point, so the bento is
    // rearranged between visits but holds still while someone reads it.
    const shift = useMemo(() => Math.floor(Math.random() * 10), [])

    return (
    <PageShell
        index="07"
        label="blog"
        title="Blog"
        description="Notes on work, growth and the things I'm figuring out along the way."
    >
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 auto-rows-[10.5rem] sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {preview.map((post, i) => (
                <BentoTile
                    key={post.id}
                    post={post}
                    span={bentoSpan(i, shift)}
                    onClick={() => setOpen(post)}
                />
            ))}

            <Link
                to="/blog/all"
                className={`
                    group relative flex flex-col justify-end overflow-hidden rounded-xl border border-border
                    bg-secondary p-4 sm:p-5 shadow-lift
                    transition-all duration-300 hover:border-primary/50 hover:bg-primary-soft
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                    ${CTA_SPAN}
                `}
            >
                <Newspaper className="absolute right-4 top-4 h-5 w-5 text-primary-strong/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    want more?
                </p>
                <h2 className="mt-1.5 text-lg font-bold leading-snug text-foreground sm:text-2xl">
                    View all blog entries
                </h2>
                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                    {remaining > 0
                        ? `${remaining} more ${remaining === 1 ? 'entry' : 'entries'} on the blog page`
                        : 'Everything I have written so far'}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-strong">
                    View all <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
            </Link>
        </div>

        <PostDialog post={open} onClose={() => setOpen(null)} />
    </PageShell>
    )
}

export default Blog
