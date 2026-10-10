import { Coffee, Sparkles } from 'lucide-react'
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

const Personal = () => (
    <PageShell index="05" label="hobbies & personality" title="Hobbies & Personality">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Panel icon={<Coffee className="w-4 h-4" />} title="Hobbies" items={HOBBIES} />
            <Panel icon={<Sparkles className="w-4 h-4" />} title="Personality" items={TRAITS} offset={2} />
        </div>
    </PageShell>
)

export default Personal
