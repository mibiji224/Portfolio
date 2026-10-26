import { createElement, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bold, Clock, Code, Eye, Heading2, Italic, Link2, List, ListOrdered, Newspaper, PenLine, Plus, Quote,
  X,
} from 'lucide-react'
import { db } from '@/hooks/usePortfolioData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MarkdownBody } from '@/components/BlogShared'
import { useCrud } from './crud'
import {
  Chip, ConfirmDialog, DropZone, EmptyState, Field, ListSkeleton, Row, SectionHeader, Sheet, Switch,
  uploadImage, useObjectUrl,
} from './ui'

const today = () => new Date().toISOString().slice(0, 10)
const words = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0)
const minutes = (text) => Math.max(1, Math.round(words(text) / 200))
const slugify = (text) =>
  text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const formFor = (row) => ({
  title: row?.title ?? '',
  slug: row?.slug ?? slugify(row?.title ?? ''),
  excerpt: row?.excerpt ?? '',
  body: row?.body ?? '',
  published_at: row?.published_at ?? today(),
  is_published: row?.is_published ?? true,
  display_order: row?.display_order ?? 0,
})

const formatDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

// How the post will look on the site's Blog section, updating as you type.
const Preview = ({ form, cover }) => (
  <div>
    <p className="mb-2 text-sm font-medium text-foreground">Preview</p>
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {cover ? (
        <img src={cover} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-secondary">
          <PenLine className="h-9 w-9 text-primary-strong" />
        </div>
      )}
      <div className="p-4">
        <p className="flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground">
          <span>{formatDate(form.published_at)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {minutes(form.body)} min read</span>
        </p>
        <p className="mt-1.5 text-base font-bold leading-snug text-foreground">
          {form.title.trim() || 'Your title appears here'}
        </p>
        {form.excerpt.trim() && <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">{form.excerpt}</p>}
      </div>
    </div>
  </div>
)

function BlogEditor({ open, row, onClose, onSaved, toast }) {
  const initial = useMemo(() => formFor(row), [row])
  const [form, setForm] = useState(initial)
  // The header photo: a freshly picked file wins over the one already saved.
  const [file, setFile] = useState(null)
  const [coverUrl, setCoverUrl] = useState(row?.cover_image ?? '')
  const [slugEdited, setSlugEdited] = useState(Boolean(row))
  const [saving, setSaving] = useState(false)
  const [tried, setTried] = useState(false)
  const [bodyTab, setBodyTab] = useState('write')
  const bodyRef = useRef(null)

  const picked = useObjectUrl(file)
  const cover = picked || coverUrl

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const formatBody = (prefix, suffix = '', placeholder = 'Text') => {
    const textarea = bodyRef.current
    const start = textarea?.selectionStart ?? form.body.length
    const end = textarea?.selectionEnd ?? form.body.length
    const selected = form.body.slice(start, end)
    const content = selected || placeholder
    const next = `${form.body.slice(0, start)}${prefix}${content}${suffix}${form.body.slice(end)}`
    setForm({ ...form, body: next })
    requestAnimationFrame(() => {
      textarea?.focus()
      const selectionStart = start + prefix.length
      textarea?.setSelectionRange(selectionStart, selectionStart + content.length)
    })
  }
  const dirty =
    JSON.stringify(form) !== JSON.stringify(initial) || Boolean(file) || coverUrl !== (row?.cover_image ?? '')

  const save = async () => {
    setTried(true)
    if (!form.title.trim() || !form.body.trim()) return
    setSaving(true)
    try {
      const cover_image = file ? await uploadImage(file, 'blog') : coverUrl || null
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: slugify(form.slug || form.title),
        cover_image,
      }
      const { error } = row ? await db.blog.update(row.id, payload) : await db.blog.insert(payload)
      if (error) throw error
      toast(row ? 'Post saved' : form.is_published ? 'Post published' : 'Draft saved', 'success')
      onSaved()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={row ? 'Edit post' : 'New post'}
      description={row ? row.title : 'Write it, add a header photo, and publish.'}
      dirty={dirty}
      saving={saving}
      submitLabel={row ? 'Save changes' : form.is_published ? 'Publish post' : 'Save draft'}
      onSubmit={save}
    >
      <Preview form={form} cover={cover} />

      <Field label="Header photo" hint="Wide images (16:9) look best. Optional.">
        {cover ? (
          <div className="flex items-center gap-3">
            <img src={cover} alt="" className="h-16 w-28 rounded-lg border border-border object-cover" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => { setFile(null); setCoverUrl('') }}
            >
              <X /> Remove photo
            </Button>
          </div>
        ) : (
          <DropZone title="Drop a photo here, or click to choose" hint="JPG, PNG or WebP" onFiles={([f]) => setFile(f)} />
        )}
      </Field>

      <Field label="Title" error={tried && !form.title.trim() ? 'Give the post a title.' : ''}>
        <Input
          value={form.title}
          onChange={(e) => {
            const title = e.target.value
            setForm({ ...form, title, ...(!slugEdited ? { slug: slugify(title) } : {}) })
          }}
          placeholder="Live for Yourself, Too"
        />
      </Field>

      <Field label="Share link" hint="This unique slug is part of the post's shareable URL. You can customize it.">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm text-muted-foreground">/blog/</span>
          <Input
            value={form.slug}
            onChange={(e) => {
              setSlugEdited(true)
              setForm({ ...form, slug: slugify(e.target.value) })
            }}
            placeholder="your-post-title"
          />
        </div>
      </Field>

      <Field label="Summary" hint="One or two sentences shown on the card.">
        <Textarea rows={2} value={form.excerpt} onChange={set('excerpt')} />
      </Field>

      <Field
        label="Post"
        hint={`${words(form.body)} words · about ${minutes(form.body)} min read. Markdown supported: headings, bold, italic, links, lists, quotes, code and tables.`}
        error={tried && !form.body.trim() ? 'Write something first.' : ''}
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1" aria-label="Markdown formatting">
            {[
              { label: 'Bold', icon: Bold, prefix: '**', suffix: '**' },
              { label: 'Italic', icon: Italic, prefix: '*', suffix: '*' },
              { label: 'Heading', icon: Heading2, prefix: '## ', placeholder: 'Heading' },
              { label: 'Bulleted list', icon: List, prefix: '- ', placeholder: 'List item' },
              { label: 'Numbered list', icon: ListOrdered, prefix: '1. ', placeholder: 'List item' },
              { label: 'Quote', icon: Quote, prefix: '> ', placeholder: 'Quote' },
              { label: 'Link', icon: Link2, prefix: '[', suffix: '](https://example.com)', placeholder: 'Link text' },
              { label: 'Code', icon: Code, prefix: '`', suffix: '`' },
            ].map((format) => (
              <button
                key={format.label}
                type="button"
                title={format.label}
                aria-label={format.label}
                disabled={bodyTab !== 'write'}
                onClick={() => formatBody(format.prefix, format.suffix, format.placeholder)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
              >
                {createElement(format.icon, { size: 15 })}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-full border border-border p-1">
            <button
              type="button"
              onClick={() => setBodyTab('write')}
              aria-pressed={bodyTab === 'write'}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${bodyTab === 'write' ? 'bg-primary-soft text-primary-strong' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <PenLine size={13} /> Write
            </button>
            <button
              type="button"
              onClick={() => setBodyTab('preview')}
              aria-pressed={bodyTab === 'preview'}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${bodyTab === 'preview' ? 'bg-primary-soft text-primary-strong' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Eye size={13} /> Preview
            </button>
          </div>
        </div>
        {bodyTab === 'write' ? (
          <Textarea
            ref={bodyRef}
            rows={14}
            value={form.body}
            onChange={set('body')}
            className="leading-relaxed"
            placeholder={'## A section heading\n\nWrite your post here. Use **bold**, *italic*, lists, links, quotes, and code.'}
          />
        ) : (
          <div className="min-h-64 rounded-xl border border-input bg-card p-4">
            {form.body.trim()
              ? <MarkdownBody body={form.body} />
              : <p className="text-sm text-muted-foreground">Your formatted post preview will appear here.</p>}
          </div>
        )}
      </Field>

      <Field label="Date">
        <Input type="date" value={form.published_at} onChange={set('published_at')} className="max-w-48" />
      </Field>

      <Switch
        checked={form.is_published}
        onChange={(is_published) => setForm({ ...form, is_published })}
        label="Show on my site"
        hint={form.is_published ? 'Visitors can read this post.' : 'Saved as a draft. Only you can see it.'}
      />
    </Sheet>
  )
}

export default function BlogSection({ toast, startNew }) {
  const crud = useCrud({ list: db.blog.list, remove: db.blog.remove, toast, noun: 'Post' })
  const [query, setQuery] = useState('')

  // Arriving from an Overview shortcut opens the editor straight away.
  useEffect(() => { if (startNew) crud.openEditor() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const shown = crud.items.filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <>
      <SectionHeader
        title="Blog"
        description="Posts shown in the Blog section of your site, newest first."
        count={crud.items.length}
        query={query}
        onQuery={setQuery}
        onNew={() => crud.openEditor()}
        newLabel="New post"
      />

      {crud.loading ? (
        <ListSkeleton />
      ) : crud.items.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No posts yet"
          body="If you just set this up, run supabase/blog_posts.sql in Supabase to create the table and your first post."
          action={<Button onClick={() => crud.openEditor()} className="rounded-full"><Plus /> New post</Button>}
        />
      ) : shown.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No posts match “{query}”.</p>
      ) : (
        <ul className="space-y-2">
          {shown.map((p) => (
            <Row
              key={p.id}
              thumb={p.cover_image}
              title={p.title}
              meta={`${formatDate(p.published_at)} · ${minutes(p.body)} min read`}
              chip={<Chip tone={p.is_published ? 'live' : 'draft'}>{p.is_published ? 'Published' : 'Draft'}</Chip>}
              onEdit={() => crud.openEditor(p)}
              onDelete={() => crud.setToDelete(p)}
              deleting={crud.deleting && crud.toDelete?.id === p.id}
            />
          ))}
        </ul>
      )}

      {crud.editor.mounted && (
        <BlogEditor
          key={crud.editor.row?.id ?? 'new'}
          open={crud.editor.open}
          row={crud.editor.row}
          toast={toast}
          onClose={crud.closeEditor}
          onSaved={() => { crud.closeEditor(); crud.reload() }}
        />
      )}

      <ConfirmDialog
        open={Boolean(crud.toDelete)}
        title={`Delete “${crud.toDelete?.title}”?`}
        body="The post will be removed from your site. This can't be undone."
        confirmLabel="Delete post"
        busy={crud.deleting}
        onCancel={() => crud.setToDelete(null)}
        onConfirm={crud.confirmDelete}
      />
    </>
  )
}
