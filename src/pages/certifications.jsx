import { Award, ExternalLink } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import SectionLabel from '@/components/SectionLabel'
import TiltCard from '@/components/TiltCard'
import ScrollRail from '@/components/ScrollRail'
import { CERTIFICATIONS } from '@/data/profile'

const Certifications = () => {
    const { certifications } = useOutletContext()
    const items = certifications?.length
        ? certifications.map((c) => ({ ...c, credentialId: c.credential_id }))
        : CERTIFICATIONS

    return (
    <section className="px-4 sm:px-6 lg:px-10 py-10 lg:py-14 font-sans">
    <div className="mx-auto w-full max-w-5xl">
    <ScrollRail
        count={items.length}
        heading={
            <div className="mb-6">
                <SectionLabel index="03" className="mb-6">certifications</SectionLabel>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Certifications &amp; Awards</h1>
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">Courses, credentials and recognition, newest first. Scroll to move across them.</p>
            </div>
        }
    >
            {items.map((cert) => (
                <TiltCard
                    as="article"
                    key={cert.id ?? cert.title}
                    className="group w-72 sm:w-80 shrink-0 self-stretch flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50"
                >
                    {cert.image_url ? (
                        <img
                            src={cert.image_url}
                            alt={cert.title}
                            loading="lazy"
                            className="w-full h-auto bg-secondary"
                        />
                    ) : (
                        <div className="h-40 flex items-center justify-center bg-secondary">
                            <Award className="w-12 h-12 text-primary-strong" />
                        </div>
                    )}

                    <div className="flex flex-1 flex-col p-5">
                        <h2 className="text-base font-bold text-foreground leading-snug group-hover:text-primary-strong transition-colors">
                            {cert.title}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {cert.issuer} <span className="text-muted-foreground/70">• {cert.date}</span>
                        </p>
                        {cert.credentialId && (
                            <p className="mt-1.5 font-mono text-[10px] text-muted-foreground/70 break-all">
                                ID {cert.credentialId}
                            </p>
                        )}
                        {cert.url && (
                            <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto pt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary-strong hover:text-foreground transition-colors"
                            >
                                Show credential <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </TiltCard>
            ))}
    </ScrollRail>
    </div>
    </section>
    )
}

export default Certifications
