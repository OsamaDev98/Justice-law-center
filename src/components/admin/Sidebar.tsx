"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Overview", icon: BarChart3, href: "/admin/dashboard" },
  { name: "Appointments", icon: Calendar, href: "/admin/dashboard/appointments" },
  { name: "Attorney Team", icon: Users, href: "/admin/dashboard/attorneys" },
  { name: "Contact Inquiries", icon: MessageSquare, href: "/admin/dashboard/contacts" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "w-72 bg-[#0f1923] border-r border-white/5 flex flex-col h-screen fixed lg:sticky top-0 z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059] flex items-center justify-center shadow-lg shadow-[#C5A059]/10">
              <ShieldCheck className="h-6 w-6 text-[#0f1923]" />
            </div>
            <div>
              <h2 className="text-white font-black tracking-tight leading-none text-lg">Justice Law</h2>
              <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest mt-1">Admin Portal</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // close sidebar on navigate on mobile
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive
                    ? "bg-[#C5A059] text-[#0f1923] shadow-lg shadow-[#C5A059]/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5", isActive ? "text-[#0f1923]" : "text-slate-500 group-hover:text-[#C5A059]")} />
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-white/5">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-[#C5A059] transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Website</span>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2 border-t border-white/5">
          <Link
            href="/admin/dashboard/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all font-bold text-sm"
          >
            <Settings className="h-5 w-5 text-slate-500" />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
