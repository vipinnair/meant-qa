export type CreateClientTokenParams = {};
export type CreateClientTokenResult = { clientToken: string };

export type ChargeParams = {
  amountCents: number;
  nonce: string;
  orderId?: string;
  registrationId?: string;
  description?: string;
};

export type ChargeResult = {
  ok: boolean;
  txnId?: string;
  raw?: any;
  error?: string;
};

export interface PaymentProvider {
  name: string;
  createClientToken(p: CreateClientTokenParams): Promise<CreateClientTokenResult>;
  charge(p: ChargeParams): Promise<ChargeResult>;
}
