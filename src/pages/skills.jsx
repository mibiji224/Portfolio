import PageShell from '@/components/PageShell'
import { CORE_SKILLS, TECHNICAL_SKILLS } from '@/data/profile'
import { pinkPill, plainPill } from '@/lib/pillTints'
import { TOOL_LOGOS } from '@/lib/toolLogos'
import { Webhook } from 'lucide-react'

const Skills = () => (
    <PageShell
        index="02"
        label="skills"
        title="Skills"
        description="What I do day to day, and the tools I do it with."
    >
        <div className="space-y-10">
            <div>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <span className="h-4 w-1 rounded-full bg-primary-strong" aria-hidden="true"></span>
                    Core Competencies
                </h2>
                {/* Pink here, plain white below: the logos carry the colour there. */}
                <div className="flex flex-wrap gap-2">
                    {CORE_SKILLS.map((skill) => (
                        <span key={skill} className={pinkPill()}>{skill}</span>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <span className="h-4 w-1 rounded-full bg-matcha-strong" aria-hidden="true"></span>
                    Technical Proficiency
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TECHNICAL_SKILLS.map((group) => (
                        <div
                            key={group.category}
                            className="bg-card p-4 rounded-xl shadow-lift transition-transform hover:-translate-y-0.5 group"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-primary-strong opacity-80 group-hover:opacity-100 transition-opacity">
                                    {group.icon}
                                </span>
                                <h3 className="text-foreground text-[11px] font-bold uppercase tracking-wider">
                                    {group.category}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {group.items.map((skill) => (
                                    <span key={skill} className={`${plainPill()} inline-flex items-center gap-1.5`}>
                                        {TOOL_LOGOS[skill] ? (
                                            <img src={TOOL_LOGOS[skill]} alt="" aria-hidden="true" loading="lazy" className="h-3.5 w-3.5 shrink-0 object-contain" />
                                        ) : skill === 'REST API' ? (
                                            <Webhook className="h-3.5 w-3.5 shrink-0 text-sky-600" aria-hidden="true" />
                                        ) : null}
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </PageShell>
)

export default Skills
