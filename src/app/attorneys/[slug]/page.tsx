"use client";

import { use, useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Award,
  CheckCircle2,
  ChevronLeft,
  Star,
  Quote,
  ArrowRight,
  GraduationCap,
  Scale,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { attorneys as fallbackAttorneys } from "@/data/attorneys";
import { getAttorneyBySlug, type Attorney } from "@/lib/supabase-data";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AttorneyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const fallback = fallbackAttorneys.find((a) => a.slug === slug);
  const [attorney, setAttorney] = useState<Attorney | null>(
    fallback ? { ...fallback, educationUndergrad: fallback.educationUndergrad } : null
  );

  useEffect(() => {
    getAttorneyBySlug(slug).then((data) => {
      if (data) setAttorney(data);
    }).catch(console.error);
  }, [slug]);

  if (!attorney) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7f8] dark:bg-[#0f1923]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary dark:bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_60%_40%,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          </div>
          <div className="container max-w-7xl mx-auto md:px-4 px-6 py-16 md:py-24 relative z-10">
            <Link
              href="/attorneys"
              className="inline-flex items-center gap-2 text-blue-200/60 hover:text-white transition-colors mb-10 text-sm font-bold uppercase tracking-widest group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> All Attorneys
            </Link>

            <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-48 h-48 md:w-56 md:h-56 rounded-[2rem] overflow-hidden shadow-2xl xl:shadow-3xl ring-4 ring-white/10 dark:ring-[#C5A059]/20 flex-shrink-0 relative group"
              >
                <Image
                  src={attorney.image}
                  alt={attorney.name}
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center md:text-left"
              >
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                  {attorney.certifications?.map((cert) => (
                    <Badge
                      key={cert}
                      className="bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full backdrop-blur-sm"
                    >
                      <Award className="h-3 w-3 mr-2 text-[#C5A059]" />
                      {cert}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
                  {attorney.name}
                </h1>
                <p className="text-[#C5A059] text-lg font-black uppercase tracking-widest">
                  {attorney.role}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-20 z-20 shadow-sm backdrop-blur-md bg-white/90 dark:bg-slate-900/90">
          <div className="container max-w-7xl mx-auto md:px-4 px-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-slate-100 dark:divide-slate-800">
              <div className="border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800"><StatItem value={attorney.stats.casesWon} label="Cases Won" /></div>
              <div className="border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800"><StatItem value={attorney.stats.yearsExperience} label="Years Practice" /></div>
              <div className="border-r border-slate-100 dark:border-slate-800"><StatItem value={attorney.stats.clientRating} label="Client Rating" /></div>
              <div><StatItem value={attorney.stats.legalAwards} label="Legal Awards" /></div>
            </div>
          </div>
        </section>

        {/* Professional Philosophy */}
        <section className="py-24">
          <div className="container max-w-7xl mx-auto md:px-4 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-16">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-8">
                    Professional Philosophy
                  </h2>
                  <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                    <p>{attorney.philosophy}</p>
                    <p>{attorney.about}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Education */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" /> Education
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-bold">
                          {attorney.education}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-bold">
                          {attorney.educationUndergrad}
                        </span>
                      </li>
                      {attorney.certifications?.map((cert) => (
                        <li key={cert} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#C5A059] mt-2 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 font-bold">
                            {cert}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expertise */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                      <Scale className="h-4 w-4" /> Expertise
                    </h3>
                    <ul className="space-y-4">
                      {attorney.expertise.map((exp) => (
                        <li key={exp} className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 font-bold">
                            {exp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl xl:shadow-2xl space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                    Book a Consultation
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Schedule a confidential consultation to discuss your case
                    with {attorney.name}.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-primary dark:bg-[#C5A059] text-white rounded-2xl py-7 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    <Link href="/booking">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Now
                    </Link>
                  </Button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl xl:shadow-2xl space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                    Contact
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 dark:bg-[#C5A059]/10 flex items-center justify-center group-hover:bg-primary dark:group-hover:bg-[#C5A059] transition-colors duration-500 shrink-0">
                        <Mail className="h-5 w-5 text-primary dark:text-[#C5A059] group-hover:text-white transition-colors duration-500" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium break-all">
                        {attorney.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 dark:bg-[#C5A059]/10 flex items-center justify-center group-hover:bg-primary dark:group-hover:bg-[#C5A059] transition-colors duration-500 shrink-0">
                        <Phone className="h-5 w-5 text-primary dark:text-[#C5A059] group-hover:text-white transition-colors duration-500" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        (212) 555-0198
                      </span>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 dark:bg-[#C5A059]/10 flex items-center justify-center group-hover:bg-primary dark:group-hover:bg-[#C5A059] transition-colors duration-500 shrink-0">
                        <MapPin className="h-5 w-5 text-primary dark:text-[#C5A059] group-hover:text-white transition-colors duration-500" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        1200 Avenue of the Americas, Suite 450, New York
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="py-20 bg-white dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800">
          <div className="container max-w-7xl mx-auto md:px-4 px-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-12">
              What Our Clients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {attorney.testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all"
                >
                  <Quote className="h-8 w-8 text-primary/10 absolute top-6 right-6 group-hover:text-primary/20 transition-colors" />
                  <div className="flex mb-4 gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-[#C5A059] text-[#C5A059]"
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium italic leading-relaxed flex-1 mb-8">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-black text-slate-900 dark:text-slate-100 text-sm">
                      {t.name}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {t.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary dark:bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_70%,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent" />
          </div>
          <div className="container max-w-7xl mx-auto md:px-4 px-2 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Secure Your Future with Expert Counsel
              </h2>
              <p className="text-blue-100/60 text-lg font-medium max-w-2xl mx-auto">
                Initial consultations are confidential and focused on
                understanding your unique situation and objectives.
              </p>
              <p className="text-blue-100/40 text-sm font-bold">
                Protecting your rights and interests with integrity and
                unparalleled legal expertise since 2005.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  asChild
                  className="bg-white text-primary px-10 py-6 rounded-2xl font-black uppercase tracking-[0.15em] text-sm shadow-2xl hover:!bg-[#C5A059] hover:text-white transition-all hover:scale-[1.02]"
                >
                  <Link href="/booking">
                    Book Consultation
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-white/20 text-white px-10 py-6 rounded-2xl font-black uppercase tracking-[0.15em] text-sm hover:text-white hover:bg-white/10 transition-all bg-transparent"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              <div className="flex justify-center gap-6 pt-4">
                <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Share2 className="h-4 w-4 text-white/70" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Mail className="h-4 w-4 text-white/70" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="py-6 px-8 text-center group">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-primary dark:text-[#C5A059] tracking-tighter"
      >
        {value}
      </motion.p>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
        {label}
      </p>
    </div>
  );
}
