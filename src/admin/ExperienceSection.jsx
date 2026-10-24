import { useEffect, useMemo, useState } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { db } from '@/hooks/usePortfolioData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCrud } from './crud'
import {
  Chip, ConfirmDialog, EmptyState, Field, ListSkeleton, Notice, Row, SectionHeader, Sheet, Switch,
} from './ui'

const formFor = (row) => ({
  title: row?.title ?? '',
  company: row?.company ?? '',
  date: row?.date ?? '',
  type: row?.type ?? '',
  description: row?.description ?? '',
  is_current: row?.is_current ?? false,
  display_order: row?.display_order ?? 0,
})

function ExperienceEditor({ open, row, onClose, onSaved, toast }) {
  const initial = useMemo(() => formFor(row), [row])
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [tried, setTried] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const dirty = JSON.stringify(form) !== JSON.stringify(initial)
  const missing = (key) => (tried && !form[key].trim() ? 'This is required.' : '')

  const save = async () => {
    setTried(true)
    if (!form.title.trim() || !form.company.trim() || !form.date.trim()) return
    setSaving(true)
    const payload = { ...form, type: form.type.trim() || null }
    const { error } = row ? await db.experience.update(row.id, payload) : await db.experience.insert(payload)
    setSaving(false)
    if (error) return toast(error.message, 'error')
    toast(row ? 'Experience saved' : 'Experience added', 'success')
    onSaved()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={row ? 'Edit experience' : 'New experience'}
      description={row ? `${row.title} at ${row.company}` : 'A role, internship or freelance job.'}
      dirty={dirty}
      saving={saving}
      submitLabel={row ? 'Save changes' : 'Add experience'}
      onSubmit={save}
    >
      <Field label="Role" error={missing('title')}>
        <Input value={form.title} onChange={set('title')} placeholder="Front End Developer" autoFocus />
      </Field>
      <Field label="Company" error={missing('company')}>
        <Input value={form.company} onChange={set('company')} placeholder="Inventiv Softwares" />
      </Field>
      <Field label="When" hint="Write it the way you want it shown." error={missing('date')}>
        <Input value={form.date} onChange={set('date')} placeholder="January 2025 - Present" />
      </Field>
      <Field label="Employment type" hint="Optional, such as Part time or Contract.">
        <Input value={form.type} onChange={set('type')} placeholder="Part time" />
      </Field>
      <Field label="What you did">
        <Textarea rows={5} value={form.description} onChange={set('description')} />
      </Field>
      <Switch
        checked={form.is_current}
        onChange={(is_current) => setForm({ ...form, is_current })}
        label="I still work here"
      />
      <Field label="Position" hint="Lower numbers appear first.">
        <Input type="number" min="0" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: +e.target.value })} className="max-w-28" />
      </Field>
    </Sheet>
  )
}

export default function ExperienceSection({ toast, startNew }) {
  const crud = useCrud({ list: db.experience.list, remove: db.experience.remove, toast, noun: 'Experience' })
  const [query, setQuery] = useState('')

  // Arriving from an Overview shortcut opens the editor straight away.
  useEffect(() => { if (startNew) crud.openEditor() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const q = query.trim().toLowerCase()
  const shown = crud.items.filter((e) => `${e.title} ${e.company}`.toLowerCase().includes(q))

  return (
    <>
      <SectionHeader
        title="Experience"
        description="Roles and jobs, in the order you set."
        count={crud.items.length}
        query={query}
        onQuery={setQuery}
        onNew={() => crud.openEditor()}
        newLabel="New experience"
      />

      <div className="mb-5">
        <Notice>
          The Experience page on your site is currently written in the site&apos;s code, so changes made here
          won&apos;t show up there yet.
        </Notice>
      </div>

      {crud.loading ? (
        <ListSkeleton />
      ) : crud.items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience yet"
          body="Add a role to start your timeline."
          action={<Button onClick={() => crud.openEditor()} className="rounded-full"><Plus /> New experience</Button>}
        />
      ) : shown.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Nothing matches “{query}”.</p>
      ) : (
        <ul className="space-y-2">
          {shown.map((e) => (
            <Row
              key={e.id}
              title={e.title}
              meta={`${e.company} · ${e.date}`}
              chip={e.is_current && <Chip tone="live">Current</Chip>}
              onEdit={() => crud.openEditor(e)}
              onDelete={() => crud.setToDelete(e)}
              deleting={crud.deleting && crud.toDelete?.id === e.id}
            />
          ))}
        </ul>
      )}

      {crud.editor.mounted && (
        <ExperienceEditor
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
        body="This entry will be removed. This can't be undone."
        confirmLabel="Delete entry"
        busy={crud.deleting}
        onCancel={() => crud.setToDelete(null)}
        onConfirm={crud.confirmDelete}
      />
    </>
  )
}
