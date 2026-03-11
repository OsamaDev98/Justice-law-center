"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2 } from "lucide-react";
import { signInWithPassword } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithPassword(email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1923] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl -mr-48 -mt-48 transition-all duration-1000" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#003366]/20 rounded-full blur-3xl -ml-48 -mb-48" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C5A059] flex items-center justify-center shadow-xl shadow-[#C5A059]/20">
              <ShieldCheck className="h-10 w-10 text-[#0f1923]" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Justice Law Center</h1>
          <p className="text-slate-400 font-medium">Attorney Dashboard Access</p>
        </div>

        <Card className="p-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent pointer-events-none" />
          
          <form onSubmit={handleLogin} className="space-y-6 relative">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-300">Email Address</Label>
              <Input
                type="email"
                placeholder="attorney@justicelawcenter.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 focus:border-[#C5A059] focus:ring-[#C5A059]/20 transition-all rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-bold text-slate-300">Password</Label>
                <Link href="/admin/forgot-password" title="Recover access to your account" className="text-xs font-bold text-[#C5A059] hover:text-[#C5A059]/80 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 focus:border-[#C5A059] focus:ring-[#C5A059]/20 transition-all rounded-xl"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0f1923] font-black text-lg rounded-xl shadow-xl shadow-[#C5A059]/20 transition-all group active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-slate-500 text-sm font-medium">
          Authorized Personnel Only. <br />
          Justice Law Center &copy; 2026
        </p>
      </motion.div>
    </div>
  );
}
