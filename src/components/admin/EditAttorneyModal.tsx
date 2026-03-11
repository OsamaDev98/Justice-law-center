"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateAttorney } from "@/lib/supabase-data";
import { Loader2, UserCog } from "lucide-react";

interface EditAttorneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  attorney: any;
}

export function EditAttorneyModal({ isOpen, onClose, onSuccess, attorney }: EditAttorneyModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: attorney?.name || "",
    role: attorney?.role || "",
    specialty: attorney?.specialty || "",
    email: attorney?.email || "",
    image: attorney?.image || "",
    about: attorney?.about || ""
  });

  useEffect(() => {
    if (attorney) {
      setFormData({
        name: attorney.name,
        role: attorney.role,
        specialty: attorney.specialty,
        email: attorney.email,
        image: attorney.image,
        about: attorney.about
      });
    }
  }, [attorney]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAttorney(attorney.id, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error updating attorney:", err);
      alert("Failed to update attorney: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0f1923] border-white/10 text-white rounded-3xl overflow-hidden p-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/10 to-transparent pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="relative">
          <DialogHeader className="p-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/20">
                <UserCog className="h-6 w-6 text-[#C5A059]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight">Edit Attorney Profile</DialogTitle>
                <DialogDescription className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1 font-inter">
                  Managing {attorney?.name}'s information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-300">Full Name</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-300">Professional Role</Label>
                <Input 
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-300">Specialty</Label>
                <Input 
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-300">Email Address</Label>
                <Input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-300">Profile Image URL</Label>
              <Input 
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-300">Professional Biography</Label>
              <Textarea 
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 min-h-[120px] focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl resize-none"
              />
            </div>
          </div>

          <DialogFooter className="p-8 border-t border-white/5 bg-white/5 flex gap-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="px-8 h-12 text-slate-400 hover:text-white hover:bg-white/5 font-bold rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-10 h-12 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0f1923] font-black rounded-xl shadow-xl shadow-[#C5A059]/20 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
