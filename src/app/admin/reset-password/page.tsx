"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1923] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C5A059]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C5A059]/5 blur-[120px] rounded-full" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/5 border-white/10 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-50" />
          
          <div className="mb-10 text-center">
            <div className="w-20 h-20 bg-[#C5A059]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#C5A059]/20 shadow-xl shadow-[#C5A059]/5">
              <Lock className="h-10 w-10 text-[#C5A059]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-3">Set New Password</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Secure Your Administration Access</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-xl text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white h-14 pl-12 rounded-2xl focus:border-[#C5A059] focus:ring-[#C5A059]/20 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white h-14 pl-12 rounded-2xl focus:border-[#C5A059] focus:ring-[#C5A059]/20 transition-all"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0f1923] font-black rounded-2xl shadow-xl shadow-[#C5A059]/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Update Password"}
              </Button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6 space-y-6"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-slate-300 font-medium leading-relaxed font-inter">
                  Your password has been updated successfully. Redirecting you to login...
                </p>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
