import { useMemo } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageShell from '@/components/PageShell'
import { BENTO_GRID, BentoSkeleton, BentoTile, planBento } from '@/components/BlogShared'
import { FALLBACK_BLOG } from '@/data/profile'
import { postPath } from '@/lib/blog'

// The whole blog, on its own page (/blog/all). It stands alone — no
// dashboard shell — with just a way back up top.
const BlogAll = () => {
    const { blog } = useOutletContext()
    const posts = blog?.length ? blog : FALLBACK_BLOG
    const tiles = [
        ...posts,
        ...Array(Math.max(0, 7 - posts.length)).fill(null),
    ]
    const layoutSeed = tiles.map((post, i) => post?.slug || post?.id || `placeholder-${i}`).join('|')
    const spans = useMemo(() => planBento(tiles.length, layoutSeed), [layoutSeed, tiles.length])

    return (
        <div className="min-h-[100dvh] bg-background">
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
                hideLabel
            >
                <div className={BENTO_GRID}>
                    {tiles.map((post, i) => post ? (
                            <BentoTile
                                key={post.id}
                                post={post}
                                span={spans[i]}
                                to={postPath(post)}
                            />
                    ) : (
                        <BentoSkeleton key={`slot-${i}`} span={spans[i]} />
                    ))}
                </div>
            </PageShell>
        </div>
    )
}

export default BlogAll
