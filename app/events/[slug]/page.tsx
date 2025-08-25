'use client';

import Container from "@/components/Container";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QR from "@/components/QR";

export default function EventDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [form, setForm] = useState({ full_name: "", email: "", qty_guests: 0, member: true });
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/events/get?slug=${params.slug}`).then(r=>r.json()).then(setEvent);
  }, [params.slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const resp = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: params.slug, ...form })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to register");
      if (data.pay) {
        router.push(`/pay/registration/${data.registrationId}`);
      } else {
        setTicket(data);
      }
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <Container><div className="py-10">Loading...</div></Container>;

  return (
    <Container>
      <div className="py-10 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-2">{event.title}</h1>
        <div className="text-gray-600 mb-6">{new Date(event.start_at).toLocaleString()} — {event.venue}</div>
        <p className="mb-6 whitespace-pre-wrap">{event.description}</p>

        {ticket ? (
          <div className="border rounded p-4">
            <div className="font-semibold mb-2">Registration Confirmed</div>
            <div className="text-sm text-gray-600 mb-4">Show this QR at the entrance.</div>
            <QR text={ticket.qr} size={240}/>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <input className="w-full border p-2 rounded" placeholder="Full name" required
                   value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})}/>
            <input className="w-full border p-2 rounded" placeholder="Email" type="email" required
                   value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
            <label className="block">
              <span>Are you a member?</span>
              <select className="w-full border p-2 rounded mt-1" value={String(form.member)}
                      onChange={e=>setForm({...form, member: e.target.value === "true"})}>
                <option value="true">Yes (member pricing)</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="block">
              <span>Guests</span>
              <input className="w-full border p-2 rounded mt-1" type="number" min={0}
                     value={form.qty_guests} onChange={e=>setForm({...form, qty_guests: parseInt(e.target.value || "0")})}/>
            </label>
            <button disabled={loading} className="px-4 py-2 rounded bg-brand-600 text-white">
              {loading ? "Submitting..." : "Register"}
            </button>
            {error && <div className="text-red-600">{error}</div>}
          </form>
        )}
      </div>
    </Container>
  );
}
