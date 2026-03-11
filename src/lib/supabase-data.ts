import { supabase } from './supabase';
import { attorneys as fallbackAttorneys } from '@/data/attorneys';

// ─── Types ───

export interface Attorney {
  id: string;
  slug: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  email: string;
  about: string;
  education: string;
  educationUndergrad: string;
  expertise: string[];
  certifications: string[];
  stats: { casesWon: string; yearsExperience: string; clientRating: string; legalAwards: string };
  philosophy: string;
  testimonials: { quote: string; name: string; role: string }[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  details: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
}

// ─── Attorneys ───

export async function getAttorneys(): Promise<Attorney[]> {
  try {
    const { data: attorneys, error } = await supabase
      .from('attorneys')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !attorneys?.length) {
      console.warn('Supabase attorneys fetch failed, using fallback:', error?.message);
      return fallbackAttorneys.map(mapFallbackAttorney);
    }

    // Fetch all testimonials for all attorneys
    const { data: testimonials } = await supabase
      .from('attorney_testimonials')
      .select('*');

    return attorneys.map(a => ({
      id: a.id,
      slug: a.slug,
      name: a.name,
      role: a.role,
      specialty: a.specialty,
      image: a.image,
      email: a.email,
      about: a.about,
      education: a.education,
      educationUndergrad: a.education_undergrad,
      expertise: a.expertise || [],
      certifications: a.certifications || [],
      stats: a.stats || {},
      philosophy: a.philosophy || '',
      testimonials: (testimonials || [])
        .filter(t => t.attorney_id === a.id)
        .map(t => ({ quote: t.quote, name: t.client_name, role: t.client_role })),
    }));
  } catch {
    console.warn('Supabase connection failed, using fallback attorneys');
    return fallbackAttorneys.map(mapFallbackAttorney);
  }
}

export async function getAttorneyBySlug(slug: string): Promise<Attorney | null> {
  try {
    const { data: attorney, error } = await supabase
      .from('attorneys')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !attorney) {
      const fallback = fallbackAttorneys.find(a => a.slug === slug);
      return fallback ? mapFallbackAttorney(fallback) : null;
    }

    const { data: testimonials } = await supabase
      .from('attorney_testimonials')
      .select('*')
      .eq('attorney_id', attorney.id);

    return {
      id: attorney.slug,
      slug: attorney.slug,
      name: attorney.name,
      role: attorney.role,
      specialty: attorney.specialty,
      image: attorney.image,
      email: attorney.email,
      about: attorney.about,
      education: attorney.education,
      educationUndergrad: attorney.education_undergrad,
      expertise: attorney.expertise || [],
      certifications: attorney.certifications || [],
      stats: attorney.stats || {},
      philosophy: attorney.philosophy || '',
      testimonials: (testimonials || []).map(t => ({
        quote: t.quote,
        name: t.client_name,
        role: t.client_role,
      })),
    };
  } catch {
    const fallback = fallbackAttorneys.find(a => a.slug === slug);
    return fallback ? mapFallbackAttorney(fallback) : null;
  }
}

// ─── Services ───

import {
  Building2,
  Gavel,
  FileText,
  Heart,
  ShieldCheck,
  Users,
  Briefcase,
  Scale,
  Shield,
  Home,
  Clock,
  CalendarCheck2,
  Video
} from "lucide-react";

export const iconMap: Record<string, any> = {
  Building2,
  Gavel,
  FileText,
  Heart,
  ShieldCheck,
  Users,
  Briefcase,
  Scale,
  Shield,
  Home,
  Clock,
  CalendarCheck2,
  Video
};

export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data?.length) {
      console.warn('Supabase services fetch failed, using fallback');
      return [];
    }
    return data;
  } catch {
    return [];
  }
}

// ─── Testimonials ───

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data?.length) {
      console.warn('Supabase testimonials fetch failed');
      return [];
    }
    return data;
  } catch {
    return [];
  }
}

// ─── Form Submissions ───

export async function submitAppointment(data: {
  service: string;
  attorney_id: string;
  date: string;
  time: string;
  first_name: string;
  last_name: string;
  email: string;
  notes?: string;
}) {
  // Look up the attorney's UUID by slug
  const { data: attorney } = await supabase
    .from('attorneys')
    .select('id')
    .eq('slug', data.attorney_id)
    .single();

  const { error } = await supabase
    .from('appointments')
    .insert({
      ...data,
      attorney_id: attorney?.id || null,
    });

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function submitContactForm(data: {
  full_name: string;
  email: string;
  subject?: string;
  message: string;
  practice_area?: string;
}) {
  const { error } = await supabase
    .from('contact_submissions')
    .insert(data);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, attorneys(name)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBookedSlots(attorney_id: string, date: string): Promise<string[]> {
  try {
    // Look up the attorney's UUID by slug because the forms use slug
    const { data: attorney } = await supabase
      .from('attorneys')
      .select('id')
      .eq('slug', attorney_id)
      .single();

    if (!attorney) return [];

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('time')
      .eq('attorney_id', attorney.id)
      .eq('date', date)
      .neq('status', 'cancelled'); // Don't count cancelled appointments

    if (error || !appointments) return ["10:30 AM"];

    const slots = appointments.map(a => a.time);
    slots.push("10:30 AM"); // Always return one mock booked slot for testing purposes
    return Array.from(new Set(slots));
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return [];
  }
}

export async function getContactSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createAttorney(data: {
  name: string;
  role: string;
  specialty: string;
  email: string;
  image: string;
  about: string;
}) {
  const slug = data.name.toLowerCase().replace(/\s+/g, '-');
  const { error } = await supabase
    .from('attorneys')
    .insert({
      ...data,
      slug,
      expertise: [],
      certifications: [],
      stats: { casesWon: "0", yearsExperience: "0", clientRating: "0", legalAwards: "0" },
      philosophy: ""
    });

  if (error) throw error;
  return { success: true };
}

export async function updateAppointmentStatus(id: string, status: string) {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

export async function deleteAppointment(id: string) {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

export async function deleteContactSubmission(id: string) {
  const { error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

export async function updateAttorney(id: string, data: any) {
  const { error } = await supabase
    .from('attorneys')
    .update(data)
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

export async function markAllContactsAsRead() {
  const { error } = await supabase
    .from('contact_submissions')
    .update({ is_read: true })
    .is('is_read', false);

  if (error) throw error;
  return { success: true };
}

export async function resetAdminPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset-password`,
  });
  if (error) throw error;
  return { success: true };
}

export async function updateAdminProfile(data: { username?: string; email?: string }) {
  const { error } = await supabase.auth.updateUser({
    email: data.email,
    data: { username: data.username }
  });
  if (error) throw error;
  return { success: true };
}

export async function changeAdminPassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password: password
  });
  if (error) throw error;
  return { success: true };
}

export async function deleteAttorney(id: string) {
  const { error } = await supabase
    .from('attorneys')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}

export async function updateSiteSettings(id: string, updates: { maintenance_mode?: boolean; email_notifications?: boolean }) {
  const { error } = await supabase
    .from('site_settings')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
  return { success: true };
}

// ─── Helpers ───

function mapFallbackAttorney(a: typeof fallbackAttorneys[0]): Attorney {
  return {
    id: a.id,
    slug: a.slug,
    name: a.name,
    role: a.role,
    specialty: a.specialty,
    image: a.image,
    email: a.email,
    about: a.about,
    education: a.education,
    educationUndergrad: a.educationUndergrad,
    expertise: a.expertise,
    certifications: a.certifications,
    stats: a.stats,
    philosophy: a.philosophy,
    testimonials: a.testimonials,
  };
}
