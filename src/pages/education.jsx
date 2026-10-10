import { Award } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import PageShell from '@/components/PageShell'
import { FALLBACK_EDUCATION } from '@/data/profile'

const Education = () => {
    const { education } = useOutletContext()
    const items = education?.length ? education : FALLBACK_EDUCATION

    return (
        <PageShell index="04" label="education" title="Education">
            <ul className="space-y-3">
                {items.map((edu, index) => (
                    <li
                        key={index}
                        className="group bg-card p-4 sm:p-5 rounded-xl shadow-lift transition-transform hover:-translate-y-0.5 duration-300"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <h2 className="text-base font-bold text-foreground group-hover:text-primary-strong transition-colors">
                                {edu.school}
                            </h2>
                            <span className="text-[10px] font-mono text-primary-strong bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 whitespace-nowrap">
                                {edu.year}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm text-muted-foreground">{edu.degree}</p>
                            <div className="flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-primary-strong" />
                                <span className="text-xs text-muted-foreground font-medium">{edu.status}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </PageShell>
    )
}

export default Education
