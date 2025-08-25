import Container from "@/components/Container";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

async function getEvents() {
  const db = getSupabaseAdmin();
  const { data } = await db.from("events").select("*").order("start_at", { ascending: true });
  return data || [];
}

export default async function AdminEventsPage() {
  const events = await getEvents();
  return (
    <Container>
      <div className="py-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Events</h1>
          <Link href="/admin/events/new" className="px-3 py-2 rounded bg-brand-600 text-white">New Event</Link>
        </div>
        <div className="space-y-3">
          {events.map((e:any) => (
            <div key={e.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{e.title}</div>
                <div className="text-sm text-gray-600">{new Date(e.start_at).toLocaleString()}</div>
              </div>
              <Link className="underline" href={`/admin/events/edit/${e.slug}`}>Edit</Link>
            </div>
          ))}
          {events.length === 0 && <div>No events yet.</div>}
        </div>
      </div>
    </Container>
  );
}
