import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, full_name, email, phone, membership_type, amount_cents } = body || {};
  const db = await getSupabaseAdmin();

  if (type === "join") {
    if (!full_name || !email) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    let { data: member } = await db.from("members").select("*").eq("email", email).maybeSingle();
    if (!member) {
      const ins = await db.from("members").insert({ full_name, email, phone, membership_type: membership_type || "annual" }).select("*").single();
      if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 400 });
      member = ins.data;
    }
    const order = await db.from("membership_orders").insert({
      member_id: member.id,
      type: "join",
      amount_cents: amount_cents ?? 3500
    }).select("*").single();
    if (order.error) return NextResponse.json({ error: order.error.message }, { status: 400 });
    return NextResponse.json({ orderId: order.data.id });
  }

  if (type === "renew") {
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });
    const { data: member } = await db.from("members").select("*").eq("email", email).maybeSingle();
    if (!member) return NextResponse.json({ error: "No member found for this email" }, { status: 404 });

    const price = member.membership_type === "student" ? 1500 : 3500;
    const order = await db.from("membership_orders").insert({
      member_id: member.id,
      type: "renew",
      amount_cents: price
    }).select("*").single();
    if (order.error) return NextResponse.json({ error: order.error.message }, { status: 400 });
    return NextResponse.json({ orderId: order.data.id });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}
