import Container from "@/components/Container";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { format } from "date-fns";

async function getEvents() {
  const db = await getSupabaseAdmin();
  const { data } = await db.from("events").select("*").order("start_at", { ascending: true });
  return data || [];
}

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <Container>
      <div className="py-10">
        <h1 className="text-2xl font-semibold mb-6">Events</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((e:any) => (
            <Link key={e.id} href={`/events/${e.slug}`} className="border p-4 rounded hover:shadow">
              <div className="text-lg font-semibold">{e.title}</div>
              <div className="text-gray-600">{format(new Date(e.start_at), "PPpp")}</div>
              <div className="text-gray-600">{e.venue}</div>
            </Link>
          ))}
          {events.length === 0 && <div>No events yet. Check back soon.</div>}
        </div>
      </div>
    </Container>
  );
}
