// components/shared/Navbar.tsx
"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          TravelTrek
        </Link>
        <div className="space-x-4">
          <Link href="/customer" className="hover:text-secondary">
            Customer Portal
          </Link>
          <Link href="/host" className="hover:text-secondary">
            Host Portal
          </Link>
          <Link href="/login" className="hover:text-secondary">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
