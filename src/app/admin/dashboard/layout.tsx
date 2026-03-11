"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/admin/login");
      } else {
        setIsAuth(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin/login");
      } else {
        setIsAuth(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Get title from pathname
  const getPageTitle = () => {
    const parts = pathname.split("/");
    const last = parts[parts.length - 1];
    if (last === "dashboard") return "Overview";
    return last.charAt(0).toUpperCase() + last.slice(1);
  };

  if (!isAuth) {
    return <div className="min-h-screen bg-[#0f1923] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0f1923] text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden w-full max-w-[100vw]">
        {/* Header */}
        <header className="h-16 lg:h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-10 bg-[#0f1923]/50 backdrop-blur-xl z-20 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:bg-white/10 rounded-xl"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-black tracking-tight">{getPageTitle()}</h1>
              <p className="hidden md:block text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-[10px] text-[#C5A059] font-black uppercase tracking-tighter">Senior Partner</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#D4AF37] border-2 border-white/10 shadow-lg shrink-0" />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-hide">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="pb-24 lg:pb-0" // Add padding on mobile to account for floating FAB
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
