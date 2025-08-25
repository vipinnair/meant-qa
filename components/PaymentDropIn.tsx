'use client';

import { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";
import { useRouter } from "next/navigation";

type Props = {
  orderId?: string;
  registrationId?: string;
  amountCents: number;
  successRedirect: string;
};

export default function PaymentDropIn({ orderId, registrationId, amountCents, successRedirect }: Props) {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const tokenRes = await fetch("/api/payments/create-client-token", { method: "POST" });
        const { clientToken } = await tokenRes.json();

        if (clientToken === "mock-client-token") {
          // Use mock mode: no drop-in; show a simple "Simulate Payment" button
          setIsMock(true);
          if (mounted) setReady(true);
          return;
        }

        const instance = await dropin.create({
          authorization: clientToken,
          container: containerRef.current!,
          paypal: { flow: "checkout", amount: (amountCents/100).toFixed(2), currency: "USD" },
          // Apple Pay will only work once configured in Braintree & on supported devices
          applePay: { displayName: "MEANT", paymentRequest: { total: { label: "MEANT", amount: (amountCents/100).toFixed(2) } } }
        });
        instanceRef.current = instance;
        if (mounted) setReady(true);
      } catch (e: any) {
        setErr(e?.message || "Error initializing payment");
      }
    }
    init();
    return () => { mounted = false; instanceRef.current?.teardown?.(); };
  }, [amountCents]);

  const onPay = async () => {
    try {
      let nonce = "fake-mock-nonce";
      if (!isMock) {
        const payload = await instanceRef.current.requestPaymentMethod();
        nonce = payload.nonce;
      }
      const resp = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, registrationId, nonce })
      });
      const data = await resp.json();
      if (data.ok) {
        router.push(successRedirect);
      } else {
        setErr(data.error || "Payment failed");
      }
    } catch (e: any) {
      setErr(e?.message || "Payment error");
    }
  };

  return (
    <div className="space-y-4">
      {!isMock && <div ref={containerRef} />}
      {err && <div className="text-red-600">{err}</div>}
      <button onClick={onPay} disabled={!ready} className="px-4 py-2 rounded bg-brand-600 text-white disabled:opacity-50">
        {isMock ? "Simulate Payment" : `Pay $${(amountCents/100).toFixed(2)}`}
      </button>
    </div>
  );
}
