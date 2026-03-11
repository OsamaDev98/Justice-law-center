"use client";

import { useState, useEffect } from "react";
import { getAttorneys, deleteAttorney } from "@/lib/supabase-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Mail, ExternalLink, Shield, Trash2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { EditAttorneyModal } from "@/components/admin/EditAttorneyModal";
import { AddAttorneyModal } from "@/components/admin/AddAttorneyModal";
import Image from "next/image";

export default function AttorneysPage() {
  const [attorneys, setAttorneys] = useState<any[]>([]);
  const [filteredAttorneys, setFilteredAttorneys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttorney, setSelectedAttorney] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAttorneys();
      setAttorneys(data || []);
      setFilteredAttorneys(data || []);
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
    const result = attorneys.filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAttorneys(result);
  }, [searchQuery, attorneys]);

  const handleEdit = (attorney: any) => {
    setSelectedAttorney(attorney);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this attorney from the system?")) {
      try {
        await deleteAttorney(id);
        await loadData();
      } catch (err) {
        alert("Failed to delete attorney");
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[50vh] animate-pulse text-[#C5A059]">Loading Team...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search attorneys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 rounded-xl h-12 focus:border-[#C5A059] focus:ring-[#C5A059]/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#C5A059] text-[#0f1923] hover:bg-[#C5A059]/70 cursor-pointer h-12 px-6 rounded-xl font-black shadow-lg shadow-[#C5A059]/20 flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" /> Add Attorney
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAttorneys.map((attorney, i) => (
          <motion.div
            key={attorney.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="py-0 bg-white/5 border-white/5 hover:border-[#C5A059]/30 transition-all duration-500 rounded-3xl overflow-hidden group">
              <div className="h-48 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] to-transparent z-10" />
                <Image
                  src={attorney.image}
                  alt={attorney.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute bottom-4 left-6 z-20">
                  <Badge className="bg-[#C5A059] text-[#0f1923] font-black uppercase tracking-widest text-[10px] px-2">
                    {attorney.specialty}
                  </Badge>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">{attorney.name}</h3>
                  <p className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mt-1 font-inter">{attorney.role}</p>
                </div>

                <div className="space-y-3 font-inter">
                  <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                    <Mail className="h-4 w-4 text-[#C5A059]" />
                    {attorney.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                    <Shield className="h-4 w-4 text-[#C5A059]" />
                    {attorney.stats?.yearsExperience || 0}+ Years Exp.
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(attorney)}
                      className="cursor-pointer text-slate-500 hover:text-white hover:bg-white/5 font-bold flex items-center gap-2 rounded-lg"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(attorney.id)}
                      className="cursor-pointer h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-[#C5A059] bg-[#C5A059]/10 rounded-lg hover:bg-[#C5A059] hover:text-[#0f1923] transition-all" asChild>
                    <a href={`/attorneys/${attorney.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedAttorney && (
        <EditAttorneyModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={loadData}
          attorney={selectedAttorney}
        />
      )}
      <AddAttorneyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
