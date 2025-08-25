'use client';

import Container from "@/components/Container";
import Scanner from "@/components/Scanner";
import { useState } from "react";

export default function CheckinPage() {
  const [msg, setMsg] = useState<string | null>(null);

  const onCode = async (code: string) => {
    const res = await fetch(`/api/checkin?code=${encodeURIComponent(code)}`, { method: "POST" });
    const data = await res.json();
    if (data.ok) setMsg(`Checked in: ${data.full_name} (${data.event})`);
    else setMsg(`Error: ${data.error || "Invalid ticket"}`);
  };

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-2xl font-semibold mb-4">Event Check-in</h1>
        <Scanner onCode={onCode} />
        {msg && <div className="mt-4 p-3 border rounded">{msg}</div>}
      </div>
    </Container>
  );
}
