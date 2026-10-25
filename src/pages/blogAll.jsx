import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageShell from '@/components/PageShell'
import { BENTO_GRID, BentoTile, PostDialog, bentoSpan } from '@/components/BlogShared'
import { FALLBACK_BLOG } from '@/data/profile'

// The whole blog, on its own page (/blog/all). It stands alone — no
// dashboard shell — with just a way back up top, and every entry opens
// in the same reader dialog as the bento on the dashboard.
const BlogAll = () => {
    const { blog } = useOutletContext()
    const posts = blog?.length ? blog : FALLBACK_BLOG
    const [open, setOpen] = useState(null)
    const shift = useMemo(() => Math.floor(Math.random() * 10), [])

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-strong hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to portfolio
                    </Link>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
                    </span>
                </div>
            </header>

            <PageShell
                index="07"
                label="blog"
                title="All blog entries"
                description="Every note and story, newest first."
            >
                <div className={BENTO_GRID}>
                    {posts.map((post, i) => (
                        <BentoTile
                            key={post.id}
                            post={post}
                            span={bentoSpan(i, shift)}
                            onClick={() => setOpen(post)}
                        />
                    ))}
                </div>

                <PostDialog post={open} onClose={() => setOpen(null)} />
            </PageShell>
        </div>
    )
}

export default BlogAll
