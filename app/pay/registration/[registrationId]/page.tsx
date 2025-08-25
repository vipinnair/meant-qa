import Container from "@/components/Container";
import PaymentDropIn from "@/components/PaymentDropIn";
import { getSupabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";

async function getRegistration(id: string) {
  const db = getSupabaseAdmin();
  const { data } = await db.from("registrations").select("*, events(*)").eq("id", id).maybeSingle();
  return data;
}

export default async function PayRegistrationPage({ params }: { params: { registrationId: string } }) {
  const reg = await getRegistration(params.registrationId);
  if (!reg) return notFound();

  return (
    <Container>
      <div className="py-10 max-w-xl">
        <h1 className="text-2xl font-semibold mb-2">Pay for {reg.events.title}</h1>
        <p className="mb-4">Amount due: ${(reg.total_due_cents/100).toFixed(2)}</p>
        <PaymentDropIn registrationId={reg.id} amountCents={reg.total_due_cents} successRedirect={`/events/${reg.events.slug}`}/>
      </div>
    </Container>
  );
}
