import { useEffect } from 'react'

// Injects JSON-LD schema markup into <head> for Google, ChatGPT, Gemini, Perplexity.
// Runs once per data change; cleans up on unmount.
export default function SchemaMarkup({ projects = [], experience = [] }) {
  useEffect(() => {
    const devProjects = projects.filter((p) => p.category === 'development' && !p.is_coming_soon)
    const currentRoles = experience.filter((e) => e.is_current || e.type === 'Present')

    const schemas = [
      // ── Person ──────────────────────────────────────────────────────────────
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Desiree R. Soronio',
        url: 'https://desireesoronio.vercel.app',
        email: 'desireesoronio@gmail.com',
        jobTitle: 'Front End Developer & UI/UX Designer',
        description:
          'Front End Developer and UI/UX Designer based in the Philippines, specializing in React, Tailwind CSS, and modern web applications.',
        knowsAbout: [
          'React', 'Tailwind CSS', 'UI/UX Design', 'Web Development',
          'Next.js', 'Supabase', 'PostgreSQL', 'Figma',
        ],
        sameAs: [
          'https://github.com/mibiji224',
          'https://www.linkedin.com/in/desireesoronio',
        ],
        hasOccupation: currentRoles.map((r) => ({
          '@type': 'Role',
          roleName: r.title,
          worksFor: { '@type': 'Organization', name: r.company },
        })),
      },

      // ── Portfolio page ───────────────────────────────────────────────────────
      {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: 'Desiree Soronio — Portfolio',
        url: 'https://desireesoronio.vercel.app',
        mainEntity: { '@type': 'Person', name: 'Desiree R. Soronio' },
        description:
          'Portfolio of Desiree R. Soronio — Front End Developer and Creative UI/UX Designer.',
      },

      // ── CreativeWork for each dev project ───────────────────────────────────
      ...devProjects.map((p) => ({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: p.title,
        description: p.description,
        url: p.demo_url || undefined,
        codeRepository: p.github_url || undefined,
        creator: { '@type': 'Person', name: 'Desiree R. Soronio' },
        keywords: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : '',
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web',
        image: p.images?.[0]?.src || undefined,
      })),
    ]

    // Remove any previously injected schemas
    document.querySelectorAll('script[data-schema="drs-portfolio"]').forEach((el) => el.remove())

    // Inject fresh schemas
    schemas.forEach((schema) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.schema = 'drs-portfolio'
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    })

    return () => {
      document.querySelectorAll('script[data-schema="drs-portfolio"]').forEach((el) => el.remove())
    }
  }, [projects, experience])

  return null
}
