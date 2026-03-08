// app/components/ui/GuestScreen.tsx
"use client";

import { motion } from "framer-motion";
import { DollarSign, Sparkles, Target } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { FormEvent } from "react";

interface GuestScreenProps {
  initialInput: string;
  setInitialInput: (value: string) => void;
  goalInput: string;
  setGoalInput: (value: string) => void;
}

export default function GuestScreen({
  initialInput,
  setInitialInput,
  goalInput,
  setGoalInput,
}: GuestScreenProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Optional: add basic validation here later
    // e.g. if (!initialInput || Number(initialInput) <= 0) return alert(...)
    // For now → just let SignInButton handle the flow
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900/90 via-zinc-900/95 to-black/90 backdrop-blur-3xl border border-white/10 shadow-2xl p-12 lg:p-16 text-center">
          {/* Decorative blur glow */}
          <div className="absolute -inset-px rounded-3xl bg-linear-to-r from-cyan-500/20 via-purple-500/20 to-transparent opacity-30 blur-xl pointer-events-none" />

          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Pro Trading Journal
          </h1>

          <p className="text-2xl lg:text-3xl font-light text-white/70 mb-12 tracking-widest">
            Your Account Is The Scoreboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-12 max-w-lg mx-auto">
            {/* Starting Capital */}
            <div className="group">
              <label
                htmlFor="starting-capital"
                className="flex items-center justify-center gap-3 text-lg font-medium text-white/80 mb-3"
              >
                <DollarSign className="w-6 h-6 text-cyan-400" />
                Starting Capital
              </label>
              <input
                id="starting-capital"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={initialInput}
                onChange={(e) =>
                  setInitialInput(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="w-full px-8 py-6 text-5xl font-medium text-center bg-white/5 border border-white/10 rounded-2xl focus:border-cyan-400/50 focus:bg-white/10 outline-none text-white placeholder-white/30 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="10000"
              />
            </div>

            {/* Freedom Goal */}
            <div className="group">
              <label
                htmlFor="freedom-goal"
                className="flex items-center justify-center gap-3 text-lg font-medium text-white/80 mb-3"
              >
                <Target className="w-6 h-6 text-purple-400" />
                Freedom Goal
              </label>
              <input
                id="freedom-goal"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={goalInput}
                onChange={(e) =>
                  setGoalInput(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="w-full px-8 py-6 text-5xl font-medium text-center bg-white/5 border border-white/10 rounded-2xl focus:border-purple-400/50 focus:bg-white/10 outline-none text-white placeholder-white/30 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="100000"
              />
            </div>

            {/* Submit / Sign In */}
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" // now tied to form
                className="relative w-full py-7 text-2xl font-semibold tracking-wide bg-linear-to-r from-cyan-500 via-cyan-400 to-purple-500 rounded-2xl shadow-2xl overflow-hidden group cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Begin Journey <Sparkles className="w-8 h-8" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>
            </SignInButton>
          </form>

          <p className="mt-12 text-sm text-white/40 font-light tracking-widest">
            COMPOUNDING IS THE 8TH WONDER
          </p>
        </div>
      </motion.div>
    </div>
  );
}
