"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Bell, Lock, User, Save, Globe, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { updateAdminProfile, changeAdminPassword, getSiteSettings, updateSiteSettings } from "@/lib/supabase-data";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Settings states
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setUsername(user.user_metadata?.username || "");
        setEmail(user.email || "");
      }
    }
    async function fetchSettings() {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSettingsId(data.id);
          setMaintenanceMode(data.maintenance_mode);
          setEmailNotifications(data.email_notifications);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    getProfile();
    fetchSettings();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setMessage(null);
      await updateAdminProfile({ username, email });
      setMessage({ type: 'success', text: "Profile updated successfully." });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;
    try {
      setLoading(true);
      setMessage(null);
      await changeAdminPassword(newPassword);
      setNewPassword("");
      setMessage({ type: 'success', text: "Password changed successfully." });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Failed to change password." });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSetting = async (setting: 'maintenance' | 'email') => {
    if (!settingsId) return;

    setSavingSettings(true);
    setMessage(null);
    let updates = {};
    if (setting === 'maintenance') {
      updates = { maintenance_mode: !maintenanceMode };
      setMaintenanceMode(!maintenanceMode);
    } else {
      updates = { email_notifications: !emailNotifications };
      setEmailNotifications(!emailNotifications);
    }

    try {
      await updateSiteSettings(settingsId, updates);
      setMessage({ type: 'success', text: "Settings updated successfully." });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Failed to update settings." });
      // Revert on failure
      if (setting === 'maintenance') setMaintenanceMode(!maintenanceMode);
      else setEmailNotifications(!emailNotifications);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Settings</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your administrative preferences</p>
        </div>
        {message && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold",
              message.type === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
            )}
          >
            {message.text}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/5 border-white/5 p-8 rounded-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C5A059]/5 to-transparent pointer-events-none" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/20">
                <User className="h-6 w-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-black text-white">Admin Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest">Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white font-medium focus:border-[#C5A059] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest">Email Address</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white font-medium focus:border-[#C5A059] transition-colors"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="cursor-pointer bg-[#C5A059] text-[#0f1923] font-black rounded-xl px-8 h-12 hover:bg-[#D4AF37] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Update Profile
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Security Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/5 border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/20">
                <Lock className="h-6 w-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-black text-white">Security & Password</h2>
            </div>

            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#C5A059] transition-colors"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={loading || !newPassword}
                variant="outline"
                className="cursor-pointer border-[#C5A059]/20 hover:text-[#C5A059] hover:bg-[#C5A059]/10 font-bold rounded-xl px-8 h-12 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
                Change Password
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* System Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/5 border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/20">
                <Globe className="h-6 w-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-black text-white">Website Configuration</h2>
            </div>

            <div className="space-y-6">
              <div
                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleToggleSetting('maintenance')}
              >
                <div>
                  <p className="font-bold text-white">Maintenance Mode</p>
                  <p className="text-xs text-slate-500 mt-1">Temporarily disable public access to the website</p>
                </div>
                <div className={cn("w-12 h-6 rounded-full relative transition-colors duration-300", maintenanceMode ? "bg-[#C5A059]" : "bg-slate-800")}>
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full transition-transform duration-300", maintenanceMode ? "right-1 bg-[#0f1923]" : "left-1 bg-slate-600")} />
                </div>
              </div>
              <div
                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleToggleSetting('email')}
              >
                <div>
                  <p className="font-bold text-white">Email Notifications</p>
                  <p className="text-xs text-slate-500 mt-1">Receive email alerts for new booking requests</p>
                </div>
                <div className={cn("w-12 h-6 rounded-full relative transition-colors duration-300", emailNotifications ? "bg-[#C5A059]" : "bg-slate-800")}>
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full transition-transform duration-300", emailNotifications ? "right-1 bg-[#0f1923]" : "left-1 bg-slate-600")} />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
