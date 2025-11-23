// app/not-found.tsx
"use client";

import { SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-9xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text">
          404
        </h1>
        <p className="text-3xl text-white/80 mt-8 mb-12">Page Not Found</p>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-xl">
              Go Home
            </button>
          </SignInButton>
        </SignedOut>

        <Link
          href="/"
          className="inline-flex items-center gap-3 mt-8 text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
