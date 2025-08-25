import Container from "@/components/Container";
import PaymentDropIn from "@/components/PaymentDropIn";
import { getSupabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";

async function getOrder(orderId: string) {
  const db = await getSupabaseAdmin();
  const { data } = await db.from("membership_orders").select("*").eq("id", orderId).maybeSingle();
  return data;
}

export default async function PayOrderPage({ params }: { params: { orderId: string } }) {
  const order = await getOrder(params.orderId);
  if (!order) return notFound();

  return (
    <Container>
      <div className="py-10 max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">Pay Membership</h1>
        <p className="mb-4">Amount due: ${(order.amount_cents/100).toFixed(2)}</p>
        <PaymentDropIn orderId={order.id} amountCents={order.amount_cents} successRedirect="/success"/>
      </div>
    </Container>
  );
}
