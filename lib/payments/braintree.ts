import type { PaymentProvider, CreateClientTokenParams, ChargeParams, ChargeResult } from "./types";
import { env } from "@/lib/env";
import braintree from "braintree";

function gateway() {
  return new braintree.BraintreeGateway({
    environment: env.braintree.env === "production" ? braintree.Environment.Production : braintree.Environment.Sandbox,
    merchantId: env.braintree.merchantId,
    publicKey: env.braintree.publicKey,
    privateKey: env.braintree.privateKey
  });
}

export const braintreeProvider: PaymentProvider = {
  name: "braintree",
  async createClientToken(_: CreateClientTokenParams) {
    const g = gateway();
    const res = await g.clientToken.generate({});
    return { clientToken: res.clientToken! };
  },
  async charge(p: ChargeParams): Promise<ChargeResult> {
    const g = gateway();
    const amount = (p.amountCents / 100).toFixed(2);
    try {
      const sale = await g.transaction.sale({
        amount,
        paymentMethodNonce: p.nonce,
        options: { submitForSettlement: true },
        orderId: p.orderId || p.registrationId || undefined,
        descriptor: { name: "MEANT*PAYMENT" }
      });
      if (sale.success) {
        return { ok: true, txnId: sale.transaction?.id, raw: sale };
      }
      return { ok: false, error: sale.message, raw: sale };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Payment error" };
    }
  }
};
