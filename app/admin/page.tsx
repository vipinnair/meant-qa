import Container from "@/components/Container";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase";
import { env } from "@/lib/env";

export default async function AdminPage() {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const isAllowed = user?.email && env.adminEmails.includes(user.email);
  return (
    <Container>
      <div className="py-10">
        <h1 className="text-2xl font-semibold mb-4">Admin</h1>
        {!user ? (
          <form action="/api/auth/login" method="post">
            <button className="px-4 py-2 rounded bg-brand-600 text-white">Sign in with Google</button>
          </form>
        ) : !isAllowed ? (
          <div>You ({user.email}) are not authorized.</div>
        ) : (
          <div className="space-y-3">
            <Link href="/admin/events" className="underline">Manage Events</Link>
            <Link href="/admin/members" className="underline block">Members</Link>
            <form action="/api/auth/logout" method="post"><button className="px-3 py-1 border rounded">Sign out</button></form>
          </div>
        )}
      </div>
    </Container>
  );
}
