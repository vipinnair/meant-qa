import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ ok: false, error: "Missing code" }, { status: 400 });

  const db = getSupabaseAdmin();
  const { data: reg } = await db.from("registrations").select("*, events(*)").eq("ticket_code", code).maybeSingle();
  if (!reg) return NextResponse.json({ ok: false, error: "Invalid code" }, { status: 404 });

  // Record check-in
  await db.from("checkins").insert({ registration_id: reg.id, scanned_by: "door" });

  return NextResponse.json({ ok: true, full_name: reg.full_name, event: reg.events.title });
}
