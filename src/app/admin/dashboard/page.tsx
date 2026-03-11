"use client";

import { useState, useEffect } from "react";
import {
  getAppointments,
  getContactSubmissions,
  getAttorneys
} from "@/lib/supabase-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MessageSquare, TrendingUp, Search, Filter, Download, MoreVertical, Trash2, CheckCircle, ExternalLink, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AddAttorneyModal } from "@/components/admin/AddAttorneyModal";

export default function DashboardOverview() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [attorneysCount, setAttorneysCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [appts, conts, atts] = await Promise.all([
        getAppointments(),
        getContactSubmissions(),
        getAttorneys()
      ]);
      setAppointments(appts || []);
      setContacts(conts || []);
      setAttorneysCount(atts.length);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    { name: "Total Bookings", value: appointments.length, icon: Calendar, color: "bg-blue-500/10 text-blue-500" },
    { name: "Contact Requests", value: contacts.length, icon: MessageSquare, color: "bg-[#C5A059]/10 text-[#C5A059]" },
    { name: "Active Attorneys", value: attorneysCount, icon: Users, color: "bg-green-500/10 text-green-500" },
    { name: "Pending Review", value: appointments.filter(a => a.status === 'pending').length, icon: Clock, color: "bg-orange-500/10 text-orange-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="py-5 cursor-pointer border-white/10 text-slate-800 hover:text-white hover:bg-white/5 font-bold flex items-center gap-2 rounded-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? "animate-spin" : ""}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          Refresh Data
        </Button>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 bg-white/5 border-white/5 hover:border-[#C5A059]/30 transition-all duration-300 rounded-2xl group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.name}</p>
                  <h3 className="text-3xl font-black mt-2 text-white">{stat.value}</h3>
                </div>
                <div className={stat.color + " p-4 rounded-xl shadow-lg"}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Appointments */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-tight">
              Recent Appointments
            </h2>
            <Button variant="ghost" size="sm" className="text-[#C5A059] hover:bg-[#C5A059]/10 font-bold rounded-xl" asChild>
              <Link href="/admin/dashboard/appointments">View All</Link>
            </Button>
          </div>

          <Card className="bg-white/5 border-white/5 rounded-2xl overflow-hidden shadow-2xl py-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Client</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Service</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {appointments.slice(0, 5).map((appt) => (
                    <tr key={appt.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5">
                        <p className="font-bold text-white tracking-tight">{appt.first_name} {appt.last_name}</p>
                        <p className="text-xs text-slate-500 mt-1">{appt.date} • {appt.time}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-300">{appt.service}</p>
                        <p className="text-[10px] text-[#C5A059] font-bold uppercase mt-1">{appt.attorneys?.name}</p>
                      </td>
                      <td className="px-6 py-5">
                        <Badge className={cn(
                          "rounded-lg px-2 px-1 text-[10px] font-black uppercase tracking-tighter",
                          appt.status === 'pending' ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                            "bg-green-500/10 text-green-400 border border-green-500/20"
                        )}>
                          {appt.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 group-hover:text-white group-hover:bg-[#C5A059]/10 rounded-lg" asChild>
                          <Link href={`/admin/dashboard/appointments?id=${appt.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-medium">No recent bookings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Contact Requests */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black flex items-center gap-3 tracking-tight">
              <MessageSquare className="h-6 w-6 text-[#C5A059]" />
              New Contact Requests
            </h2>
            <Button variant="ghost" size="sm" className="text-[#C5A059] hover:bg-[#C5A059]/10 font-bold rounded-xl" asChild>
              <Link href="/admin/dashboard/contacts">View All</Link>
            </Button>
          </div>

          <Card className="bg-white/5 border-white/5 rounded-2xl overflow-hidden shadow-2xl py-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Inquiry</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Area</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contacts.slice(0, 5).map((contact) => (
                    <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5">
                        <p className="font-bold text-white tracking-tight">{contact.full_name}</p>
                        <p className="text-xs text-slate-500 mt-1 truncate max-w-xs">{contact.message}</p>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                          {contact.practice_area || "General"}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 group-hover:text-white group-hover:bg-[#C5A059]/10 rounded-lg" asChild>
                          <Link href={`/admin/dashboard/contacts?id=${contact.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-slate-500 font-medium">No contact inquiries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </div>

      {/* Floating Action Button for Add Attorney */}
      <div className="fixed bottom-10 right-10">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer h-16 w-16 rounded-2xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#0f1923] shadow-2xl shadow-[#C5A059]/30 transition-all hover:scale-110 active:scale-95 group"
        >
          <Plus className="h-8 w-8 scale-150 group-hover:rotate-90 transition-transform duration-500" />
        </Button>
      </div>

      <AddAttorneyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
