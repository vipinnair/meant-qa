import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, getSupabaseAdmin } from "@/lib/supabase";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !env.adminEmails.includes(user.email!)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = getSupabaseAdmin();
  const upd = await db.from("events").update({
    title: body.title,
    description: body.description,
    venue: body.venue,
    start_at: body.start_at,
    price_member_cents: body.price_member_cents ?? 0,
    price_non_member_cents: body.price_non_member_cents ?? 0,
    capacity: body.capacity || null
  }).eq("slug", body.slug).select("*").single();
  if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 400 });
  return NextResponse.json(upd.data);
}
