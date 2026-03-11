"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { submitContactForm } from "@/lib/supabase-data";

export default function ContactPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', practice_area: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!form.full_name.trim()) errors.full_name = "Name is required.";
    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email.";
    }
    if (!form.practice_area) errors.practice_area = "Practice Area is required.";
    if (!form.message.trim()) errors.message = "Message is required.";

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setStatus('sending');
    try {
      const { phone, ...submissionData } = form;
      await submitContactForm(submissionData);
      setStatus('sent');
      setForm({ full_name: '', email: '', phone: '', practice_area: '', subject: '', message: '' });
      setValidationErrors({});
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#f5f7f8] dark:bg-[#0f1923]">
        {/* Hero Section */}
        <section className="relative bg-primary dark:bg-slate-950 overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_60%_40%,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          </div>
          <div className="container max-w-7xl mx-auto md:px-4 px-2 text-center relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#C5A059] font-bold tracking-widest uppercase text-sm mb-4"
            >
              Get In Touch
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
            >
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-blue-100/60 text-lg md:text-xl font-medium max-w-2xl mx-auto"
            >
              We are here to answer your questions and provide the legal support you need.
              Reach out to us today for a free initial consultation.
            </motion.p>
          </div>
        </section>

        <div className="container max-w-7xl mx-auto md:px-4 px-6 relative z-20 -mt-10 lg:-mt-16 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-6"
            >
              <Card className="border-none shadow-xl xl:shadow-2xl rounded-[2rem] bg-white dark:bg-slate-900 py-10 px-8">
                <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">Office Specs</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-2">Direct lines to our partners.</p>
                </CardHeader>
                <CardContent className="px-0 pt-8 space-y-8">
                  <div className="flex gap-5 group">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 dark:bg-[#C5A059]/10 flex items-center justify-center shrink-0 group-hover:bg-primary dark:group-hover:bg-[#C5A059] transition-colors duration-500">
                      <MapPin className="h-5 w-5 text-primary dark:text-[#C5A059] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">Headquarters</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">123 Justice Way, Suite 500<br />New York, NY 10001</p>
                    </div>
                  </div>

                  <div className="flex gap-5 group">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 dark:bg-[#C5A059]/10 flex items-center justify-center shrink-0 group-hover:bg-primary dark:group-hover:bg-[#C5A059] transition-colors duration-500">
                      <Phone className="h-5 w-5 text-primary dark:text-[#C5A059] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">Phone</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex gap-5 group">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 dark:bg-[#C5A059]/10 flex items-center justify-center shrink-0 group-hover:bg-primary dark:group-hover:bg-[#C5A059] transition-colors duration-500">
                      <Mail className="h-5 w-5 text-primary dark:text-[#C5A059] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">Email</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">info@justicelaw.com</p>
                    </div>
                  </div>

                  <div className="flex gap-5 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">Business Hours</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Mon - Fri: 9:00 AM - 6:00 PM<br />Sat - Sun: By Appointment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="border-none shadow-xl xl:shadow-2xl h-full rounded-[2rem] bg-white dark:bg-slate-900 py-10 px-8 md:px-12">
                <CardHeader className="px-0 pt-0 pb-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50">Send Us a Message</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">All communications are secured by attorney-client privilege.</p>
                </CardHeader>
                <CardContent className="px-0">
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="full-name" className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                        <Input id="full-name" data-testid="contact-name-input" required placeholder="John Doe" className={`h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:ring-primary focus:border-primary transition-all px-5 font-bold ${validationErrors.full_name ? 'border-red-500' : ''}`} value={form.full_name} onChange={e => { setForm(f => ({ ...f, full_name: e.target.value })); setValidationErrors(prev => ({ ...prev, full_name: '' })); }} />
                        {validationErrors.full_name && <p className="text-red-500 text-sm font-medium">{validationErrors.full_name}</p>}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                        <Input id="email" data-testid="contact-email-input" type="email" required placeholder="john@example.com" className={`h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:ring-primary focus:border-primary transition-all px-5 font-bold ${validationErrors.email ? 'border-red-500' : ''}`} value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setValidationErrors(prev => ({ ...prev, email: '' })); }} />
                        {validationErrors.email && <p className="text-red-500 text-sm font-medium">{validationErrors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="practice-area" className="text-xs font-black uppercase tracking-widest text-slate-400">Practice Area</Label>
                        <select
                          id="practice-area"
                          name="practice_area"
                          data-testid="contact-practice-select"
                          required
                          className={`flex h-14 w-full rounded-2xl border bg-slate-50/50 dark:bg-slate-800/30 px-5 font-bold text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400 transition-all ${validationErrors.practice_area ? 'border-red-500 border-2' : 'border-slate-100 dark:border-slate-800'}`}
                          value={form.practice_area}
                          onChange={e => { setForm(f => ({ ...f, practice_area: e.target.value })); setValidationErrors(prev => ({ ...prev, practice_area: '' })); }}
                        >
                          <option value="" disabled>Select a practice area</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Family Law">Family Law</option>
                          <option value="Immigration">Immigration</option>
                          <option value="Corporate Law">Corporate Law</option>
                          <option value="Criminal Defense">Criminal Defense</option>
                          <option value="Civil Litigation">Civil Litigation</option>
                        </select>
                        {validationErrors.practice_area && <p className="text-red-500 text-sm font-medium">{validationErrors.practice_area}</p>}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</Label>
                        <Input id="subject" placeholder="Case nature or reference" className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:ring-primary focus:border-primary transition-all px-5 font-bold" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-slate-400">Message</Label>
                      <textarea
                        id="message"
                        data-testid="contact-message-textarea"
                        required
                        className={`w-full min-h-[180px] rounded-3xl border-2 bg-slate-50/50 dark:bg-slate-800/30 px-5 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 transition-all resize-none ${validationErrors.message ? 'border-red-500' : 'border-slate-100 dark:border-slate-800'}`}
                        placeholder="Please brief us on your situation..."
                        value={form.message}
                        onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setValidationErrors(prev => ({ ...prev, message: '' })); }}
                      />
                      {validationErrors.message && <p className="text-red-500 text-sm font-medium">{validationErrors.message}</p>}
                    </div>
                    <Button type="submit" id="contact-submit-btn" data-testid="contact-submit-btn" disabled={status === 'sending'} className="w-full sm:w-auto bg-primary dark:bg-[#C5A059] text-white px-12 py-7 cursor-pointer hover:bg-primary/90 rounded-2xl font-black uppercase tracking-[0.15em] text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                      {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Message Sent!' : status === 'error' ? 'Error — Retry' : 'Dispatch Message'}
                    </Button>
                    {status === 'sent' && <p id="contact-success-msg" data-testid="contact-success-msg" className="mt-4 text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl inline-block">Thank you! Your message has been sent successfully.</p>}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
