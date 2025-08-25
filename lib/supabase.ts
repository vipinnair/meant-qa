
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { createClient } from "@supabase/supabase-js";

export function getSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    env.supabaseUrl,
    env.supabaseAnonKey,
    { cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options: any) { cookieStore.set({ name, value: "", ...options }); },
      }
    }
  );
}

export async function getSupabaseAdmin() {
  return createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false }
  });
}
