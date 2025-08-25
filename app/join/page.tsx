'use client';

import Container from "@/components/Container";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", membership_type: "annual" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceFor = (type: string) => {
    switch (type) {
      case "annual": return 3500; // $35.00
      case "student": return 1500; // $15.00
      default: return 3500;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const resp = await fetch("/api/members/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "join", amount_cents: priceFor(form.membership_type) })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to create order");
      router.push(`/pay/${data.orderId}`);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="py-10 max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">Join MEANT</h1>
        <form className="space-y-4" onSubmit={submit}>
          <input className="w-full border p-2 rounded" placeholder="Full name" required
                 value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})}/>
          <input className="w-full border p-2 rounded" placeholder="Email" type="email" required
                 value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          <input className="w-full border p-2 rounded" placeholder="Phone (optional)"
                 value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
          <label className="block">
            <span>Membership Type</span>
            <select className="w-full border p-2 rounded mt-1" value={form.membership_type}
                    onChange={e=>setForm({...form, membership_type:e.target.value})}>
              <option value="annual">Annual - $35</option>
              <option value="student">Student - $15</option>
            </select>
          </label>
          <button disabled={loading} className="px-4 py-2 rounded bg-brand-600 text-white">
            {loading ? "Creating..." : "Continue to Payment"}
          </button>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </Container>
  );
}
