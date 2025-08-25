import Container from "@/components/Container";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <Container>
      <div className="py-16 max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">Payment Successful</h1>
        <p className="mb-6">Your payment has been received. If this was a membership renewal, your expiry has been updated.</p>
        <Link href="/" className="px-4 py-2 rounded bg-brand-600 text-white">Go Home</Link>
      </div>
    </Container>
  );
}
