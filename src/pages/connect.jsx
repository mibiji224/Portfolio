import { ArrowRight, Github, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { useRef, useState } from 'react';
import SectionLabel from '@/components/SectionLabel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMagnetic } from '@/hooks/useMagnetic'

// Custom TikTok icon since Lucide doesn't include it by default.
const TikTokIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        className={props.className || 'w-4 h-4'}
    >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
);

// Define social links data
const socialLinks = [
    { name: 'Github', Icon: Github, href: 'https://github.com/mibiji224' },
    { name: 'LinkedIn', Icon: Linkedin, href: 'https://www.linkedin.com/in/desireesoronio/' },
    { name: 'Instagram', Icon: Instagram, href: 'https://www.instagram.com/mizukiraki/' },
    { name: 'Tiktok', Icon: TikTokIcon, href: 'https://tiktok.com/hexagrine' },
];

const App = () => {
    const submitRef = useRef(null);
    useMagnetic(submitRef);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- UPDATED SUBMIT FUNCTION ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);

        // This points to the Vercel function you created in /api/send-email.js
        const apiEndpoint = '/api/send-email';

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatusMessage('✅ Message sent successfully! I will respond soon.');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                // Fixed Syntax here: Using backticks for template literal and proper fallback logic
                const errorData = await response.json().catch(() => ({ message: 'Unknown server error.' }));
                setStatusMessage(`❌ Failed to send message: ${errorData.message || 'Server error occurred.'}`);
            }

        } catch (error) {
            // NOTE: In this preview environment, fetch will likely fail (404) because the API doesn't exist.
            // In a real app, this catch block handles network errors.
            console.error("Submission error:", error);
            setStatusMessage('❌ Network connection error. Please try again.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatusMessage(null), 5000);
        }
    };
    // -----------------------------------------------------


    return (
        // Added min-h-[100dvh] and bg-background for the preview to look correct
        <div className="min-h-[100dvh] bg-transparent flex items-center justify-center">
            <section className="w-full text-foreground py-16 sm:py-20 px-4 sm:px-6 lg:px-10 font-sans relative overflow-hidden" id="connect">

                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">

                        {/* --- LEFT COLUMN: Engaging Text & Contact Info --- */}
                        <div className="lg:col-span-7 space-y-8 sm:space-y-10">
                            <div>
                                <SectionLabel index="08" className="mb-8">contact</SectionLabel>

                                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                                    Let’s build something <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-primary-strong">extraordinary together.</span>
                                </h1>

                                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl font-light">
                                    I'm currently available for freelance work and open to new opportunities.
                                    If you have a project that needs a creative touch, or just want to discuss
                                    the latest tech, I'm all ears.
                                </p>
                            </div>

                            {/* Contact Info Row */}
                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 py-6 border-t border-border border-b">
                                {/* Email */}
                                <div className="flex items-start gap-4 min-w-0">
                                    <div className="p-3 shrink-0 rounded-full bg-transparent text-primary-strong border border-border">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider mb-1">Email Me</p>
                                        <a href="mailto:desireesoronio@gmail.com" className="block break-all text-base sm:text-lg font-medium text-foreground hover:text-primary-strong transition-colors">
                                            desireesoronio@gmail.com
                                        </a>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 shrink-0 rounded-full bg-transparent text-primary-strong border border-border">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider mb-1">Based In</p>
                                        <p className="text-lg font-medium text-foreground">Philippines</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div>
                                <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider mb-4">Follow Me</p>
                                <div className="flex gap-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Follow me on ${link.name}`}
                                            className="w-10 h-10 rounded-full bg-transparent border border-primary/30 flex items-center justify-center text-muted-foreground hover:text-primary-foreground hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <link.Icon className="w-4 h-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: Compact Form --- */}
                        <div className="lg:col-span-5">
                            <Card className="bg-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl relative">
                                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                    <h3 className="text-xl font-bold text-foreground mb-2">Send a Message</h3>

                                    {/* Status Message Display */}
                                    {statusMessage && (
                                        <div className={`p-4 rounded-xl text-sm ${statusMessage.startsWith('✅') ? 'bg-green-900/50 border border-green-700 text-green-300' : 'bg-destructive/15 border border-destructive/40 text-primary-strong'}`}>
                                            {statusMessage}
                                        </div>
                                    )}

                                    {/* Name Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="contact-name" className={focusedField === 'name' ? 'text-primary-strong' : undefined}>Name</Label>
                                        <Input
                                            id="contact-name"
                                            type="text" name="name" value={formData.name} onChange={handleChange}
                                            onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                                            required placeholder="Your Name"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="contact-email" className={focusedField === 'email' ? 'text-primary-strong' : undefined}>Email</Label>
                                        <Input
                                            id="contact-email"
                                            type="email" name="email" value={formData.email} onChange={handleChange}
                                            onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                                            required placeholder="your_email@example.com"
                                        />
                                    </div>

                                    {/* Subject Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="contact-subject" className={focusedField === 'subject' ? 'text-primary-strong' : undefined}>Subject</Label>
                                        <Input
                                            id="contact-subject"
                                            type="text" name="subject" value={formData.subject} onChange={handleChange}
                                            onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField(null)}
                                            required placeholder="Project Inquiry, Hello, etc."
                                        />
                                    </div>

                                    {/* Message Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="contact-message" className={focusedField === 'message' ? 'text-primary-strong' : undefined}>Message</Label>
                                        <Textarea
                                            id="contact-message"
                                            name="message" value={formData.message} onChange={handleChange}
                                            onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                                            required rows="4" placeholder="How can I help you?"
                                            className="resize-none"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        ref={submitRef}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-primary to-primary-deep text-primary-foreground text-sm font-bold py-4 h-auto rounded-xl mt-2"
                                    >
                                        <span className="inline-flex items-center justify-center gap-2">
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                        </span>
                                    </Button>
                                </form>
                            </Card>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default App;