import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, getSupabaseAdmin } from "@/lib/supabase";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !env.adminEmails.includes(user.email!)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = getSupabaseAdmin();
  const ins = await db.from("events").insert({
    title: body.title,
    slug: body.slug,
    description: body.description,
    venue: body.venue,
    start_at: body.start_at,
    price_member_cents: body.price_member_cents ?? 0,
    price_non_member_cents: body.price_non_member_cents ?? 0,
    capacity: body.capacity || null
  }).select("*").single();
  if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 400 });
  return NextResponse.json(ins.data);
}
