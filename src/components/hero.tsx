import { Button } from "@/components/ui/button";
import { Copyleft, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#f5f7f8] dark:bg-[#0f1923] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-[80%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#C5A059]/10 via-transparent to-transparent opacity-60 mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="container max-w-7xl mx-auto relative z-10 px-6 lg:px-4 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8 max-w-2xl"
          >
            <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full w-fit shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C5A059]"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Accepting New Clients</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-[1.1]">
              Unwavering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#C5A059]">Advocacy</span> & <br />
              Results.
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-lg">
              We provide elite legal representation for complex matters. When everything is on the line, you need a team that refuses to lose.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="bg-primary dark:bg-[#C5A059] text-white hover:bg-primary/90 dark:hover:bg-[#C5A059]/90 h-14 px-8 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all group">
                <Link href="/booking">
                  Get a Free Evaluation
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-14 px-8 rounded-xl font-bold text-sm border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary dark:hover:border-[#C5A059] dark:hover:text-[#C5A059] hover:bg-transparent transition-all group">
                <Link href="/services">
                  <PlayCircle className="h-5 w-5 mr-2 text-slate-400 group-hover:text-primary dark:group-hover:text-[#C5A059] transition-colors" />
                  How We Work
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Image/Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative lg:h-[600px] w-full flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl xl:shadow-3xl ring-8 ring-white dark:ring-slate-900 z-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay z-10" />
              <Image
                src="/images/hero/hero_attorney.png"
                alt="Attorney looking over case files"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
              />
            </div>

            {/* Decorative Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-8 -left-8 md:bottom-10 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 max-w-[240px] backdrop-blur-md bg-white/90 dark:bg-slate-800/90"
            >
              <div className="flex gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center shrink-0">
                  <Copyleft className="h-6 w-6 text-[#C5A059]" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-50">98%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Success Rate</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Consistently delivering favorable verdicts and settlements for our clients.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
