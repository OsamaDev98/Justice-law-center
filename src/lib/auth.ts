import { supabase } from './supabase';

export async function signIn(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/admin/dashboard`,
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function isAdmin() {
  const session = await getSession();
  if (!session) return false;
  
  // For now, let's assume any logged in user in this context is an admin or check metadata
  // In a real app, you'd check a 'profiles' table or user metadata
  return !!session.user;
}
