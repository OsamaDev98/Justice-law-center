"use client";

import { useState, useEffect, Suspense } from "react";
import { getAppointments, updateAppointmentStatus, deleteAppointment } from "@/lib/supabase-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Search, MoreVertical, Download, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get("id");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data || []);
      setFilteredAppointments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = appointments;
    if (searchQuery) {
      result = result.filter(appt =>
        `${appt.first_name} ${appt.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.service.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      result = result.filter(appt => appt.status === statusFilter);
    }
    setFilteredAppointments(result);
  }, [searchQuery, statusFilter, appointments]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      await loadData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(id);
        await loadData();
      } catch (err) {
        alert("Failed to delete appointment");
      }
    }
  };

  const handleExport = () => {
    const headers = ["Date", "Time", "Client", "Email", "Service", "Attorney", "Status"];
    const rows = filteredAppointments.map(appt => [
      appt.date,
      appt.time,
      `${appt.first_name} ${appt.last_name}`,
      appt.email,
      appt.service,
      appt.attorneys?.name || "Unassigned",
      appt.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `appointments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[50vh] animate-pulse text-[#C5A059]">Loading Appointments...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 rounded-xl h-12 focus:border-[#C5A059] focus:ring-[#C5A059]/20"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer border-white/10 h-12 px-6 rounded-xl text-[#0f1923] hover:text-white hover:bg-white/5 font-bold flex items-center gap-2">
                <Filter className="h-4 w-4" /> {statusFilter === 'all' ? 'All Status' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0f1923] border-white/10 text-white min-w-[150px]">
              <DropdownMenuItem onClick={() => setStatusFilter("all")} className="hover:bg-white/10 cursor-pointer">All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")} className="hover:bg-white/10 cursor-pointer">Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("confirmed")} className="hover:bg-white/10 cursor-pointer">Confirmed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")} className="hover:bg-white/10 cursor-pointer">Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            className="bg-[#C5A059] text-[#0f1923] hover:bg-[#C5A059]/70 cursor-pointer h-12 px-6 rounded-xl font-black shadow-lg shadow-[#C5A059]/20 flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="bg-white/5 border-white/5 rounded-3xl overflow-hidden shadow-2xl py-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/10">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Date & Time</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Client Name</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Legal Service</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Attorney</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAppointments.map((appt) => (
                <tr
                  key={appt.id}
                  className={cn(
                    "hover:bg-white/5 transition-colors group",
                    highlightedId === appt.id && "bg-[#C5A059]/10 border-l-2 border-[#C5A059]"
                  )}
                >
                  <td className="px-8 py-6 whitespace-nowrap">
                    <p className="font-black text-white">{appt.date}</p>
                    <p className="text-xs text-[#C5A059] font-bold mt-1 uppercase tracking-tighter">{appt.time}</p>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <p className="font-bold text-white tracking-tight">{appt.first_name} {appt.last_name}</p>
                    <p className="text-xs text-slate-500 mt-1">{appt.email}</p>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-300 font-bold px-3 py-1 rounded-lg">
                      {appt.service}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[10px] font-black text-[#C5A059] shrink-0">
                        {appt.attorneys?.name?.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-300">{appt.attorneys?.name || "Unassigned"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${appt.status === 'pending' ? 'bg-orange-500 animate-pulse' : appt.status === 'confirmed' ? 'bg-blue-500' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${appt.status === 'pending' ? 'text-orange-400' : appt.status === 'confirmed' ? 'text-blue-400' : 'text-green-400'}`}>
                        {appt.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer text-slate-500 hover:text-white hover:bg-white/10 rounded-xl">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0f1923] border-white/10 text-white min-w-[180px]">
                        <DropdownMenuItem onClick={() => handleStatusUpdate(appt.id, 'confirmed')} className="hover:bg-white/10 cursor-pointer flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-blue-400" /> Confirm Booking
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(appt.id, 'completed')} className="hover:bg-white/10 cursor-pointer flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" /> Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(appt.id, 'pending')} className="hover:bg-white/10 cursor-pointer flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-400" /> Revert to Pending
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem onClick={() => handleDelete(appt.id)} className="hover:bg-red-500/20 text-red-400 cursor-pointer flex items-center gap-2">
                          <Trash2 className="h-4 w-4" /> Delete Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-500 font-medium italic">No appointments found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[50vh] animate-pulse text-[#C5A059]">Loading Calendar...</div>}>
      <AppointmentsContent />
    </Suspense>
  );
}
