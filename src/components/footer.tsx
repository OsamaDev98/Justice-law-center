"use client";

import { Scale, Mail, Phone, Clock, MapPin, Globe, Users } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-6 lg:px-4 bg-[#0f1923] text-slate-400 py-16 border-t border-slate-800">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 text-white group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#C5A059]/10 group-hover:bg-[#C5A059] transition-colors duration-500 shrink-0">
                <Scale className="h-5 w-5 text-[#C5A059] group-hover:text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight transition-colors">Justice Law Center</h2>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 font-medium pe-4">
              Dedicated to providing world-class legal representation with a focus on integrity, transparency, and results. Your future is our priority.
            </p>
            <div className="flex gap-4">
              <Link href="/" className="h-10 w-10 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-white text-slate-400 transition-all duration-300">
                <Globe className="h-4 w-4" />
              </Link>
              <Link href="/attorneys" className="h-10 w-10 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-white text-slate-400 transition-all duration-300">
                <Users className="h-4 w-4" />
              </Link>
              <Link href="mailto:info@justicelawcenter.com" className="h-10 w-10 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-white text-slate-400 transition-all duration-300">
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:ml-auto">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/about" className="hover:text-[#C5A059] transition-colors flex items-center gap-2 group">About the Firm</Link></li>
              <li><Link href="/booking" className="hover:text-[#C5A059] transition-colors flex items-center gap-2 group">Book Consultation</Link></li>
              <li><Link href="/attorneys" className="hover:text-[#C5A059] transition-colors flex items-center gap-2 group">Lawyers Profile</Link></li>
              <li><Link href="/services" className="hover:text-[#C5A059] transition-colors flex items-center gap-2 group">Practice Areas</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:ml-auto">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-[#C5A059] transition-colors flex items-center gap-2 group">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-[#C5A059] transition-colors flex items-center gap-2 group">Terms of Service</Link></li>
              <li><Link href="/" className="hover:text-[#C5A059] transition-colors flex items-center gap-2 group">Cookie Policy</Link></li>
              <li><Link href="/" className="hover:text-[#C5A059] transition-colors flex items-center gap-2 group">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:ml-auto">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Contact Us</h4>
            <div className="flex flex-col gap-5 text-sm font-medium">
              <div className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-800 group-hover:text-white group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-all shrink-0">
                  <MapPin className="h-4 w-4 text-[#C5A059] group-hover:text-white transition-colors" />
                </div>
                <span className="mt-1 leading-relaxed">123 Justice Way, Suite 500<br />New York 10001</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-800 group-hover:text-white group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-all shrink-0">
                  <Phone className="h-4 w-4 text-[#C5A059] group-hover:text-white transition-colors" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-800 group-hover:text-white group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-all shrink-0">
                  <Clock className="h-4 w-4 text-[#C5A059] group-hover:text-white transition-colors" />
                </div>
                <span>Mon-Fri: 8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Bottom */}
        <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <div className="h-8 border-l border-[#C5A059] hidden md:block" />
            <div className="text-center md:text-left text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center">
              Professional legal services since 1995.
            </div>
          </div>
          <div className="text-center md:text-right text-xs font-medium text-slate-600">
            © {new Date().getFullYear()} Justice Law Center. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
