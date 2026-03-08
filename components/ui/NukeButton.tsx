// app/components/ui/NukeButton.tsx
"use client";

interface NukeButtonProps {
  onNuke: () => void;
}

export default function NukeButton({ onNuke }: NukeButtonProps) {
  return (
    <button
      onClick={() => {
        if (confirm("NUKE ALL DATA? This cannot be undone.")) {
          onNuke();
        }
      }}
      className="fixed bottom-8 right-8 z-50 bg-red-900/50 backdrop-blur-xl border border-red-500/50 text-red-400 px-6 py-3 rounded-full text-sm font-bold hover:bg-red-900/80 transition"
    >
      NUKE DATA
    </button>
  );
}
