import { getSupabaseServer } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = getSupabaseServer();
  await supabase.auth.signOut();
  const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return NextResponse.redirect(`${origin}/`);
}
