import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'theme'

/** The theme that should be on <html> right now. Dark is the default, so the
 *  portfolio opens the way it always has unless someone has chosen otherwise. */
export function resolveTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // private mode, blocked site data: fall through to the default
  }
  return 'dark'
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(resolveTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Not being able to remember the choice shouldn't break the page.
    }
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`text-muted-foreground hover:text-primary-strong ${className}`}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
