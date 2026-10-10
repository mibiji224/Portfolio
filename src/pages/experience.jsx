import { useOutletContext } from 'react-router-dom'
import PageShell from '@/components/PageShell'
import { FALLBACK_EXPERIENCE } from '@/data/profile'

const Experience = () => {
    const { experience } = useOutletContext()
    const items = experience?.length ? experience : FALLBACK_EXPERIENCE

    return (
        <PageShell
            index="01"
            label="experience"
            title="Experience"
            description="Roles, leadership positions and freelance work, newest first."
        >
            <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-lift">
                <ol className="relative border-l border-border ml-2 sm:ml-3 space-y-8">
                    {items.map((item, index) => (
                        <li key={index} className="relative ml-6 sm:ml-8 group">
                            <span className="absolute -left-[31px] sm:-left-[43px] top-1 flex items-center justify-center w-6 h-6 bg-background rounded-full border border-border group-hover:border-primary group-hover:shadow-accent transition-all duration-300">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full group-hover:bg-primary transition-colors"></div>
                            </span>

                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono font-medium text-primary-strong border border-primary/30 px-1.5 py-0.5 rounded bg-primary/5">
                                    {item.date}
                                </span>
                                {item.type && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${item.type === 'Present' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                                        {item.type}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-base font-bold text-foreground mb-0.5 group-hover:text-primary-strong transition-colors">
                                {item.title}
                            </h2>
                            <h3 className="text-xs font-medium text-muted-foreground mb-2">{item.company}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                                {item.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </PageShell>
    )
}

export default Experience
