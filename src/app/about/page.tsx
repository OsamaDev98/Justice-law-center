"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function AboutPage() {
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
              Our History
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
            >
              Excellence Since 1998
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-blue-100/60 text-lg md:text-xl font-medium max-w-2xl mx-auto"
            >
              For over two decades, Justice Law Center has been a pillar of integrity and professional excellence in the legal community.
            </motion.p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 bg-white dark:bg-slate-900 -mt-10 lg:-mt-40 pb-24">
          <div className="container max-w-7xl mx-auto md:px-4 px-6 relative z-10">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-16 shadow-2xl border border-slate-100 dark:border-slate-800 max-w-4xl mx-auto space-y-10 text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              <p>
                Founded on the principles of transparency and unwavering commitment to client success,
                Justice Law Center started as a small firm in downtown New York. Today, we have grown
                into a multi-disciplinary practice with a reputation for winning complex cases.
              </p>

              <div className="relative py-12 px-10 rounded-3xl bg-slate-50 dark:bg-slate-800/50 italic border border-slate-100 dark:border-slate-800">
                <Quote className="absolute top-8 right-8 h-16 w-16 text-primary/5 dark:text-[#C5A059]/10" />
                <p className="text-2xl md:text-3xl text-slate-900 dark:text-slate-50 font-black tracking-tight leading-snug relative text-center">
                  &quot;Our philosophy is simple: we treat every case as if it were our own. No detail is too small,
                  and no challenge is too great when it comes to defending our clients&apos; rights.&quot;
                </p>
                <cite className="mt-8 block not-italic font-black text-xs text-primary dark:text-[#C5A059] uppercase tracking-[0.2em] md:text-right md:mr-4 text-center">— Founders&apos; Statement</cite>
              </div>

              <p>
                Our team consists of distinguished attorneys from the nation&apos;s top law schools, each bringing
                specialized expertise and a shared passion for justice. We bridge the gap between complex
                legal theory and practical, real-world solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-[#f5f7f8] dark:bg-[#0f1923] border-t border-slate-200 dark:border-slate-800">
          <div className="container max-w-7xl mx-auto md:px-4 px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Our Core Values</h2>
              <div className="h-1.5 w-20 bg-[#C5A059] rounded-full mx-auto mt-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Integrity", desc: "We uphold the highest ethical standards, ensuring honesty and transparency in every client interaction." },
                { title: "Commitment", desc: "Our dedication to your success is absolute. We work tirelessly to achieve the best possible outcomes." },
                { title: "Innovation", desc: "We stay ahead of the curve, utilizing modern legal technologies to streamline processes and improve results." }
              ].map((val, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-[#C5A059]/10 text-primary dark:text-[#C5A059] flex items-center justify-center mx-auto mb-6 text-2xl font-black group-hover:bg-primary dark:group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-300">
                    {i + 1}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-4">{val.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
