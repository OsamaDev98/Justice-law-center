"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAttorneys, type Attorney } from "@/lib/supabase-data";
import { attorneys as fallbackAttorneys } from "@/data/attorneys";
import { Footer } from "@/components/footer";
import Image from "next/image";

export default function AttorneysPage() {
  const router = useRouter();
  const [attorneys, setAttorneys] = useState<Attorney[]>(fallbackAttorneys.map(a => ({ ...a, educationUndergrad: a.educationUndergrad })));

  useEffect(() => {
    getAttorneys().then(setAttorneys).catch(console.error);
  }, []);
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
              Elite Representation
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
            >
              Our Legal Experts
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-blue-100/60 text-lg md:text-xl font-medium max-w-2xl mx-auto"
            >
              Meet our team of highly experienced attorneys dedicated to providing professional and personalized legal services.
            </motion.p>
          </div>
        </section>
        <div className="container max-w-7xl mx-auto md:px-4 px-6 relative z-20 -mt-10 lg:-mt-16 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {attorneys.map((attorney, index) => (
              <motion.div
                key={attorney.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  onClick={() => router.push(`/attorneys/${attorney.slug}`)}
                  className="h-full border border-slate-100 dark:border-slate-800 shadow-xl xl:shadow-2xl rounded-[2rem] bg-white dark:bg-slate-900 group overflow-hidden pt-0 transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  <div className="h-64 w-full overflow-hidden bg-slate-200 relative">
                    <Image
                      src={attorney.image}
                      alt={attorney.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-center gap-3 w-full">
                        <Button 
                          onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:info@justicelawcenter.com?subject=Consultation with ${attorney.name}`; }}
                          variant="ghost" size="icon" className="rounded-full h-10 w-10 border border-white/30 text-white bg-white/20 backdrop-blur-md hover:bg-white hover:text-slate-900 transition-all">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                              navigator.share({ title: attorney.name, url: `${window.location.origin}/attorneys/${attorney.slug}` }).catch(console.error);
                            } else {
                              navigator.clipboard.writeText(`${window.location.origin}/attorneys/${attorney.slug}`);
                              alert("Profile link copied!");
                            }
                          }}
                          variant="ghost" size="icon" className="rounded-full h-10 w-10 border border-white/30 text-white bg-white/20 backdrop-blur-md hover:bg-white hover:text-slate-900 transition-all">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="text-center pt-8 px-6">
                    <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-50">{attorney.name}</CardTitle>
                    <CardDescription className="text-sm font-bold text-[#C5A059] tracking-widest uppercase mt-2">{attorney.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-8 px-6 flex flex-col justify-between flex-grow">
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8 line-clamp-2 leading-relaxed">
                      {attorney.about}
                    </p>
                    <Button variant="outline" className="w-full border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all py-6 rounded-2xl font-black uppercase tracking-widest text-xs" asChild>
                      <Link onClick={(e) => e.stopPropagation()} href={`/attorneys/${attorney.slug}`}>View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
