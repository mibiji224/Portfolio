import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, Image as ImageIcon, LogOut, Plus,
  Trash2, Upload, X, AlertCircle, CheckCircle2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { db } from '../hooks/usePortfolioData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// ─── tiny helpers ──────────────────────────────────────────────────────────────

function Toast({ message, type }) {
  if (!message) return null
  const isError = type === 'error'
  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm shadow-2xl
      ${isError
        ? 'bg-[#1a0a0a] border-primary/30 text-primary'
        : 'bg-[#0a1a0a] border-green-500/30 text-green-400'
      }`}
    >
      {isError ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
      {message}
    </div>
  )
}

function Spinner() {
  return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
}

// ─── image upload to Supabase Storage ─────────────────────────────────────────

async function uploadImage(file) {
  const ext = file.name.split('.').pop()
  const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('portfolio-assets').upload(path, file, {
    cacheControl: '31536000',  // 1 year CDN cache
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(path)
  return data.publicUrl
}

// ─── Projects tab ──────────────────────────────────────────────────────────────

const BLANK_PROJECT = {
  title: '',
  subtitle: '',
  description: '',
  category: 'development',
  tech_stack: '',
  demo_url: '',
  github_url: '',
  is_coming_soon: false,
  display_order: 0,
}

function ProjectsTab({ toast }) {
  const [projects, setProjects] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [form, setForm] = useState(BLANK_PROJECT)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const fileRef = useRef()

  const reload = async () => {
    setLoadingList(true)
    const { data, error } = await db.projects.list()
    if (!error) setProjects(data)
    setLoadingList(false)
  }

  useEffect(() => { reload() }, [])

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)
    setImagePreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const removePreview = (i) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i))
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[i])
      return prev.filter((_, idx) => idx !== i)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Upload each image to Storage, collect CDN URLs
      const uploadedUrls = await Promise.all(imageFiles.map(uploadImage))
      const images = uploadedUrls.map((src) => ({ src, caption: form.title }))

      const row = {
        ...form,
        // Store tech_stack as an array regardless of input format
        tech_stack: form.tech_stack
          ? form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        images,
      }

      const { error } = await db.projects.insert(row)
      if (error) throw error

      toast('Project added!', 'success')
      setForm(BLANK_PROJECT)
      setImageFiles([])
      setImagePreviews([])
      if (fileRef.current) fileRef.current.value = ''
      await reload()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    setDeletingId(id)
    const { error } = await db.projects.remove(id)
    if (error) toast(error.message, 'error')
    else { toast('Deleted.', 'success'); await reload() }
    setDeletingId(null)
  }

  return (
    <div className="space-y-10">
      {/* ── Add Project Form ── */}
      <section>
        <h2 className="text-foreground font-semibold mb-5 flex items-center gap-2">
          <Plus size={16} className="text-primary" /> Add Project
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title *" required>
            <Input
              type="text" required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="BiteTrack"
              className={inputCls}
            />
          </Field>

          <Field label="Subtitle">
            <Input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Nutrition tracker app"
              className={inputCls}
            />
          </Field>

          <Field label="Category *" required className="md:col-span-1">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputCls}
            >
              <option value="development">Development</option>
              <option value="art">Art</option>
              <option value="graphics">Graphics</option>
            </select>
          </Field>

          <Field label="Display Order">
            <Input
              type="number" min="0"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: +e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="Tech Stack (comma-separated)" className="md:col-span-2">
            <Input
              type="text"
              value={form.tech_stack}
              onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
              placeholder="React, Tailwind CSS, Supabase"
              className={inputCls}
            />
          </Field>

          <Field label="Description" className="md:col-span-2">
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short project description..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Demo URL">
            <Input
              type="url"
              value={form.demo_url}
              onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>

          <Field label="GitHub URL">
            <Input
              type="url"
              value={form.github_url}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              placeholder="https://github.com/..."
              className={inputCls}
            />
          </Field>

          {/* ── Image upload ── */}
          <Field label="Project Images" className="md:col-span-2">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-6 text-center cursor-pointer transition-colors group"
            >
              <Upload size={20} className="mx-auto mb-2 text-muted-foreground/70 group-hover:text-primary transition-colors" />
              <p className="text-muted-foreground/80 text-sm">Click to upload images (JPG, PNG, WebP)</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Files are uploaded to Supabase Storage CDN</p>
              <Input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePreview(i)}
                      className="absolute top-1 right-1 bg-neutral-900/70 rounded-full p-0.5 text-white hover:text-primary"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-muted-foreground text-sm cursor-pointer select-none">
              <Input
                type="checkbox"
                checked={form.is_coming_soon}
                onChange={(e) => setForm({ ...form, is_coming_soon: e.target.checked })}
                className="accent-primary"
              />
              Mark as "Coming Soon"
            </label>
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting} className="rounded-lg px-6">
              {submitting ? <><Spinner /> Uploading & Saving...</> : <><Plus size={15} /> Add Project</>}
            </Button>
          </div>
        </form>
      </section>

      {/* ── Project List ── */}
      <section>
        <h2 className="text-foreground font-semibold mb-5 flex items-center gap-2">
          <ImageIcon size={16} className="text-primary" />
          Existing Projects
          <span className="text-muted-foreground/70 font-normal text-sm">({projects.length})</span>
        </h2>

        {loadingList ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground/70 text-sm py-6 text-center border border-border rounded-xl">
            No projects yet. Add one above.
          </p>
        ) : (
          <div className="space-y-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 bg-popover border border-border rounded-xl px-3 sm:px-4 py-3 hover:border-border transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {p.images?.[0]?.src && (
                    <img
                      src={p.images[0].src}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-border"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">{p.title}</p>
                    <p className="text-muted-foreground/70 text-xs mt-0.5">
                      {p.category} · order {p.display_order}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="text-muted-foreground/70 hover:text-primary disabled:opacity-40 transition-colors flex-shrink-0"
                >
                  {deletingId === p.id ? <Spinner /> : <Trash2 size={15} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// ─── Experience tab (same CRUD pattern) ────────────────────────────────────────

const BLANK_EXP = { title: '', company: '', date: '', type: '', description: '', is_current: false, display_order: 0 }

function ExperienceTab({ toast }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState(BLANK_EXP)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const reload = async () => {
    const { data } = await db.experience.list()
    if (data) setList(data)
  }
  useEffect(() => { reload() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await db.experience.insert(form)
    if (error) toast(error.message, 'error')
    else { toast('Experience added!', 'success'); setForm(BLANK_EXP); await reload() }
    setSubmitting(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return
    setDeletingId(id)
    const { error } = await db.experience.remove(id)
    if (error) toast(error.message, 'error')
    else { toast('Deleted.', 'success'); await reload() }
    setDeletingId(null)
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-foreground font-semibold mb-5 flex items-center gap-2">
          <Plus size={16} className="text-primary" /> Add Experience
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Role *"><Input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Front End Developer" className={inputCls} /></Field>
          <Field label="Company *"><Input required type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Inventiv Softwares" className={inputCls} /></Field>
          <Field label="Date / Period *"><Input required type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="January 2025" className={inputCls} /></Field>
          <Field label="Type"><Input type="text" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Present · Part Time · Contract" className={inputCls} /></Field>
          <Field label="Description" className="md:col-span-2"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} /></Field>
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting} className="rounded-lg px-6">
              {submitting ? <><Spinner /> Saving...</> : <><Plus size={15} /> Add</>}
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-foreground font-semibold mb-4 flex items-center gap-2">
          <Briefcase size={16} className="text-primary" /> Existing ({list.length})
        </h2>
        <div className="space-y-2">
          {list.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 bg-popover border border-border rounded-xl px-3 sm:px-4 py-3">
              <div>
                <p className="text-foreground text-sm">{item.title} <span className="text-muted-foreground/80">@ {item.company}</span></p>
                <p className="text-muted-foreground/70 text-xs mt-0.5">{item.date} {item.type && `· ${item.type}`}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="text-muted-foreground/70 hover:text-primary disabled:opacity-40 transition-colors">
                {deletingId === item.id ? <Spinner /> : <Trash2 size={15} />}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ─── Shared field wrapper ───────────────────────────────────────────────────────

const inputCls = 'h-10 rounded-lg bg-secondary'

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

// ─── Dashboard shell ────────────────────────────────────────────────────────────

const TABS = [
  { id: 'projects', label: 'Projects', Icon: ImageIcon },
  { id: 'experience', label: 'Experience', Icon: Briefcase },
]

export default function Dashboard() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('projects')
  const [toast, setToast] = useState({ message: '', type: '' })

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: '' }), 3000)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toast message={toast.message} type={toast.type} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground/70 uppercase tracking-widest mb-0.5">CMS</p>
            <h1 className="text-foreground font-semibold tracking-tight">Portfolio Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground/70 text-xs hidden sm:block">{session?.user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-muted-foreground/80 hover:text-primary transition-colors text-sm"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-card rounded-xl p-1 w-full sm:w-fit overflow-x-auto border border-border">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${tab === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground/80 hover:text-foreground'
                }`}
            >
              <Icon size={14} className="shrink-0" /> {label}
            </button>
          ))}
        </div>

        {tab === 'projects' && <ProjectsTab toast={showToast} />}
        {tab === 'experience' && <ExperienceTab toast={showToast} />}
      </main>
    </div>
  )
}
