export const env = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "MEANT",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  adminEmails: (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  paymentProvider: process.env.PAYMENT_PROVIDER || "mock",
  braintree: {
    merchantId: process.env.BRAINTREE_MERCHANT_ID || "",
    publicKey: process.env.BRAINTREE_PUBLIC_KEY || "",
    privateKey: process.env.BRAINTREE_PRIVATE_KEY || "",
    env: (process.env.BRAINTREE_ENV || "sandbox") as "sandbox" | "production"
  }
};
