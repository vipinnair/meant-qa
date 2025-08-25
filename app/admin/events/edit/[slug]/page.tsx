'use client';

import Container from "@/components/Container";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/events/get?slug=${params.slug}`).then(r=>r.json()).then(setForm);
  }, [params.slug]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const res = await fetch("/api/events/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed"); return; }
    router.push("/admin/events");
  };

  if (!form) return <Container><div className="py-10">Loading...</div></Container>;

  return (
    <Container>
      <div className="py-10 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">Edit Event</h1>
        <form className="space-y-3" onSubmit={save}>
          <input className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required/>
          <textarea className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
          <input className="w-full border p-2 rounded" placeholder="Venue" value={form.venue} onChange={e=>setForm({...form, venue:e.target.value})} required/>
          <input className="w-full border p-2 rounded" type="datetime-local" value={form.start_at?.slice(0,16)} onChange={e=>setForm({...form, start_at:e.target.value})} required/>
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full border p-2 rounded" type="number" placeholder="Member price (cents)" value={form.price_member_cents} onChange={e=>setForm({...form, price_member_cents: parseInt(e.target.value || "0")})}/>
            <input className="w-full border p-2 rounded" type="number" placeholder="Non-member price (cents)" value={form.price_non_member_cents} onChange={e=>setForm({...form, price_non_member_cents: parseInt(e.target.value || "0")})}/>
          </div>
          <input className="w-full border p-2 rounded" type="number" placeholder="Capacity" value={form.capacity || 0} onChange={e=>setForm({...form, capacity: parseInt(e.target.value || "0")})}/>
          <button className="px-4 py-2 rounded bg-brand-600 text-white">Save</button>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </Container>
  );
}
