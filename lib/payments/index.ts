import { env } from "@/lib/env";
import { braintreeProvider } from "./braintree";
import { mockProvider } from "./mock";
import type { PaymentProvider } from "./types";

export function getPaymentProvider(): PaymentProvider {
  if (env.paymentProvider === "braintree") return braintreeProvider;
  return mockProvider;
}
