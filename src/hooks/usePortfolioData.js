import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// `null` means "couldn't be loaded" (for example the table doesn't exist yet),
// which is different from an empty list. The pages fall back to the built-in
// content when a list is missing or has nothing in it.
const EMPTY = {
  projects: [], experience: [], education: [], skills: [], blog: [],
  certifications: null, tags: null,
}

const ordered = (table) => supabase.from(table).select('*').order('display_order')

export function usePortfolioData() {
  const [data, setData] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        // Optional tables (blog, certifications, tags) must not take the rest of
        // the site down when they are missing, so they stay out of the error check.
        const [p, exp, edu, sk, b, cert, tag] = await Promise.all([
          ordered('projects'),
          ordered('experience'),
          ordered('education'),
          ordered('skills'),
          supabase
            .from('blog_posts')
            .select('*')
            .eq('is_published', true)
            .order('published_at', { ascending: false })
            .order('display_order'),
          ordered('certifications'),
          ordered('personal_tags'),
        ])

        // Surface the first error if any query failed
        const firstError = [p, exp, edu, sk].find((r) => r.error)?.error
        if (firstError) throw firstError

        if (!cancelled) {
          setData({
            blog: b.error ? [] : b.data,
            certifications: cert.error ? null : cert.data,
            tags: tag.error ? null : tag.data,
            projects: p.data,
            experience: exp.data,
            education: edu.data,
            skills: sk.data,
          })
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { ...data, loading, error }
}

// Thin helpers for the CMS: list, add, edit and remove rows of one table.
const table = (name, listOrder = { column: 'display_order' }) => ({
  list: () => supabase.from(name).select('*').order(listOrder.column, { ascending: listOrder.ascending ?? true }),
  insert: (row) => supabase.from(name).insert(row).select().single(),
  update: (id, row) => supabase.from(name).update(row).eq('id', id).select().single(),
  remove: (id) => supabase.from(name).delete().eq('id', id),
})

export const db = {
  projects: table('projects'),
  experience: table('experience'),
  education: table('education'),
  skills: table('skills'),
  certifications: table('certifications'),
  tags: table('personal_tags'),
  blog: table('blog_posts', { column: 'published_at', ascending: false }),
}
