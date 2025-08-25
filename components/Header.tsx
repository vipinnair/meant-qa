'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { env } from "@/lib/env";

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const path = usePathname();
  const active = path === href;
  return (
    <Link href={href} className={`px-3 py-2 rounded-md ${active ? "bg-brand-600 text-white" : "hover:bg-brand-100"}`}>
      {label}
    </Link>
  );
};

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-700">{env.siteName}</Link>
        <nav className="flex gap-2">
          <NavLink href="/" label="Home" />
          <NavLink href="/join" label="Join" />
          <NavLink href="/renew" label="Renew" />
          <NavLink href="/events" label="Events" />
          <NavLink href="/checkin" label="Check-in" />
          <NavLink href="/admin" label="Admin" />
        </nav>
      </div>
    </header>
  );
}
