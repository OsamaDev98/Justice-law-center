"use client";

import { useState, useEffect, Suspense } from "react";
import { getContactSubmissions, deleteContactSubmission, markAllContactsAsRead } from "@/lib/supabase-data";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, Trash2, Mail, Download, CheckCircle, Reply } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function ContactsContent() {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get("id");
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getContactSubmissions();
      setContacts(data || []);
      setFilteredContacts(data || []);
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
    const result = contacts.filter(contact =>
      contact.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.practice_area || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(result);
  }, [searchQuery, contacts]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteContactSubmission(id);
        await loadData();
      } catch (err) {
        alert("Failed to delete inquiry");
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllContactsAsRead();
      await loadData();
    } catch (err) {
      alert("Failed to mark inquiries as read.");
    }
  };

  const handleExport = () => {
    const headers = ["Date", "Name", "Email", "Practice Area", "Message"];
    const rows = filteredContacts.map(c => [
      new Date(c.created_at).toLocaleDateString(),
      c.full_name,
      c.email,
      c.practice_area || "General",
      c.message.replace(/,/g, " ")
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `contacts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[50vh] animate-pulse text-[#C5A059]">Loading Inquiries...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 rounded-xl h-12 focus:border-[#C5A059] focus:ring-[#C5A059]/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            className="bg-[#C5A059] text-[#0f1923] hover:bg-[#C5A059]/70 cursor-pointer h-12 px-6 rounded-xl font-black shadow-lg shadow-[#C5A059]/20 flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="border-white/10 text-[#0f1923] cursor-pointer h-12 px-6 rounded-xl font-bold flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" /> Mark All as Read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredContacts.map((contact, i) => (
            <motion.div
              key={contact.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className={cn(
                "p-8 bg-white/5 border-white/5 hover:border-[#C5A059]/20 transition-all duration-300 rounded-3xl group relative overflow-hidden text-left",
                highlightedId === contact.id && "ring-2 ring-[#C5A059] bg-[#C5A059]/5"
              )}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C5A059]/5 to-transparent pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex gap-6">
                    <div className="mt-1">
                      <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/20">
                        <MessageSquare className="h-6 w-6 text-[#C5A059]" />
                      </div>
                    </div>
                    <div className="space-y-3 font-inter">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-black text-white tracking-tight">{contact.full_name}</h3>
                        {!contact.is_read && (
                          <Badge className="bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest px-2 animate-pulse">
                            New
                          </Badge>
                        )}
                        <Badge variant="outline" className="border-[#C5A059]/20 text-[#C5A059] font-black text-[10px] uppercase tracking-widest px-2">
                          {contact.practice_area || "General Inquiry"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-left flex-wrap">
                        <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {contact.email}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed max-w-3xl font-medium text-left">
                        {contact.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center md:flex-col gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-10 shrink-1 border-white/10 hover:bg-[#C5A059] hover:text-[#0f1923] font-bold rounded-lg transition-all text-xs"
                      asChild
                    >
                      <a href={`mailto:${contact.email}?subject=Justice Law Center Inquiry Response`}>
                        <Reply className="h-3.5 w-3.5 mr-2" /> Reply
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(contact.id)}
                      className="h-10 w-10 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredContacts.length === 0 && (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
            <MessageSquare className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-medium italic">No messages in your inbox.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[50vh] animate-pulse text-[#C5A059]">Loading Inquiries...</div>}>
      <ContactsContent />
    </Suspense>
  );
}
