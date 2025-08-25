import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, registrationId, nonce } = body || {};
  if (!nonce) return NextResponse.json({ ok: false, error: "Missing nonce" }, { status: 400 });

  const db = await getSupabaseAdmin();
  const provider = getPaymentProvider();

  if (orderId) {
    const { data: order } = await db.from("membership_orders").select("*").eq("id", orderId).maybeSingle();
    if (!order) return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });

    const charge = await provider.charge({ nonce, amountCents: order.amount_cents, orderId });
    await db.from("payments").insert({
      provider: provider.name,
      amount_cents: order.amount_cents,
      status: charge.ok ? "succeeded" : "failed",
      txn_id: charge.txnId,
      member_id: order.member_id,
      raw: charge.raw || null
    });

    if (charge.ok) {
      // mark order paid, set membership active + expiry
      await db.from("membership_orders").update({ paid: true, processed_at: new Date().toISOString(), txn_id: charge.txnId }).eq("id", orderId);
      const { data: member } = await db.from("members").select("*").eq("id", order.member_id).maybeSingle();
      if (member) {
        const today = new Date();
        let start = member.expires_on ? new Date(member.expires_on) : today;
        if (start < today) start = today;
        const nextYear = new Date(start);
        nextYear.setFullYear(start.getFullYear() + 1);
        await db.from("members").update({ status: "active", expires_on: nextYear.toISOString().slice(0,10) }).eq("id", member.id);
      }
    }

    return NextResponse.json({ ok: charge.ok, error: charge.error });
  }

  if (registrationId) {
    const { data: reg } = await db.from("registrations").select("*, events(*)").eq("id", registrationId).maybeSingle();
    if (!reg) return NextResponse.json({ ok: false, error: "Registration not found" }, { status: 404 });

    const charge = await provider.charge({ nonce, amountCents: reg.total_due_cents, registrationId });
    await db.from("payments").insert({
      provider: provider.name,
      amount_cents: reg.total_due_cents,
      status: charge.ok ? "succeeded" : "failed",
      txn_id: charge.txnId,
      registration_id: reg.id,
      raw: charge.raw || null
    });

    if (charge.ok) {
      await db.from("registrations").update({ paid: true }).eq("id", reg.id);
    }

    return NextResponse.json({ ok: charge.ok, error: charge.error });
  }

  return NextResponse.json({ ok: false, error: "Nothing to charge" }, { status: 400 });
}
