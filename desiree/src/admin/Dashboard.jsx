import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, Image as ImageIcon, LogOut, Plus,
  Trash2, Upload, X, AlertCircle, CheckCircle2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { db } from '../hooks/usePortfolioData'

// ─── tiny helpers ──────────────────────────────────────────────────────────────

function Toast({ message, type }) {
  if (!message) return null
  const isError = type === 'error'
  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm shadow-2xl
      ${isError
        ? 'bg-[#1a0a0a] border-[#db0a0a]/30 text-red-400'
        : 'bg-[#0a1a0a] border-green-500/30 text-green-400'
      }`}
    >
      {isError ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
      {message}
    </div>
  )
}

function Spinner() {
  return <div className="w-5 h-5 border-2 border-[#db0a0a] border-t-transparent rounded-full animate-spin" />
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
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <Plus size={16} className="text-[#db0a0a]" /> Add Project
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title *" required>
            <input
              type="text" required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="BiteTrack"
              className={inputCls}
            />
          </Field>

          <Field label="Subtitle">
            <input
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
            <input
              type="number" min="0"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: +e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="Tech Stack (comma-separated)" className="md:col-span-2">
            <input
              type="text"
              value={form.tech_stack}
              onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
              placeholder="React, Tailwind CSS, Supabase"
              className={inputCls}
            />
          </Field>

          <Field label="Description" className="md:col-span-2">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short project description..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Demo URL">
            <input
              type="url"
              value={form.demo_url}
              onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>

          <Field label="GitHub URL">
            <input
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
              className="border-2 border-dashed border-white/10 hover:border-[#db0a0a]/40 rounded-xl p-6 text-center cursor-pointer transition-colors group"
            >
              <Upload size={20} className="mx-auto mb-2 text-gray-600 group-hover:text-[#db0a0a] transition-colors" />
              <p className="text-gray-500 text-sm">Click to upload images (JPG, PNG, WebP)</p>
              <p className="text-gray-700 text-xs mt-1">Files are uploaded to Supabase Storage CDN</p>
              <input
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
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePreview(i)}
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-white hover:text-[#db0a0a]"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <div className="md:col-span-2 flex items-center gap-3">
            <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_coming_soon}
                onChange={(e) => setForm({ ...form, is_coming_soon: e.target.checked })}
                className="accent-[#db0a0a]"
              />
              Mark as "Coming Soon"
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-[#db0a0a] hover:bg-[#b50808] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              {submitting ? <><Spinner /> Uploading & Saving...</> : <><Plus size={15} /> Add Project</>}
            </button>
          </div>
        </form>
      </section>

      {/* ── Project List ── */}
      <section>
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <ImageIcon size={16} className="text-[#db0a0a]" />
          Existing Projects
          <span className="text-gray-600 font-normal text-sm">({projects.length})</span>
        </h2>

        {loadingList ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : projects.length === 0 ? (
          <p className="text-gray-600 text-sm py-6 text-center border border-white/5 rounded-xl">
            No projects yet. Add one above.
          </p>
        ) : (
          <div className="space-y-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 bg-[#111] border border-white/5 rounded-xl px-4 py-3 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {p.images?.[0]?.src && (
                    <img
                      src={p.images[0].src}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-white/10"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.title}</p>
                    <p className="text-gray-600 text-xs mt-0.5">
                      {p.category} · order {p.display_order}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="text-gray-600 hover:text-[#db0a0a] disabled:opacity-40 transition-colors flex-shrink-0"
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
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <Plus size={16} className="text-[#db0a0a]" /> Add Experience
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Role *"><input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Front End Developer" className={inputCls} /></Field>
          <Field label="Company *"><input required type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Inventiv Softwares" className={inputCls} /></Field>
          <Field label="Date / Period *"><input required type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="January 2025" className={inputCls} /></Field>
          <Field label="Type"><input type="text" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Present · Part Time · Contract" className={inputCls} /></Field>
          <Field label="Description" className="md:col-span-2"><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} /></Field>
          <div className="md:col-span-2">
            <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-[#db0a0a] hover:bg-[#b50808] disabled:opacity-40 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
              {submitting ? <><Spinner /> Saving...</> : <><Plus size={15} /> Add</>}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Briefcase size={16} className="text-[#db0a0a]" /> Existing ({list.length})
        </h2>
        <div className="space-y-2">
          {list.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 bg-[#111] border border-white/5 rounded-xl px-4 py-3">
              <div>
                <p className="text-white text-sm">{item.title} <span className="text-gray-500">@ {item.company}</span></p>
                <p className="text-gray-600 text-xs mt-0.5">{item.date} {item.type && `· ${item.type}`}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="text-gray-600 hover:text-[#db0a0a] disabled:opacity-40 transition-colors">
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

const inputCls = 'w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-[#db0a0a]/50 transition-colors'

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-gray-400 text-xs font-medium uppercase tracking-wide mb-1.5">
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
    <div className="min-h-screen bg-[#080707] text-white">
      <Toast message={toast.message} type={toast.type} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080707]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-0.5">CMS</p>
            <h1 className="text-white font-semibold tracking-tight">Portfolio Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-xs hidden sm:block">{session?.user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-gray-500 hover:text-[#db0a0a] transition-colors text-sm"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#0f0f0f] rounded-xl p-1 w-fit border border-white/5">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${tab === id
                  ? 'bg-[#db0a0a] text-white'
                  : 'text-gray-500 hover:text-white'
                }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {tab === 'projects' && <ProjectsTab toast={showToast} />}
        {tab === 'experience' && <ExperienceTab toast={showToast} />}
      </main>
    </div>
  )
}
