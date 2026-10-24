import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { mergeSubset, useCrud } from './crud'
import SortableList from './SortableList'
import {
  ConfirmDialog, EmptyState, Field, ListSkeleton, Segmented, SectionHeader, Sheet,
} from './ui'

// One section of plain records (experience, certifications, education) described
// by a config: its fields, how a row reads in the list, and where it is stored.
// Everything here comes back out of `config.fields`, so adding a field to a
// section is one more entry there.

const initialValue = (field, row) => {
  const value = row?.[field.key]
  if (field.type === 'lines') return Array.isArray(value) ? value.join('\n') : ''
  return value ?? field.default ?? ''
}

const formFor = (config, row) =>
  Object.fromEntries(config.fields.map((f) => [f.key, initialValue(f, row)]))

const toPayload = (config, form) =>
  Object.fromEntries(
    config.fields.map((f) => {
      const value = form[f.key]
      if (f.type === 'lines') return [f.key, value.split('\n').map((l) => l.trim()).filter(Boolean)]
      const trimmed = typeof value === 'string' ? value.trim() : value
      return [f.key, f.nullable && trimmed === '' ? null : trimmed]
    })
  )

function Editor({ config, open, row, count, onClose, onSaved, toast }) {
  const initial = useMemo(() => formFor(config, row), [config, row])
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [tried, setTried] = useState(false)

  const dirty = JSON.stringify(form) !== JSON.stringify(initial)
  const missing = (f) => (tried && f.required && !String(form[f.key]).trim() ? 'This is required.' : '')

  const save = async () => {
    setTried(true)
    if (config.fields.some((f) => f.required && !String(form[f.key]).trim())) return
    setSaving(true)
    const payload = toPayload(config, form)
    // A new record goes to the end of the list.
    const { error } = row
      ? await config.source.update(row.id, payload)
      : await config.source.insert({ ...payload, display_order: count })
    setSaving(false)
    if (error) return toast(error.message, 'error')
    toast(row ? `${config.noun} saved` : `${config.noun} added`, 'success')
    onSaved()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={row ? `Edit ${config.noun.toLowerCase()}` : `New ${config.noun.toLowerCase()}`}
      description={row ? config.describe(row) : config.newHint}
      dirty={dirty}
      saving={saving}
      submitLabel={row ? 'Save changes' : `Add ${config.noun.toLowerCase()}`}
      onSubmit={save}
    >
      {config.fields.map((f, i) => (
        <Field key={f.key} label={f.label} hint={f.hint} error={missing(f)}>
          {f.type === 'segmented' ? (
            <Segmented value={form[f.key]} onChange={(v) => setForm({ ...form, [f.key]: v })} options={f.options} />
          ) : f.type === 'textarea' || f.type === 'lines' ? (
            <Textarea
              rows={f.rows ?? 4}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
            />
          ) : (
            <Input
              type={f.type === 'url' ? 'url' : 'text'}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              autoFocus={i === 0 && !row}
            />
          )}
        </Field>
      ))}
    </Sheet>
  )
}

export default function CollectionSection({ config, toast, startNew }) {
  const { source } = config
  const crud = useCrud({ list: source.list, remove: source.remove, update: source.update, toast, noun: config.noun })
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  // Arriving from an Overview shortcut opens the editor straight away.
  useEffect(() => { if (startNew) crud.openEditor() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const q = query.trim().toLowerCase()
  const inFilter = (row) => !config.filter || filter === 'all' || row[config.filter.key] === filter
  const shown = crud.items.filter((row) => inFilter(row) && config.searchText(row).toLowerCase().includes(q))

  return (
    <>
      <SectionHeader
        title={config.title}
        description={config.description}
        count={crud.items.length}
        query={query}
        onQuery={setQuery}
        onNew={() => crud.openEditor()}
        newLabel={`New ${config.noun.toLowerCase()}`}
      />

      {config.filter && crud.items.length > 0 && (
        <div className="mb-4">
          <Segmented value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, ...config.filter.options]} />
        </div>
      )}

      {crud.loading ? (
        <ListSkeleton />
      ) : crud.items.length === 0 ? (
        <EmptyState
          icon={config.icon}
          title={config.empty.title}
          body={config.empty.body}
          action={<Button onClick={() => crud.openEditor()} className="rounded-full"><Plus /> New {config.noun.toLowerCase()}</Button>}
        />
      ) : shown.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Nothing matches.</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground">
            {q
              ? 'Clear the search to drag items into a new order.'
              : 'Drag the grip on the left to change the order. The same order is used on your site.'}
          </p>
          <SortableList
            items={shown}
            disabled={Boolean(q)}
            onReorder={(next) => crud.reorder(mergeSubset(crud.items, next, inFilter))}
            renderRow={(row) => ({
              ...config.rowOf(row),
              onEdit: () => crud.openEditor(row),
              onDelete: () => crud.setToDelete(row),
              deleting: crud.deleting && crud.toDelete?.id === row.id,
            })}
          />
        </>
      )}

      {crud.editor.mounted && (
        <Editor
          key={crud.editor.row?.id ?? 'new'}
          config={config}
          open={crud.editor.open}
          row={crud.editor.row}
          count={crud.items.length}
          toast={toast}
          onClose={crud.closeEditor}
          onSaved={() => { crud.closeEditor(); crud.reload() }}
        />
      )}

      <ConfirmDialog
        open={Boolean(crud.toDelete)}
        title={`Delete “${crud.toDelete && config.rowOf(crud.toDelete).label}”?`}
        body="It will disappear from your site. This can't be undone."
        confirmLabel={`Delete ${config.noun.toLowerCase()}`}
        busy={crud.deleting}
        onCancel={() => crud.setToDelete(null)}
        onConfirm={crud.confirmDelete}
      />
    </>
  )
}
