import { useEffect, useMemo, useState } from 'react'
import { FolderGit2, Plus, X } from 'lucide-react'
import { db } from '@/hooks/usePortfolioData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { mergeSubset, useCrud } from './crud'
import SortableList from './SortableList'
import {
  Chip, ConfirmDialog, DropZone, EmptyState, Field, ListSkeleton, Row, SectionHeader, Segmented,
  Sheet, Switch, uploadImage, useObjectUrl,
} from './ui'

const CATEGORIES = [
  { value: 'development', label: 'Development' },
  { value: 'art', label: 'Creative art' },
  { value: 'graphics', label: 'Graphics' },
]
const categoryLabel = (value) => CATEGORIES.find((c) => c.value === value)?.label ?? value

const formFor = (row) => ({
  title: row?.title ?? '',
  subtitle: row?.subtitle ?? '',
  description: row?.description ?? '',
  category: row?.category ?? 'development',
  tech_stack: Array.isArray(row?.tech_stack) ? row.tech_stack.join(', ') : row?.tech_stack ?? '',
  demo_url: row?.demo_url ?? '',
  github_url: row?.github_url ?? '',
  is_coming_soon: row?.is_coming_soon ?? false,
  display_order: row?.display_order ?? 0,
})

const NewImage = ({ file, onRemove }) => {
  const url = useObjectUrl(file)
  return <Thumb src={url} label="New" onRemove={onRemove} />
}

const Thumb = ({ src, label, onRemove }) => (
  <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-border">
    <img src={src} alt="" className="h-full w-full object-cover" />
    {label && (
      <span className="absolute bottom-1 left-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-primary-strong">
        {label}
      </span>
    )}
    <button
      type="button"
      onClick={onRemove}
      aria-label="Remove image"
      className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-white hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <X size={11} />
    </button>
  </div>
)

function ProjectEditor({ open, row, onClose, onSaved, toast }) {
  const initial = useMemo(() => formFor(row), [row])
  const [form, setForm] = useState(initial)
  const [kept, setKept] = useState(row?.images ?? [])
  const [files, setFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [tried, setTried] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const dirty =
    JSON.stringify(form) !== JSON.stringify(initial) ||
    files.length > 0 ||
    kept.length !== (row?.images ?? []).length

  const save = async () => {
    setTried(true)
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const uploaded = await Promise.all(files.map((f) => uploadImage(f)))
      const payload = {
        ...form,
        title: form.title.trim(),
        tech_stack: form.tech_stack ? form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean) : [],
        images: [...kept, ...uploaded.map((src) => ({ src, caption: form.title.trim() }))],
      }
      const { error } = row ? await db.projects.update(row.id, payload) : await db.projects.insert(payload)
      if (error) throw error
      toast(row ? 'Project saved' : 'Project added', 'success')
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
      title={row ? 'Edit project' : 'New project'}
      description={row ? row.title : 'Shown in the Projects section of your site.'}
      dirty={dirty}
      saving={saving}
      submitLabel={row ? 'Save changes' : 'Add project'}
      onSubmit={save}
    >
      <Field label="Title" error={tried && !form.title.trim() ? 'Give the project a title.' : ''}>
        <Input value={form.title} onChange={set('title')} placeholder="BiteTrack" autoFocus />
      </Field>
      <Field label="Tagline or type" hint="A few words under the title. For art and graphics, the kind of piece, such as Illustration.">
        <Input value={form.subtitle} onChange={set('subtitle')} placeholder="Nutrition tracker app" />
      </Field>
      <Field label="Which section does it belong to?">
        <Segmented value={form.category} onChange={(category) => setForm({ ...form, category })} options={CATEGORIES} />
      </Field>
      <Field label="Description">
        <Textarea rows={4} value={form.description} onChange={set('description')} placeholder="What it is and what you did." />
      </Field>
      <Field label="Tools used" hint="Separate with commas.">
        <Input value={form.tech_stack} onChange={set('tech_stack')} placeholder="React, Tailwind CSS, Supabase" />
      </Field>

      <Field label="Images" hint="The first image is the cover.">
        {(kept.length > 0 || files.length > 0) && (
          <div className="mb-3 flex flex-wrap gap-3">
            {kept.map((img, i) => (
              <Thumb key={img.src} src={img.src} onRemove={() => setKept(kept.filter((_, idx) => idx !== i))} />
            ))}
            {files.map((file, i) => (
              <NewImage key={`${file.name}-${i}`} file={file} onRemove={() => setFiles(files.filter((_, idx) => idx !== i))} />
            ))}
          </div>
        )}
        <DropZone
          multiple
          title="Drop images here, or click to choose"
          hint="JPG, PNG or WebP"
          onFiles={(picked) => setFiles([...files, ...picked])}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Live demo link">
          <Input type="url" value={form.demo_url} onChange={set('demo_url')} placeholder="https://" />
        </Field>
        <Field label="GitHub link">
          <Input type="url" value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/" />
        </Field>
      </div>

      <Switch
        checked={form.is_coming_soon}
        onChange={(is_coming_soon) => setForm({ ...form, is_coming_soon })}
        label="Mark as coming soon"
        hint="Shows a coming soon badge instead of the links."
      />

      <Field label="Position" hint="Lower numbers appear first.">
        <Input type="number" min="0" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: +e.target.value })} className="max-w-28" />
      </Field>
    </Sheet>
  )
}

export default function ProjectsSection({ toast, startNew }) {
  const crud = useCrud({ list: db.projects.list, remove: db.projects.remove, update: db.projects.update, toast, noun: 'Project' })
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  // Arriving from an Overview shortcut opens the editor straight away.
  useEffect(() => { if (startNew) crud.openEditor() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const searching = query.trim().length > 0

  const inCategory = (p) => category === 'all' || p.category === category

  const shown = crud.items.filter((p) => inCategory(p) && p.title.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <>
      <SectionHeader
        title="Projects"
        description="Development, art and graphics work shown on your site."
        count={crud.items.length}
        query={query}
        onQuery={setQuery}
        onNew={() => crud.openEditor()}
        newLabel="New project"
      />

      {crud.items.length > 0 && (
        <div className="mb-4">
          <Segmented value={category} onChange={setCategory} options={[{ value: 'all', label: 'All' }, ...CATEGORIES]} />
        </div>
      )}

      {crud.loading ? (
        <ListSkeleton />
      ) : crud.items.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects yet"
          body="Add your first project with images, tools and links."
          action={<Button onClick={() => crud.openEditor()} className="rounded-full"><Plus /> New project</Button>}
        />
      ) : shown.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No projects match “{query}”.</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground">
            {searching
              ? 'Clear the search to drag projects into a new order.'
              : 'Drag the grip on the left to change the order. The same order is used on your site.'}
          </p>
          <SortableList
            items={shown}
            disabled={searching}
            onReorder={(next) => crud.reorder(mergeSubset(crud.items, next, inCategory))}
            renderRow={(p) => ({
              label: p.title,
              thumb: p.images?.[0]?.src,
              meta: `${categoryLabel(p.category)} · ${p.images?.length ?? 0} ${p.images?.length === 1 ? 'image' : 'images'}`,
              chip: p.is_coming_soon && <Chip tone="draft">Coming soon</Chip>,
              onEdit: () => crud.openEditor(p),
              onDelete: () => crud.setToDelete(p),
              deleting: crud.deleting && crud.toDelete?.id === p.id,
            })}
          />
        </>
      )}

      {crud.editor.mounted && (
        <ProjectEditor
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
        body="It will disappear from your site. This can't be undone."
        confirmLabel="Delete project"
        busy={crud.deleting}
        onCancel={() => crud.setToDelete(null)}
        onConfirm={crud.confirmDelete}
      />
    </>
  )
}
