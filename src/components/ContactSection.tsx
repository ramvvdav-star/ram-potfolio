import React, { useState } from 'react';
import {
  Mail,
  Send,
  Shield,
  Key,
  Copy,
  Check,
  MapPin,
  ExternalLink,
  Lock,
  AlertTriangle,
  Github,
  CheckCircle2,
  Linkedin,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

export const ContactSection: React.FC = () => {
  const { siteSettings, addContactMessage } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Vulnerability disclosure');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const fallbackPgpKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.10.1
Comment: https://ram.sec/pgp-key

mQGNBF+v49cBDADb7yS4s9x9cK...RAM.SEC.KEY...
fp4V12D8xK7yW2a9B9e0E5k4p9z1...
=f89x
-----END PGP PUBLIC KEY BLOCK-----`;

  const activePgpKey = siteSettings.pgpPublicKey || fallbackPgpKey;

  const copyPgpKey = () => {
    soundFx.playKeyClick();
    navigator.clipboard.writeText(activePgpKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    soundFx.playKeyClick();
    setIsSubmitting(true);

    setTimeout(() => {
      addContactMessage({
        name,
        email,
        inquiryType,
        subject: subject || `${inquiryType} from ${name}`,
        message,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 600);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
      {/* Header */}
      <div className="mb-12">
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
          <Mail className="w-3.5 h-3.5" /> SECURE COMMS // INQUIRIES & DISCLOSURE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
          Initiate Contact
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-1">
          Direct encrypted channel for vulnerability reports, collaborative security engineering, and consulting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Coordinates & PGP Key */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-[#090d16]/80 p-6 space-y-5">
            <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              COMMUNICATION ENDPOINTS
            </h3>

            <div className="space-y-3 font-mono text-xs text-zinc-300">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 uppercase text-[10px]">EMAIL (PRIMARY)</span>
                  <div className="text-emerald-400 font-semibold">{siteSettings.email}</div>
                </div>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 uppercase text-[10px]">SOCIAL // X (TWITTER)</span>
                  <div className="text-cyan-400 font-semibold">{siteSettings.socialHandle}</div>
                </div>
                <a
                  href={siteSettings.twitterUrl || (siteSettings.socialHandle?.startsWith('http') ? siteSettings.socialHandle : `https://x.com/${siteSettings.socialHandle?.replace('@', '')}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 uppercase text-[10px]">GITHUB PROFILE</span>
                  <div className="text-white font-semibold">{siteSettings.githubUrl?.replace(/^https?:\/\//, '') || 'github.com/ram-sec'}</div>
                </div>
                <a
                  href={siteSettings.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              </div>

              {siteSettings.linkedinUrl && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px]">LINKEDIN PROFESSIONAL</span>
                    <div className="text-blue-400 font-semibold">{siteSettings.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}</div>
                  </div>
                  <a
                    href={siteSettings.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {siteSettings.telegramUrl && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px]">TELEGRAM ENCRYPTED COMMS</span>
                    <div className="text-sky-400 font-semibold">{siteSettings.telegramUrl.replace(/^https?:\/\/t\.me\//, '@')}</div>
                  </div>
                  <a
                    href={siteSettings.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {siteSettings.discordHandle && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px]">DISCORD SEC OPS</span>
                    <div className="text-indigo-400 font-semibold">{siteSettings.discordHandle}</div>
                  </div>
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              )}

              {siteSettings.phone && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px]">PHONE / SIGNAL</span>
                    <div className="text-zinc-200 font-semibold">{siteSettings.phone}</div>
                  </div>
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              )}

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 uppercase text-[10px]">LOCATION</span>
                  <div className="text-zinc-200 font-semibold">{siteSettings.location}</div>
                </div>
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>

            {/* PGP Key Block */}
            <div className="pt-2 border-t border-zinc-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                  <Key className="w-3.5 h-3.5 text-amber-400" /> PGP PUBLIC KEY ({siteSettings.brandName || 'RAM.SEC'})
                </span>
                <button
                  onClick={copyPgpKey}
                  className="text-[11px] text-zinc-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 overflow-x-auto select-all">
                {activePgpKey}
              </pre>
            </div>
          </div>

          {/* Ethical Disclaimer */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 text-xs font-mono text-zinc-400 flex items-start gap-3">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong className="text-zinc-200">ETHICAL STANDARD: </strong>
              I do not perform unauthorized testing or malicious activities. All inquiries and research collaborations must adhere strictly to ethical security practices and established responsible disclosure guidelines.
            </p>
          </div>
        </div>

        {/* Right Column: Encrypted Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-zinc-800 bg-[#090d16]/90 p-6 sm:p-8 space-y-6">
            <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
              <Mail className="w-4 h-4 text-cyan-400" />
              TRANSMIT SECURE INQUIRY
            </h3>

            {isSubmitted ? (
              <div className="p-8 text-center space-y-4 font-mono">
                <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Transmission Delivered</h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Your inquiry has been encrypted and recorded into the local dispatch log. Ram will review and respond via your registered address.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 hover:text-white"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Your Name / Handle *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Email Endpoint *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Inquiry Type</label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50"
                    >
                      <option value="Vulnerability disclosure">Vulnerability disclosure</option>
                      <option value="Consulting/Work">Consulting / Security Audit</option>
                      <option value="Collaboration">Open Source / Collaboration</option>
                      <option value="CTF/Team">CTF / Red Team Practice</option>
                      <option value="General">General Security Question</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief topic..."
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 text-[11px] uppercase">Message / Technical Details *</label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide context or technical parameters..."
                    className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'DISPATCHING...' : 'DISPATCH SECURE TRANSMISSION'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
