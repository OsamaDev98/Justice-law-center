"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { resetAdminPassword } from "@/lib/supabase-data";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resetAdminPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1923] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Elements */}
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
              <ShieldCheck className="h-10 w-10 text-[#C5A059]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-3">Recover Access</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Justice Law Center Administration</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@justicelawcenter.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white h-14 pl-12 rounded-2xl focus:border-[#C5A059] focus:ring-[#C5A059]/20 transition-all font-medium"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0f1923] font-black cursor-pointer rounded-2xl shadow-xl shadow-[#C5A059]/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6 space-y-6"
            >
              <div className="p-6 bg-[#C5A059]/5 rounded-3xl border border-[#C5A059]/10">
                <p className="text-slate-300 font-medium leading-relaxed">
                  We've sent a recovery link to <span className="text-[#C5A059] font-bold">{email}</span>. Please check your inbox.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full h-14 border-white/10 hover:bg-white/5 font-bold rounded-2xl"
              >
                <Link href="/admin/login">Return to Sign In</Link>
              </Button>
            </motion.div>
          )}

          <div className="mt-8 text-center">
            <Link href="/admin/login" className="text-slate-500 hover:text-[#C5A059] text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
