import { Coffee, Sparkles } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import PageShell from '@/components/PageShell'
import { HOBBIES, TRAITS } from '@/data/profile'
import { matchaPill } from '@/lib/pillTints'
import { cn } from '@/lib/utils'

const Panel = ({ icon, title, items, offset = 0 }) => (
    <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-lift">
        <h2 className="flex items-center gap-3 text-primary-strong font-bold text-sm tracking-wider uppercase mb-4">
            {icon} {title}
        </h2>
        <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
                <span key={item} className={cn(matchaPill(i + offset), 'px-3 py-1.5 rounded-full text-xs')}>
                    {item}
                </span>
            ))}
        </div>
    </div>
)

const labels = (tags, kind, fallback) => {
    const found = (tags ?? []).filter((t) => t.kind === kind).map((t) => t.label)
    return found.length ? found : fallback
}

const Personal = () => {
    const { tags } = useOutletContext()
    const hobbies = labels(tags, 'hobby', HOBBIES)
    const traits = labels(tags, 'trait', TRAITS)

    return (
    <PageShell index="05" label="more about me" title="More About Me">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Panel icon={<Coffee className="w-4 h-4" />} title="Hobbies" items={hobbies} />
            <Panel icon={<Sparkles className="w-4 h-4" />} title="Personality" items={traits} offset={2} />
        </div>
    </PageShell>
    )
}

export default Personal
