import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const EMPTY = { projects: [], experience: [], education: [], skills: [] }

export function usePortfolioData() {
  const [data, setData] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        const [p, exp, edu, sk] = await Promise.all([
          supabase.from('projects').select('*').order('display_order'),
          supabase.from('experience').select('*').order('display_order'),
          supabase.from('education').select('*').order('display_order'),
          supabase.from('skills').select('*').order('display_order'),
        ])

        // Surface the first error if any query failed
        const firstError = [p, exp, edu, sk].find((r) => r.error)?.error
        if (firstError) throw firstError

        if (!cancelled) {
          setData({
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

// Thin helpers for per-table fetches used by the CMS
export const db = {
  projects: {
    list: () => supabase.from('projects').select('*').order('display_order'),
    insert: (row) => supabase.from('projects').insert(row).select().single(),
    update: (id, row) => supabase.from('projects').update(row).eq('id', id).select().single(),
    remove: (id) => supabase.from('projects').delete().eq('id', id),
  },
  experience: {
    list: () => supabase.from('experience').select('*').order('display_order'),
    insert: (row) => supabase.from('experience').insert(row).select().single(),
    update: (id, row) => supabase.from('experience').update(row).eq('id', id).select().single(),
    remove: (id) => supabase.from('experience').delete().eq('id', id),
  },
}
