import { getSupabaseServer } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = getSupabaseServer();
  const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/admin` }
  });
  if (error) return NextResponse.redirect(`${origin}/admin?error=${encodeURIComponent(error.message)}`);
  return NextResponse.redirect(data.url!);
}
