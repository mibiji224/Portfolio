import { useEffect, useState } from 'react'

// Tracks which of the given `#id` targets is in view. Sections mount lazily
// via Suspense, so keep scanning until every target exists.
export function useScrollSpy(targets, initial = targets[0]) {
  const [active, setActive] = useState(initial)
  const key = targets.join('|')

  useEffect(() => {
    const observed = new Set()
    const list = key.split('|')

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )

    const scan = () => {
      list.forEach((href) => {
        const el = document.querySelector(href)
        if (el && !observed.has(el)) {
          observed.add(el)
          io.observe(el)
        }
      })
      return observed.size === list.length
    }

    if (scan()) return () => io.disconnect()

    const mo = new MutationObserver(() => {
      if (scan()) mo.disconnect()
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      io.disconnect()
    }
  }, [key])

  return [active, setActive]
}
