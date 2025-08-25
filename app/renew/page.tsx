'use client';

import Container from "@/components/Container";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RenewPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const resp = await fetch("/api/members/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, type: "renew" })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to create renewal");
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
        <h1 className="text-2xl font-semibold mb-4">Renew Membership</h1>
        <form className="space-y-4" onSubmit={submit}>
          <input className="w-full border p-2 rounded" placeholder="Membership email" type="email" required
                 value={form.email} onChange={e=>setForm({email:e.target.value})}/>
          <button disabled={loading} className="px-4 py-2 rounded bg-brand-600 text-white">
            {loading ? "Creating..." : "Continue to Payment"}
          </button>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </Container>
  );
}
