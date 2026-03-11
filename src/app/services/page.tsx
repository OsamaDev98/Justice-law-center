"use client";

import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Gavel, FileText, Heart, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import Link from "next/link";

import { useState, useEffect } from "react";
import { getServices, type Service, iconMap } from "@/lib/supabase-data";

const defaultServices = [
  {
    title: 'Corporate Law',
    description: 'Expert guidance for business formations, contracts, mergers, acquisitions, and regulatory compliance across various industries.',
    icon_name: 'Building2',
    details: ['Entity Formation', 'M&A Advisory', 'Strategic Governance', 'Contract Negotiation']
  },
  {
    title: 'Criminal Defense',
    description: 'Vigorous and ethical representation protecting your constitutional rights and freedom in local and federal criminal matters.',
    icon_name: 'Gavel',
    details: ['DUI/DWI Defense', 'White Collar Crime', 'Drug Offenses', 'Appeals']
  },
  {
    title: 'Civil Litigation',
    description: 'Experienced advocates for resolving complex disputes in court or through alternative dispute resolution and mediation.',
    icon_name: 'FileText',
    details: ['Business Disputes', 'Breach of Contract', 'Torts & Liability', 'Real Estate Litigation']
  },
  {
    title: 'Family Law',
    description: 'Compassionate legal support for sensitive matters including divorce, child custody, adoption, and pre-nuptial agreements.',
    icon_name: 'Heart',
    details: ['Divorce', 'Child Custody', 'Estate Planning', 'Domestic Partnerships']
  },
  {
    title: 'Real Estate Law',
    description: 'Expert handling of property transactions, zoning, lease agreements, and real estate litigation.',
    icon_name: 'Building2',
    details: ['Property Transactions', 'Zoning', 'Lease Agreements', 'Real Estate Litigation']
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices as Service[]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    getServices().then(data => {
      if (data.length) setServices(data);
    }).catch(console.error);
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
              Excellence & Precision
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
            >
              Our Practice Areas
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-blue-100/60 text-lg md:text-xl font-medium max-w-2xl mx-auto"
            >
              We provide comprehensive legal solutions tailored to meet the unique needs of our clients, ensuring excellence in every case.
            </motion.p>
          </div>
        </section>

        {/* Services Grid */}
        <div className="container max-w-7xl mx-auto md:px-4 px-6 relative z-20 -mt-10 lg:-mt-16 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon_name] || Building2;
              const details = Array.isArray(service.details) ? service.details : (typeof service.details === 'string' ? JSON.parse(service.details) : []);

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div 
                    data-testid="service-item" 
                    onClick={() => setSelectedService(service)}
                    className="block h-full cursor-pointer"
                  >
                    <Card className="h-full border-none shadow-xl xl:shadow-2xl overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 transition-all group py-0 relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="flex flex-col md:flex-row h-full">
                        <div className="md:w-1/3 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 transition-colors">
                          <div className="h-20 w-20 rounded-2xl bg-primary/10 dark:bg-[#C5A059]/10 flex items-center justify-center mb-4 group-hover:bg-primary dark:group-hover:bg-[#C5A059] transition-colors duration-500">
                            <Icon className="h-10 w-10 text-primary dark:text-[#C5A059] group-hover:text-white transition-colors duration-500" />
                          </div>
                        </div>
                        <div className="md:w-2/3 p-8 lg:p-10 relative z-10">
                          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-3 group-hover:text-primary dark:group-hover:text-[#C5A059] transition-colors">{service.title}</h2>
                          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">{service.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2 mb-6">
                            {details.map((detail: string) => (
                              <div key={detail} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                <div className="h-2 w-2 rounded-full bg-primary/40 dark:bg-[#C5A059]" />
                                {detail}
                              </div>
                            ))}
                          </div>
                          <div className="mt-auto pt-4 flex items-center text-primary dark:text-[#C5A059] font-bold text-sm tracking-widest uppercase group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            View Details <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Service Details Modal */}
        {selectedService && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              data-testid="service-details"
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 h-10 w-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-20"
              >
                ✕
              </button>
              
              <div className="p-8 md:p-12">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 dark:bg-[#C5A059]/10 flex items-center justify-center mb-6">
                  {(() => {
                    const Icon = iconMap[selectedService.icon_name] || Building2;
                    return <Icon className="h-8 w-8 text-primary dark:text-[#C5A059]" />;
                  })()}
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-2">Practice Area Details</p>
                <h2 data-testid="service-title" className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-50 mb-6 tracking-tight">
                  {selectedService.title}
                </h2>
                
                <div data-testid="service-description" className="space-y-6">
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    {selectedService.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {(Array.isArray(selectedService.details) ? selectedService.details : (typeof selectedService.details === 'string' ? JSON.parse(selectedService.details) : [])).map((detail: string) => (
                      <div key={detail} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-800 dark:text-slate-200">
                        <div className="h-2 w-2 rounded-full bg-primary dark:bg-[#C5A059]" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <Link 
                    href="/booking" 
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary dark:bg-[#C5A059] text-white font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20 dark:shadow-[#C5A059]/20"
                  >
                    Book Consultation <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
