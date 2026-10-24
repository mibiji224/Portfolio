import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCrud } from './crud'
import { ListSkeleton, Spinner } from './ui'

// Short labels grouped under headings (skills, hobbies...). Add one in the box,
// remove one with its x. Each label is one row: `nameKey` holds the text and
// `groupKey` the group it sits in.

function Group({ group, rows, nameKey, groupKey, source, nextOrder, toast, reload, remove }) {
  const [text, setText] = useState('')
  const [adding, setAdding] = useState(false)

  const add = async (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    if (rows.some((r) => r[nameKey].toLowerCase() === value.toLowerCase())) {
      return toast(`“${value}” is already in this list`, 'error')
    }
    setAdding(true)
    const { error } = await source.insert({ [nameKey]: value, [groupKey]: group.key, display_order: nextOrder })
    setAdding(false)
    if (error) return toast(error.message, 'error')
    setText('')
    reload()
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold text-foreground">{group.label}</h2>
        <span className="text-xs text-muted-foreground">{rows.length}</span>
      </div>
      {group.hint && <p className="mt-0.5 text-sm text-muted-foreground">{group.hint}</p>}

      {rows.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-1 rounded-full bg-secondary py-1 pl-3.5 pr-1.5 text-sm text-foreground">
              {r[nameKey]}
              <button
                type="button"
                onClick={() => remove(r)}
                aria-label={`Remove ${r[nameKey]}`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Nothing here yet.</p>
      )}

      <form onSubmit={add} className="mt-4 flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={group.placeholder ?? 'Add one'}
          aria-label={`Add to ${group.label}`}
          className="h-10 rounded-full"
        />
        <Button type="submit" disabled={adding || !text.trim()} className="h-10 shrink-0 rounded-full px-5">
          {adding ? <Spinner /> : <Plus />} Add
        </Button>
      </form>
    </section>
  )
}

export default function TagsSection({ config, toast }) {
  const { source, nameKey, groupKey } = config
  const crud = useCrud({ list: source.list, remove: source.remove, toast, noun: config.noun })

  // A removal updates the list first and tells the database after.
  const remove = async (row) => {
    crud.setItems(crud.items.filter((r) => r.id !== row.id))
    const { error } = await source.remove(row.id)
    if (error) {
      toast(error.message, 'error')
      crud.reload()
    }
  }

  const nextOrder = crud.items.reduce((max, r) => Math.max(max, r.display_order ?? 0), -1) + 1

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{config.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
      </header>

      {crud.loading ? (
        <ListSkeleton />
      ) : (
        <div className="space-y-4">
          {config.groups.map((group) => (
            <Group
              key={group.key}
              group={group}
              rows={crud.items.filter((r) => r[groupKey] === group.key)}
              nameKey={nameKey}
              groupKey={groupKey}
              source={source}
              nextOrder={nextOrder}
              toast={toast}
              reload={crud.reload}
              remove={remove}
            />
          ))}
        </div>
      )}
    </>
  )
}
