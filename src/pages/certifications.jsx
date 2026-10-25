import { Award, ExternalLink } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import PageShell from '@/components/PageShell'
import Rail from '@/components/Rail'
import { CERTIFICATIONS } from '@/data/profile'

const Certifications = () => {
    const { certifications } = useOutletContext()
    const items = certifications?.length
        ? certifications.map((c) => ({ ...c, credentialId: c.credential_id }))
        : CERTIFICATIONS

    return (
    <PageShell
        index="03"
        label="certifications"
        title="Certifications & Awards"
        description="Courses, credentials and recognition, newest first."
    >
        <Rail>
            {items.map((cert) => (
                <article
                    key={cert.id ?? cert.title}
                    className="group w-[80%] sm:w-80 shrink-0 snap-start self-stretch flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                    <div className="h-40 p-3 flex items-center justify-center bg-secondary">
                        {cert.image_url ? (
                            <img src={cert.image_url} alt={cert.title} className="h-full w-full object-contain rounded-md" />
                        ) : (
                            <Award className="w-12 h-12 text-primary-strong" />
                        )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                        <h2 className="text-base font-bold text-foreground leading-snug group-hover:text-primary-strong transition-colors">
                            {cert.title}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {cert.issuer} <span className="text-muted-foreground/70">• {cert.date}</span>
                        </p>
                        {cert.credentialId && (
                            <p className="mt-2 font-mono text-[10px] text-muted-foreground/70 break-all">
                                ID {cert.credentialId}
                            </p>
                        )}
                        {cert.url && (
                            <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto pt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-strong hover:text-foreground transition-colors"
                            >
                                Show credential <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </article>
            ))}
        </Rail>
    </PageShell>
    )
}

export default Certifications
