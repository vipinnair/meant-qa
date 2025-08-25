'use client';

import Container from "@/components/Container";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    venue: "",
    start_at: "",
    price_member_cents: 0,
    price_non_member_cents: 0,
    capacity: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/events/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push("/admin/events");
    } catch (e: any) { setError(e.message || "Error"); }
    finally { setLoading(false); }
  };

  return (
    <Container>
      <div className="py-10 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">New Event</h1>
        <form className="space-y-3" onSubmit={submit}>
          <input className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required/>
          <input className="w-full border p-2 rounded" placeholder="Slug" value={form.slug} onChange={e=>setForm({...form, slug:e.target.value})} required/>
          <textarea className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
          <input className="w-full border p-2 rounded" placeholder="Venue" value={form.venue} onChange={e=>setForm({...form, venue:e.target.value})} required/>
          <input className="w-full border p-2 rounded" type="datetime-local" value={form.start_at} onChange={e=>setForm({...form, start_at:e.target.value})} required/>
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full border p-2 rounded" type="number" placeholder="Member price (cents)" value={form.price_member_cents} onChange={e=>setForm({...form, price_member_cents: parseInt(e.target.value || "0")})}/>
            <input className="w-full border p-2 rounded" type="number" placeholder="Non-member price (cents)" value={form.price_non_member_cents} onChange={e=>setForm({...form, price_non_member_cents: parseInt(e.target.value || "0")})}/>
          </div>
          <input className="w-full border p-2 rounded" type="number" placeholder="Capacity" value={form.capacity} onChange={e=>setForm({...form, capacity: parseInt(e.target.value || "0")})}/>
          <button disabled={loading} className="px-4 py-2 rounded bg-brand-600 text-white">{loading ? "Creating..." : "Create Event"}</button>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </Container>
  );
}
