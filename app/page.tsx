import Container from "@/components/Container";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <section className="py-16">
        <h1 className="text-4xl font-bold mb-4">MEANT</h1>
        <p className="text-lg text-gray-700 max-w-2xl">
          Welcome to the modernized MEANT website. Join or renew membership, register for events, and check in with QR codes—all from your phone.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/join" className="px-5 py-3 rounded bg-brand-600 text-white">Join</Link>
          <Link href="/renew" className="px-5 py-3 rounded border border-brand-600 text-brand-700">Renew</Link>
          <Link href="/events" className="px-5 py-3 rounded border">Browse Events</Link>
        </div>
      </section>
    </Container>
  );
}
