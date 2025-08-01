// DEPRECATED: Do not use this file for Supabase client. Use lib/supabase/client.ts or lib/supabase/server.ts instead.
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSupabaseSession = () => supabase.auth.getSession();
