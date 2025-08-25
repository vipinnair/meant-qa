import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, full_name, email, qty_guests, member } = body || {};
  if (!slug || !full_name || !email) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const db = getSupabaseAdmin();
  const { data: event } = await db.from("events").select("*").eq("slug", slug).maybeSingle();
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  const price = (member ? event.price_member_cents : event.price_non_member_cents) || 0;
  const total = price; // per-person price; customize if you want to charge for guests too

  const ticket_code = uuidv4();
  const ins = await db.from("registrations").insert({
    event_id: event.id,
    full_name,
    email,
    qty_guests: qty_guests || 0,
    total_due_cents: total,
    paid: total === 0,
    ticket_code
  }).select("*").single();
  if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 400 });

  if (total > 0) {
    return NextResponse.json({ pay: true, registrationId: ins.data.id });
  }

  return NextResponse.json({ pay: false, registrationId: ins.data.id, qr: ticket_code });
}
