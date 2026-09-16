import { ArrowRight, Github, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';

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
        <path d="M12.553 2.45c-.247-.07-.478.113-.424.36l.28 1.28c.045.205-.098.397-.306.452l-2.073.552a.49.49 0 0 1-.58-.58L9.93 2.155c.05-.23-.11-.46-.353-.518l-1.63-.44c-.24-.06-.49.12-.44.364l.28 1.28c.05.23-.11.46-.35.52l-2.07.55c-.24.06-.49-.12-.44-.36l.28-1.28c.05-.23-.11-.46-.35-.52l-1.63-.44c-.24-.06-.49.12-.44.36L4.23 6.94c0 3.86 3.14 7 7 7h.03c1.78 0 3.32-.7 4.54-1.85 1.22-1.15 1.93-2.65 1.93-4.32V6.26c0-.24-.19-.44-.43-.44h-2.12c-.24 0-.44.19-.44.43v5.1c0 1.54-1.25 2.79-2.79 2.79H12c-1.54 0-2.79-1.25-2.79-2.79V5.04c0-.24.19-.44.43-.44h2.12c.24 0 .44.19.44.43v2.82c0 .24.19.44.43.44h2.12c.24 0 .43-.19.43-.43V4.92c0-1.54-1.25-2.79-2.79-2.79z" />
    </svg>
);

// Define social links data
const socialLinks = [
    { name: 'Github', Icon: Github, href: 'https://github.com/mibiji224' },
    { name: 'LinkedIn', Icon: Linkedin, href: 'https://www.linkedin.com/in/desireesoronio/' },
    { name: 'Instagram', Icon: Instagram, href: 'https://instagram.com/mibiji224' },
    { name: 'Tiktok', Icon: TikTokIcon, href: 'https://tiktok.com/hexagrine' },
];

const App = () => {
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

    const inputStyle = "w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#db0a0a] focus:ring-1 focus:ring-[#db0a0a] transition-all placeholder-gray-500";
    const labelBaseStyle = "text-[10px] font-bold tracking-widest uppercase transition-colors";

    return (
        // Added min-h-screen and bg-neutral-950 for the preview to look correct
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <section className="w-full text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-12 font-sans relative overflow-hidden" id="connect">

                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">

                        {/* --- LEFT COLUMN: Engaging Text & Contact Info --- */}
                        <div className="lg:col-span-7 space-y-8 sm:space-y-10">
                            <div>
                                <span className="flex items-center gap-3 text-[#db0a0a] font-mono text-sm tracking-widest uppercase mb-6">
                                    <span className="w-8 h-[1px] bg-[#db0a0a]"></span>
                                    Get in Touch
                                </span>

                                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                                    Let’s build something <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">extraordinary together.</span>
                                </h2>

                                <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl font-light">
                                    I'm currently available for freelance work and open to new opportunities.
                                    If you have a project that needs a creative touch, or just want to discuss
                                    the latest tech, I'm all ears.
                                </p>
                            </div>

                            {/* Contact Info Row */}
                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 py-6 border-t border-white/5 border-b">
                                {/* Email */}
                                <div className="flex items-start gap-4 min-w-0">
                                    <div className="p-3 shrink-0 rounded-full bg-transparent text-[#db0a0a] border border-white/10">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Me</p>
                                        <a href="mailto:desireesoronio@gmail.com" className="block break-all text-base sm:text-lg font-medium text-white hover:text-[#db0a0a] transition-colors">
                                            desireesoronio@gmail.com
                                        </a>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 shrink-0 rounded-full bg-transparent text-[#db0a0a] border border-white/10">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Based In</p>
                                        <p className="text-lg font-medium text-white">Philippines</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Follow Me</p>
                                <div className="flex gap-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Follow me on ${link.name}`}
                                            className="w-10 h-10 rounded-full bg-transparent border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#db0a0a] hover:border-[#db0a0a] hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <link.Icon className="w-4 h-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: Compact Form --- */}
                        <div className="lg:col-span-5">
                            <div className="bg-transparent border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl relative shadow-none backdrop-blur-sm">
                                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-2">Send a Message</h3>

                                    {/* Status Message Display */}
                                    {statusMessage && (
                                        <div className={`p-4 rounded-xl text-sm ${statusMessage.startsWith('✅') ? 'bg-green-900/50 border border-green-700 text-green-300' : 'bg-red-900/50 border border-red-700 text-red-300'}`}>
                                            {statusMessage}
                                        </div>
                                    )}

                                    {/* Name Field */}
                                    <div className="space-y-1">
                                        <label className={`${labelBaseStyle} ${focusedField === 'name' ? 'text-[#db0a0a]' : 'text-gray-500'}`}>Name</label>
                                        <input
                                            type="text" name="name" value={formData.name} onChange={handleChange}
                                            onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                                            required placeholder="Your Name"
                                            className={inputStyle}
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-1">
                                        <label className={`${labelBaseStyle} ${focusedField === 'email' ? 'text-[#db0a0a]' : 'text-gray-500'}`}>Email</label>
                                        <input
                                            type="email" name="email" value={formData.email} onChange={handleChange}
                                            onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                                            required placeholder="your_email@example.com"
                                            className={inputStyle}
                                        />
                                    </div>

                                    {/* Subject Field */}
                                    <div className="space-y-1">
                                        <label className={`${labelBaseStyle} ${focusedField === 'subject' ? 'text-[#db0a0a]' : 'text-gray-500'}`}>Subject</label>
                                        <input
                                            type="text" name="subject" value={formData.subject} onChange={handleChange}
                                            onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField(null)}
                                            required placeholder="Project Inquiry, Hello, etc."
                                            className={inputStyle}
                                        />
                                    </div>

                                    {/* Message Field */}
                                    <div className="space-y-1">
                                        <label className={`${labelBaseStyle} ${focusedField === 'message' ? 'text-[#db0a0a]' : 'text-gray-500'}`}>Message</label>
                                        <textarea
                                            name="message" value={formData.message} onChange={handleChange}
                                            onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                                            required rows="4" placeholder="How can I help you?"
                                            className={`${inputStyle} resize-none`}
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-[#db0a0a] to-[#990808] text-white text-sm font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(219,10,10,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 mt-2 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default App;