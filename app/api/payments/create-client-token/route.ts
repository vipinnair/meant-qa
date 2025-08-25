import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";

export async function POST() {
  const provider = getPaymentProvider();
  const token = await provider.createClientToken({});
  return NextResponse.json(token);
}
