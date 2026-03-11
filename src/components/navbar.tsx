"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-slate-200 dark:border-slate-800/50 bg-white/80 backdrop-blur-xl dark:bg-[#0f1923]/90 px-6 lg:px-4 shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="container mx-auto flex h-24 max-w-7xl items-center justify-between gap-3 relative">
        <Link href="/" className="flex items-center gap-4 text-primary dark:text-white group relative z-50">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 dark:bg-[#C5A059]/10 group-hover:bg-primary dark:group-hover:bg-[#C5A059] transition-all duration-500 overflow-hidden">
            <Scale className="h-6 w-6 text-primary dark:text-[#C5A059] group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-lg font-black leading-tight tracking-tighter text-slate-900 dark:text-white uppercase transition-colors">Justice Law Center</h2>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-black transition-colors delay-100">Excellence in Jurisprudence</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-end gap-10 items-center">
          <nav className="flex items-center space-x-8">
            {['Services', 'Lawyers', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                id={`nav-${item.toLowerCase()}`}
                href={item === 'Lawyers' ? '/attorneys' : `/${item.toLowerCase()}`}
                data-testid={`nav-link-${item.toLowerCase()}`}
                className="relative text-[13px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white py-2 group transition-colors"
              >
                {item}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#C5A059] scale-x-0 group-hover:scale-100 transition-transform origin-left duration-300 rounded-full" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center border-l pl-10 border-slate-200 dark:border-slate-800">
            <Button className="bg-primary dark:bg-[#C5A059] hover:bg-primary/90 dark:hover:bg-[#C5A059]/90 text-white px-8 py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02]" asChild>
              <Link href="/booking">Free Consultation</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden relative z-50 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col bg-white/95 dark:bg-[#0f1923]/95 backdrop-blur-3xl lg:hidden pt-32 px-8 pb-10 h-screen overflow-y-auto w-full border-l border-slate-100 dark:border-slate-800"
          >
            <nav className="flex flex-col gap-8 flex-1">
              {['Services', 'Lawyers', 'About', 'Contact'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                >
                  <Link
                    id={`mobile-nav-${item.toLowerCase()}`}
                    href={item === 'Lawyers' ? '/attorneys' : `/${item.toLowerCase()}`}
                    data-testid={`mobile-nav-link-${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white group"
                  >
                    <span className="group-hover:text-[#C5A059] transition-colors duration-300">{item}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto space-y-6 pt-10"
            >
              <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />
              <Button className="w-full bg-primary dark:bg-[#C5A059] text-white py-8 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 group hover:scale-[1.02] transition-transform" onClick={() => setIsOpen(false)} asChild>
                <Link href="/booking">Book Consultation</Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
