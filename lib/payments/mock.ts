import type { PaymentProvider, CreateClientTokenParams, ChargeParams, ChargeResult } from "./types";

export const mockProvider: PaymentProvider = {
  name: "mock",
  async createClientToken(_: CreateClientTokenParams) {
    return { clientToken: "mock-client-token" };
  },
  async charge(p: ChargeParams): Promise<ChargeResult> {
    // Always succeed for demo
    return { ok: true, txnId: "mock-txn-" + Math.random().toString(36).slice(2) };
  }
};
