// app/components/ui/NukeButton.tsx
"use client";

import { nukeAllData } from "@/actions/nuke"; // adjust path

interface NukeButtonProps {
  // No props needed anymore if action is direct
}

export default function NukeButton() {
  const handleNuke = async () => {
    if (!confirm("NUKE ALL DATA? This cannot be undone.")) return;

    try {
      const result = await nukeAllData();
      if (result.success) {
        alert("Database successfully nuked! Refreshing...");
        window.location.reload(); // or redirect('/dashboard')
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      alert("Nuke failed: " + message);
    }
  };

  // Optional: hide in production
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <button
      onClick={handleNuke}
      className="fixed bottom-8 right-8 z-50 bg-red-900/50 backdrop-blur-xl border border-red-500/50 text-red-400 px-6 py-3 rounded-full text-sm font-bold hover:bg-red-900/80 transition"
    >
      NUKE DATA
    </button>
  );
}
