import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  AlertCircle, CheckCircle2, Image as ImageIcon, Pencil, Search, Trash2, Upload, X,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ─── Supabase Storage ──────────────────────────────────────────────────────────

export async function uploadImage(file, folder = 'projects') {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('portfolio-assets').upload(path, file, {
    cacheControl: '31536000', // 1 year CDN cache
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(path)
  return data.publicUrl
}

// Object URL for a picked file, released when the file changes or goes away.
export function useObjectUrl(file) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (!file) return setUrl('')
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  return url
}

// ─── Feedback ──────────────────────────────────────────────────────────────────

export const Spinner = ({ className }) => (
  <span
    className={cn('inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent', className)}
    aria-hidden="true"
  />
)

export function Toast({ message, type }) {
  if (!message) return null
  const isError = type === 'error'
  return (
    <div
      role="status"
      className={cn(
        'fixed bottom-6 left-1/2 z-[100] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-full border-2 bg-background px-5 py-3 text-sm font-medium shadow-lift animate-in fade-in slide-in-from-bottom-2 duration-200',
        isError ? 'border-destructive/40 text-destructive' : 'border-matcha text-matcha-strong'
      )}
    >
      {isError ? <AlertCircle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
      <span>{message}</span>
    </div>
  )
}

export const Notice = ({ children }) => (
  <p className="flex items-start gap-3 rounded-xl border border-primary bg-primary-soft px-4 py-3 text-sm text-foreground">
    <AlertCircle size={16} className="mt-0.5 shrink-0 text-primary-strong" />
    <span>{children}</span>
  </p>
)

export const EmptyState = ({ icon: Icon = ImageIcon, title, body, action }) => (
  <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-border px-6 py-14 text-center">
    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary-strong">
      <Icon size={22} />
    </span>
    <p className="font-semibold text-foreground">{title}</p>
    {body && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)

export const Chip = ({ tone = 'neutral', children }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      tone === 'live' && 'bg-matcha-soft text-matcha-strong',
      tone === 'draft' && 'bg-secondary text-primary-strong',
      tone === 'neutral' && 'bg-secondary text-muted-foreground'
    )}
  >
    {children}
  </span>
)

// ─── Form pieces ───────────────────────────────────────────────────────────────

export const Field = ({ label, hint, error, children, className }) => (
  <div className={className}>
    <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
    {children}
    {error ? (
      <p className="mt-1.5 text-xs text-destructive">{error}</p>
    ) : (
      hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
    )}
  </div>
)

export const Switch = ({ checked, onChange, label, hint }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="flex w-full items-center justify-between gap-4 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <span>
      <span className="block text-sm font-medium text-foreground">{label}</span>
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </span>
    <span
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-primary-strong' : 'bg-border'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-all duration-200',
          checked ? 'left-[22px]' : 'left-0.5'
        )}
      />
    </span>
  </button>
)

// Pick one option from a few, shown as pills (replaces a <select> for short lists).
export const Segmented = ({ value, onChange, options }) => (
  <div role="radiogroup" className="flex flex-wrap gap-2">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        role="radio"
        aria-checked={value === o.value}
        onClick={() => onChange(o.value)}
        className={cn(
          'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          value === o.value
            ? 'border-primary-strong bg-primary-soft text-primary-strong'
            : 'border-border text-muted-foreground hover:bg-secondary/60'
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
)

// Clickable drop zone that hands back picked files.
export const DropZone = ({ onFiles, multiple, title, hint }) => {
  const [over, setOver] = useState(false)
  const pick = (list) => {
    const files = Array.from(list || []).filter((f) => f.type.startsWith('image/'))
    if (files.length) onFiles(multiple ? files : files.slice(0, 1))
  }
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files) }}
      className={cn(
        'group flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-ring',
        over ? 'border-primary-strong bg-primary-soft' : 'border-border hover:border-primary hover:bg-secondary/40'
      )}
    >
      <Upload size={20} className="mb-2 text-primary-strong" />
      <span className="text-sm font-medium text-foreground">{title}</span>
      <span className="mt-0.5 text-xs text-muted-foreground">{hint}</span>
      <Input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        onChange={(e) => { pick(e.target.files); e.target.value = '' }}
      />
    </label>
  )
}

// ─── Lists ─────────────────────────────────────────────────────────────────────

export const SectionHeader = ({ title, description, count, query, onQuery, onNew, newLabel }) => (
  <header className="mb-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <Button onClick={onNew} className="rounded-full px-5">
        <PlusIcon /> {newLabel}
      </Button>
    </div>
    {onQuery && count > 0 && (
      <div className="relative mt-5 max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={`Search ${count} ${count === 1 ? 'item' : 'items'}`}
          className="rounded-full pl-10"
          aria-label="Search"
        />
      </div>
    )}
  </header>
)

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M8 3v10M3 8h10" />
  </svg>
)

export const Row = ({ thumb, title, meta, chip, onEdit, onDelete, deleting, handle, liRef, liStyle, dragging }) => (
  <li
    ref={liRef}
    style={liStyle}
    className={cn(
      'group relative flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 pr-3 transition-colors hover:border-primary hover:bg-secondary/30 sm:gap-4',
      handle && 'pl-1',
      dragging && 'z-10 border-primary-strong bg-background shadow-accent-lg'
    )}
  >
    {handle}
    <button
      type="button"
      onClick={onEdit}
      className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-4"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary text-primary-strong">
        {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <ImageIcon size={20} />}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground sm:text-base">{title}</span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground sm:text-sm">{meta}</span>
      </span>
    </button>
    {chip}
    <div className="flex shrink-0 items-center gap-1">
      <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label={`Edit ${title}`}>
        <Pencil />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onDelete} disabled={deleting} aria-label={`Delete ${title}`} className="hover:text-destructive">
        {deleting ? <Spinner /> : <Trash2 />}
      </Button>
    </div>
  </li>
)

export const ListSkeleton = () => (
  <ul className="space-y-2" aria-busy="true">
    {[0, 1, 2].map((i) => (
      <li key={i} className="h-[74px] animate-pulse rounded-2xl bg-secondary/60" />
    ))}
  </ul>
)

// ─── Dialogs ───────────────────────────────────────────────────────────────────

export const ConfirmDialog = ({ open, title, body, confirmLabel, busy, onConfirm, onCancel }) => (
  <Dialog open={open} onOpenChange={(next) => !next && !busy && onCancel()}>
    <DialogContent showCloseButton={false} className="max-w-sm p-6">
      <DialogTitle className="text-lg font-semibold text-foreground">{title}</DialogTitle>
      <DialogDescription className="mt-2 text-sm text-muted-foreground">{body}</DialogDescription>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={busy} className="rounded-full">Keep it</Button>
        <Button variant="destructive" onClick={onConfirm} disabled={busy} className="rounded-full">
          {busy && <Spinner />} {confirmLabel}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)

// The editor: a panel that slides in from the right so the list stays in view.
// Closing with unsaved edits asks first. The form lives inside, so Enter and
// the footer button both save.
export function Sheet({ open, onClose, title, description, dirty, saving, submitLabel, onSubmit, children }) {
  const [asking, setAsking] = useState(false)

  const requestClose = () => {
    if (saving) return
    if (dirty) setAsking(true)
    else onClose()
  }

  return (
    <>
      <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && requestClose()}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l-2 border-border bg-background shadow-lift focus:outline-none sm:rounded-l-[2rem] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:duration-300 data-[state=closed]:duration-200"
          >
            <form
              onSubmit={(e) => { e.preventDefault(); onSubmit() }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
                <div>
                  <DialogPrimitive.Title className="text-xl font-semibold tracking-tight text-foreground">{title}</DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-0.5 text-sm text-muted-foreground">
                    {description}
                  </DialogPrimitive.Description>
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={requestClose} aria-label="Close">
                  <X />
                </Button>
              </div>

              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">{children}</div>

              <div className="flex items-center justify-between gap-3 border-t border-border bg-background px-6 py-4 sm:px-8 sm:rounded-bl-[2rem]">
                <p className="text-xs text-muted-foreground">{dirty ? 'You have unsaved changes.' : 'No changes yet.'}</p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={requestClose} className="rounded-full">Cancel</Button>
                  <Button type="submit" disabled={saving || !dirty} className="rounded-full px-6">
                    {saving && <Spinner />} {saving ? 'Saving' : submitLabel}
                  </Button>
                </div>
              </div>
            </form>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <ConfirmDialog
        open={asking}
        title="Discard your changes?"
        body="What you've typed here hasn't been saved and will be lost."
        confirmLabel="Discard changes"
        onCancel={() => setAsking(false)}
        onConfirm={() => { setAsking(false); onClose() }}
      />
    </>
  )
}
