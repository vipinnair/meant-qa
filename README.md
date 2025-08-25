# MEANT Website (Modernized)

A **Next.js** + **Supabase** app with **pluggable payments** (Braintree or Mock), event QR codes, membership join/renew, event registrations, and day-of check-in. Designed to be **free/low-cost** and easy to operate.

## What you get
- Modern, responsive site (Tailwind).
- Admin login (OAuth via Supabase) and lightweight admin pages.
- New member join + renewal flows.
- Event CRUD (admin), public event pages, registration, optional pay-at-registration.
- Unique **ticket QR** per registration; **check-in scanner** page.
- Pluggable payment providers (`braintree` or `mock`) for future flexibility.
- Secrets via environment variables.
- Minimal dependencies for low overhead.

---

## Quick start

1. **Create a Supabase project** and note:
   - Project URL
   - Anon key
   - Service Role key

2. **Configure Auth**
   - Under *Authentication → Providers*, enable Google (or Microsoft/GitHub) for OAuth.
   - Add admin email(s) to `ADMIN_EMAILS` in `.env.local` for dashboard access.

3. **Run DB migrations**
   - Copy SQL from `supabase/migrations/001_init.sql` into Supabase SQL Editor and run it.

4. **Set environment variables**
   - Copy `.env.example` → `.env.local` and fill values:
     ```
     NEXT_PUBLIC_SUPABASE_URL=...
     NEXT_PUBLIC_SUPABASE_ANON_KEY=...
     SUPABASE_SERVICE_ROLE_KEY=...
     ADMIN_EMAILS=you@org.org

     PAYMENT_PROVIDER=mock   # start with mock; switch to braintree later
     BRAINTREE_MERCHANT_ID=
     BRAINTREE_PUBLIC_KEY=
     BRAINTREE_PRIVATE_KEY=
     BRAINTREE_ENV=sandbox

     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```

5. **Install & run**
   ```bash
   npm i
   npm run dev
   ```

6. **Deploy**
   - Deploy on **Vercel** (recommended) or any Node serverless host.
   - Set the same env vars in your hosting provider.
   - Configure Supabase **Auth redirect URLs** to include your deployed domain.

---

## Payments
Start with `PAYMENT_PROVIDER=mock` for testing. When ready:
- Switch to `PAYMENT_PROVIDER=braintree`
- Add Braintree keys (sandbox or production).
- In Braintree dashboard, enable **PayPal** and **Apple Pay** (per your region/device requirements).

---

## Admin Access
- Only users whose email is listed in `ADMIN_EMAILS` can access `/admin`.
- Use Google/Microsoft/GitHub OAuth via Supabase.

---

## Structure
```
app/
  (public pages)
  admin/ (protected)
  api/ (server routes)
components/
lib/
supabase/migrations/
```

---

## Security Notes
- Never commit `.env.local`.
- All secrets are environment variables.
- Admin server-side operations use Supabase **Service Role** key in API routes only.
- You can add RLS policies if you prefer pure client access; this starter keeps sensitive writes server-side.

---

## License
MIT
