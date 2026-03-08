"use client"; // Forces client-side rendering — no prerender

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404 - Page Not Found</h1>
        <Link href="/" className="text-cyan-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

// ADD THIS TO PREVENT PRERENDER
export const dynamic = "force-dynamic";
