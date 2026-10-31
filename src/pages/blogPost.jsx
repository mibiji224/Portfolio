import { useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Copy, Share2 } from 'lucide-react'
import { Cover, formatDate, MarkdownBody, PostByline, readingTime } from '@/components/BlogShared'
import { FALLBACK_BLOG } from '@/data/profile'

const BlogPost = () => {
  const { slug } = useParams()
  const { blog, loading } = useOutletContext()
  const [shareMessage, setShareMessage] = useState('')
  const posts = blog?.length ? blog : FALLBACK_BLOG
  const post = posts.find((entry) => (entry.slug || entry.id) === slug)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.excerpt || post.title, url })
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setShareMessage('Link copied')
      } else {
        throw new Error('Sharing is not supported in this browser.')
      }
    } catch (error) {
      if (error.name === 'AbortError') return
      setShareMessage(error.message || 'Could not share this post.')
    }
  }

  if (loading) {
    return <div className="min-h-[100dvh] bg-background" aria-busy="true" />
  }

  if (!post) {
    return (
      <div className="min-h-[100dvh] bg-background px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Post not found</h1>
          <p className="mt-3 text-muted-foreground">This post may have been removed or the link may be outdated.</p>
          <Link to="/blog/all" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-strong hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Browse all posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/blog/all"
            className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-strong transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>
          <button
            type="button"
            onClick={share}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {shareMessage === 'Link copied' ? <Check className="h-3.5 w-3.5" /> : navigator.share ? <Share2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {shareMessage || (navigator.share ? 'Share' : 'Copy link')}
          </button>
        </div>
      </header>

      <main className="px-4 py-8 font-sans sm:px-6 sm:py-10 lg:px-10">
        <article className="mx-auto max-w-3xl overflow-hidden bg-card">
          {post.cover_image && <Cover post={post} className="h-52 sm:h-80" />}
          <div className="p-5 sm:p-10">
            <p className="flex flex-wrap items-center gap-x-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>{formatDate(post.published_at)}</span>
              <span>{readingTime(post.body)} min read</span>
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{post.title}</h1>
            <PostByline />
            {post.excerpt && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{post.excerpt}</p>}
            <div className="mt-8">
              <MarkdownBody body={post.body} />
            </div>
            <div className="mt-8 border-t border-border pt-5">
              <button
                type="button"
                onClick={share}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-strong hover:text-foreground"
              >
                <Share2 className="h-4 w-4" /> {shareMessage || 'Share this post'}
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}

export default BlogPost
