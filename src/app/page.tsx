"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import Image from "next/image";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Scale, ShieldCheck, Gavel, Users, Briefcase, Building2, Mail, Share2, Star, FileText, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { attorneys as fallbackAttorneys } from "@/data/attorneys";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAttorneys, getTestimonials, getServices, submitContactForm, type Attorney, type Testimonial, type Service, iconMap } from "@/lib/supabase-data";

// Services will be fetched from Supabase
const defaultServices = [
  {
    title: "Corporate Law",
    description: "Expert guidance for business formations, contracts, mergers, acquisitions, and regulatory compliance across various industries.",
    icon_name: "Building2",
  },
  {
    title: "Criminal Defense",
    description: "Vigorous and ethical representation protecting your constitutional rights and freedom in local and federal criminal matters.",
    icon_name: "Gavel",
  },
  {
    title: "Civil Litigation",
    description: "Experienced advocates for resolving complex disputes in court or through alternative dispute resolution and mediation.",
    icon_name: "FileText",
  },
  {
    title: "Family Law",
    description: "Compassionate legal support for sensitive matters including divorce, child custody, adoption, and pre-nuptial agreements.",
    icon_name: "Heart",
  },
  {
    title: "Real Estate Law",
    description: "Expert handling of property transactions, zoning, lease agreements, and real estate litigation.",
    icon_name: "Building2",
  },
];

const fallbackTestimonials = [
  {
    id: "1",
    name: "Robert King",
    role: "CEO, Apex Solutions",
    content: "Justice Law Center handled my corporate litigation with absolute professionalism. Their strategic approach saved us millions.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR8XOpZB39k2qXAqjU3Fyp39qPmud9xwdGQ2Jzl-VRXXqAXEp424ZX1-PQeh_qZC-U339OsgW_S_DPeRYX7_FiAjGAIWjeQgu2cOODgz95G2VoMEgrPOGFobcXo1GSnCEPXG4GCiqs586JMwmaQUU9Re3wwA9yy8uUHCVGIENpXKGB_QaspUFotlRjmFG6gdhQ9ajq-aByAtz3DlI6rdXcSJybBfKHqPaXnGRRvyto_RW2I3WS0PMeptXIzlv4gqLQ1dUDBwW5A-E"
  },
  {
    id: "2",
    name: "Michelle Davis",
    role: "Educator",
    content: "During my divorce, the team was compassionate and incredibly effective. They secured my future and the custody of my children.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhY8ZvJreqwgciwEmQwxMwSnovmuQtZFoiKL_5nGIJBfkd6BXl34D9VHPHHUe-4QihFh0tYOymjtGDwEfV8oVPJGTieY1Xekv6IHEKvGTIZUyk51FvnLDVV_oSkqmPjq2lU2zHGfFDSg_ppjTx2ZF4_rbdNQUlXyWicM5VyXd1g6LIGOj9V8Z7FB9KbpXWPEF3Rdh4MHB8rRGpVRebaSt3vzyVcpTJyMsVAWakfY-Y2WfXNgxZ-ztyTbXILkHyKpwhJvdsMqGJH6g"
  },
  {
    id: "3",
    name: "Jonathan Peters",
    role: "Property Developer",
    content: "They won a case that other firms wouldn't even touch. Truly the most talented and dedicated team I've ever worked with.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWVeJOkw7DmTlObRejrk01osUmGak70sCUwu2K3K2uJtF--gt435-kTZuPN39UF_vI3uQPG15KtMTmtrTvVuFRHozqH4Vx4v_zkZIiP2O-iELgdVO67jdiiv7gBiFeqP6eiyXC2L_9_oY1tCKl3azsbcHs0nTi874xxDgTXZ-yt2DwL0nH1k9SSRUsQ3FpRRRK4QfZqx8bczgxquSQFrbabKx7ZL9WBie3B3ctxGTo_Y693l4cewAlTHk1WbdI393d69PDE4qc9N0"
  }
];

export default function Home() {
  const router = useRouter();
  const [attorneys, setAttorneys] = useState<Attorney[]>(fallbackAttorneys.map(a => ({ ...a, educationUndergrad: a.educationUndergrad })));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [services, setServices] = useState<Service[]>(defaultServices as Service[]);
  const [contactForm, setContactForm] = useState({ full_name: '', email: '', practice_area: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    getAttorneys().then(setAttorneys).catch(console.error);
    getTestimonials().then(data => { if (data.length) setTestimonials(data); }).catch(console.error);
    getServices().then(data => { if (data.length) setServices(data); }).catch(console.error);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('sending');
    try {
      await submitContactForm(contactForm);
      setContactStatus('sent');
      setContactForm({ full_name: '', email: '', practice_area: '', message: '' });
    } catch {
      setContactStatus('error');
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Services Section */}
        <section className="px-6 lg:px-4 py-20 bg-slate-50 dark:bg-slate-900/50" id="services">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="text-[#C5A059] font-bold tracking-widest uppercase text-sm">Expertise</span>
              <h2 className="text-slate-900 dark:text-slate-100 text-3xl lg:text-5xl font-black tracking-tight">Our Legal Services</h2>
              <div className="h-1.5 w-24 bg-[#C5A059] rounded-full" />
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mt-4">
                Comprehensive legal solutions across multiple practice areas, delivered by specialists with decades of experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 5).map((service, index) => {
                const Icon = iconMap[service.icon_name] || ShieldCheck;
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group h-full border-none bg-white dark:bg-slate-800 p-8 hover:shadow-2xl transition-all duration-500 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-all group-hover:bg-primary/10" />
                      <div className="bg-primary/10 dark:bg-[#C5A059]/10 w-16 h-16 rounded-xl flex items-center justify-center text-primary dark:text-[#C5A059] group-hover:bg-primary group-hover:text-white transition-all mb-8">
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-2xl mb-4 text-slate-900 dark:text-slate-100 font-bold">{service.title}</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed text-base mb-8">
                        {service.description}
                      </CardDescription>
                      <Link href="/services" className="text-primary dark:text-[#C5A059] font-bold inline-flex items-center gap-2 group/link">
                        Learn More <span className="group-hover/link:translate-x-2 transition-transform duration-300">→</span>
                      </Link>
                    </Card>
                  </motion.div>
                );
              })}

              {/* Consultation CTA Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col gap-6 rounded-2xl bg-primary dark:bg-[#C5A059] p-10 justify-center items-center text-center text-white"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <Scale className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold">Need Custom Help?</h3>
                <p className="text-white/80 text-lg">Every case is unique. Contact us for a specialized consultation and let us find the best strategy for you.</p>
                <Button className="mt-4 bg-white text-primary dark:text-slate-900 hover:!bg-[#C5A059] hover:text-white font-bold h-14 px-10 text-lg rounded-xl shadow-xl" asChild>
                  <Link href="/booking">Schedule Now</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="px-6 lg:px-4 py-24 bg-white dark:bg-[#0f1923]" id="about">
          <div className="container max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="flex-1 space-y-10">
                <div className="space-y-4">
                  <span className="text-[#C5A059] font-bold tracking-widest uppercase text-sm">Excellence</span>
                  <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 leading-tight">Why Choose Justice Law Center</h2>
                  <div className="h-1.5 w-24 bg-[#C5A059] rounded-full" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">We understand that choosing legal representation is a critical decision. Our firm stands on a foundation of integrity, unparalleled expertise, and a relentless commitment to our clients&apos; success.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {[
                    { title: "Proven Expertise", desc: "Decades of combined legal experience in complex litigation.", icon: ShieldCheck },
                    { title: "Client Focused", desc: "We put your interests first with personalized attention.", icon: Scale },
                    { title: "Award Winning", desc: "Recognized by national law associations for excellence.", icon: Gavel },
                    { title: "Transparency", desc: "No hidden fees, just honest and clear legal guidance.", icon: FileText }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex gap-5"
                    >
                      <div className="bg-primary/5 dark:bg-[#C5A059]/5 p-3 rounded-lg h-fit">
                        <item.icon className="text-primary dark:text-[#C5A059] h-7 w-7 shrink-0" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6 pt-12">
                    <div className="aspect-[4/5] rounded-2xl bg-slate-100 overflow-hidden shadow-2xl relative group">
                      <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                      <Image alt="Antique scales of justice" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnUvzbQlGFSe08zlGyNDwTBwrytTnOHVLj_7JiUAp3N6PCsYQwX5_P3ZIjwiP_AeFVPdA1UGRfs5hBflhQ-6QSHgZRQFvZdLMokB-6XuEypH1guz8AmXckzeYwg8cGyNxYuuYoDV0iIaDEc512nPMuTyE2PnzEmBbGSaCyIIj6Hew9nLPQ6ZSjXLNKVFmxrYx7_VhMEe2K1qjI65M--M9_wO-WEJjMedWoUESPW1UMt_uCwlBUzxUqBx1_tkMYgla3QQMV51BVEP4" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="aspect-[4/5] rounded-2xl bg-slate-100 overflow-hidden shadow-2xl relative group">
                      <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                      <Image alt="Signing legal documents" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf2pK9Npxr8QNTSZDMj73uCZmrkp6lQZ_08YCpehl3l6jLAgqe5xQY1wnHcRhpxrLIe7J3vTcsFgr8IbNHit3kNT6O-1NhHYHF-N7t2Qcc7HwNKBzi0Fy3Yn3lJyfzJC9qQrzXZWKqSjOV3_fatORUAGNzq6e4OiVvl4sbolfsIyqWQAOgR6rOH2ZB1uOhAgOrZc_aUSZZajRAg5GLknKkbW7ecOGkUJ0SYe9XQ0T_I0Cqy2B6h_NW0KI84OWUJ3Ocx1nDq4X6Bs8" />
                    </div>
                    <div className="bg-[#C5A059] p-8 rounded-2xl text-slate-900 shadow-xl">
                      <p className="text-3xl font-black mb-2">25+</p>
                      <p className="text-sm font-bold uppercase tracking-wider">Years of Excellence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Elite Attorneys Section */}
        <section className="px-6 lg:px-4 py-24 bg-slate-50 dark:bg-slate-900/50" id="lawyers">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="text-[#C5A059] font-bold tracking-widest uppercase text-sm">Our Team</span>
              <h2 className="text-slate-900 dark:text-slate-100 text-3xl lg:text-5xl font-black tracking-tight">Our Elite Attorneys</h2>
              <div className="h-1.5 w-24 bg-[#C5A059] rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {attorneys.map((lawyer, index) => (
                <motion.div
                  key={lawyer.id}
                  onClick={() => router.push(`/attorneys/${lawyer.slug}`)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-primary/5 hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                >
                  <div className="h-80 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                    <Image
                      alt={lawyer.name}
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      src={lawyer.image}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-8 text-center">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{lawyer.name}</h4>
                    <p className="text-[#C5A059] text-sm font-bold uppercase tracking-wider mb-6">{lawyer.role}</p>
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:info@justicelawcenter.com?subject=Consultation with ${lawyer.name}`; }}
                        variant="outline" size="icon" className="cursor-pointer h-10 w-10 rounded-xl border-primary/10 hover:bg-primary hover:text-white transition-all">
                        <Mail className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                            navigator.share({ title: lawyer.name, url: `${window.location.origin}/attorneys/${lawyer.slug}` }).catch(console.error);
                          } else {
                            navigator.clipboard.writeText(`${window.location.origin}/attorneys/${lawyer.slug}`);
                            alert("Profile link copied!");
                          }
                        }}
                        variant="outline" size="icon" className="cursor-pointer h-10 w-10 rounded-xl border-primary/10 hover:bg-primary hover:text-white transition-all">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 lg:px-4 py-24 bg-white dark:bg-[#0f1923]" id="how-it-works">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-20 flex flex-col items-center gap-4">
              <span className="text-[#C5A059] font-bold tracking-widest uppercase text-sm">Our Approach</span>
              <h2 className="text-slate-900 dark:text-slate-100 text-3xl lg:text-5xl font-black tracking-tight">Our Seamless Process</h2>
              <div className="h-1.5 w-24 bg-[#C5A059] rounded-full" />
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { title: "Schedule Consultation", desc: "Book your initial meeting via our website or phone to discuss your case details.", step: 1 },
                { title: "Case Evaluation", desc: "Our experts analyze your situation and develop a personalized legal strategy for success.", step: 2 },
                { title: "Legal Representation", desc: "We execute the strategy, fighting for your rights and keeping you informed at every step.", step: 3 }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="flex flex-col items-center text-center gap-8 relative z-10 group"
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-2xl transition-transform duration-500 group-hover:scale-110 ${item.step % 2 === 0 ? 'bg-primary dark:bg-[#C5A059]/80' : 'bg-primary dark:bg-[#C5A059]'}`}>
                    {item.step}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
              <div className="hidden md:block absolute top-10 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-0" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-6 lg:px-4 py-24 bg-primary dark:bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -ml-48 -mb-48 border border-white/5" />

          <div className="container max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 flex flex-col items-center gap-4">
              <span className="text-accent dark:text-[#C5A059] font-bold tracking-widest uppercase text-sm">Success Stories</span>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight">Client Testimonials</h2>
              <div className="h-1.5 w-24 bg-accent dark:bg-[#C5A059] rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white/10 dark:bg-slate-800/50 p-10 rounded-3xl border border-white/10 backdrop-blur-md flex flex-col justify-between hover:bg-white/15 transition-all duration-300"
                >
                  <div>
                    <div className="flex gap-1 text-accent dark:text-[#C5A059] mb-6">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-5 w-5 fill-current" />)}
                    </div>
                    <p className="italic text-white/90 mb-10 text-xl font-medium leading-relaxed">&quot;{t.content}&quot;</p>
                  </div>
                  <div className="flex items-center gap-5 pt-6 border-t border-white/10">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent/30 p-0.5 relative shrink-0">
                      <Image src={t.image} alt={t.name} fill sizes="56px" className="object-cover rounded-full" />
                    </div>
                    <div>
                      <h5 className="font-bold text-lg">{t.name}</h5>
                      <p className="text-sm text-white/60 font-medium">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-6 lg:px-4 py-20 bg-slate-50/50" id="contact">
          <div className="container max-w-7xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-primary/5">
              <div className="flex-1 p-8 lg:p-16">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Contact Our Team</h2>
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</Label>
                      <Input className="rounded-lg border-primary/20 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 px-4 py-2 h-12" data-testid="contact-name-input" placeholder="John Doe" value={contactForm.full_name} onChange={e => setContactForm(f => ({ ...f, full_name: e.target.value }))} required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</Label>
                      <Input className="rounded-lg border-primary/20 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 px-4 py-2 h-12" data-testid="contact-email-input" placeholder="john@example.com" type="email" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Practice Area</Label>
                    <select className="flex h-12 w-full items-center justify-between rounded-md border border-primary/20 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:border-slate-700" data-testid="contact-practice-select" value={contactForm.practice_area} onChange={e => setContactForm(f => ({ ...f, practice_area: e.target.value }))}>
                      <option value="">Select a Service</option>
                      <option>Civil Law</option>
                      <option>Criminal Defense</option>
                      <option>Family Law</option>
                      <option>Corporate Law</option>
                      <option>Real Estate Law</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message</Label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-md border border-primary/20 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:border-slate-700"
                      data-testid="contact-message-textarea"
                      placeholder="Briefly describe your situation..."
                      value={contactForm.message}
                      onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={contactStatus === 'sending'} className="w-full h-14 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all">
                    {contactStatus === 'sending' ? 'Sending...' : contactStatus === 'sent' ? '✓ Message Sent!' : contactStatus === 'error' ? 'Error — Retry' : 'Send Message'}
                  </Button>
                </form>
              </div>
              <div className="w-full lg:w-[400px] bg-primary text-white p-8 lg:p-16 flex flex-col gap-10">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-accent">Office Info</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <MapPin className="h-6 w-6 text-accent shrink-0" />
                      <p className="text-white/80">123 Justice Way, Suite 500<br />Legal District, New York 10001</p>
                    </div>
                    <div className="flex gap-4">
                      <Phone className="h-6 w-6 text-accent shrink-0" />
                      <p className="text-white/80">+1 (555) 123-4567</p>
                    </div>
                    <div className="flex gap-4">
                      <Mail className="h-6 w-6 text-accent shrink-0" />
                      <p className="text-white/80">info@justicelawcenter.com</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-accent">Office Hours</h3>
                  <div className="space-y-2 text-white/80">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span>Mon - Fri</span>
                      <span>8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span>Saturday</span>
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-accent">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
