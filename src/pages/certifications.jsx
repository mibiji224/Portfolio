import { CheckCircle2, ExternalLink } from 'lucide-react'
import PageShell from '@/components/PageShell'
import { CERTIFICATIONS } from '@/data/profile'

const Certifications = () => (
    <PageShell
        index="03"
        label="certifications"
        title="Certifications & Awards"
        description="Courses, credentials and recognition, newest first."
    >
        <ul className="space-y-3">
            {CERTIFICATIONS.map((cert) => (
                <li
                    key={cert.title}
                    className="group flex items-start gap-3 p-4 bg-card rounded-xl shadow-lift transition-transform hover:-translate-y-0.5 duration-300"
                >
                    <CheckCircle2 className="w-4 h-4 text-primary-strong mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <h2 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary-strong transition-colors">
                            {cert.title}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {cert.issuer} <span className="text-muted-foreground/70">• {cert.date}</span>
                        </p>
                        {cert.credentialId && (
                            <p className="mt-1 font-mono text-[10px] text-muted-foreground/70 break-all">
                                ID {cert.credentialId}
                            </p>
                        )}
                    </div>
                    {cert.url && (
                        <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary-strong hover:text-foreground transition-colors"
                        >
                            Show credential <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </li>
            ))}
        </ul>
    </PageShell>
)

export default Certifications
