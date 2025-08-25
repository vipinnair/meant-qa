import Container from "@/components/Container";
import { getSupabaseAdmin } from "@/lib/supabase";

async function getMembers() {
  const db = await getSupabaseAdmin();
  const { data } = await db.from("members").select("*").order("created_at", { ascending: false }).limit(100);
  return data || [];
}

export default async function AdminMembersPage() {
  const members = await getMembers();
  return (
    <Container>
      <div className="py-10">
        <h1 className="text-2xl font-semibold mb-4">Members</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Expires</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m:any) => (
                <tr key={m.id}>
                  <td className="p-2 border">{m.full_name}</td>
                  <td className="p-2 border">{m.email}</td>
                  <td className="p-2 border">{m.membership_type}</td>
                  <td className="p-2 border">{m.status}</td>
                  <td className="p-2 border">{m.expires_on || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
