// app/components/ui/GoalsModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInput: string;
  setInitialInput: (value: string) => void;
  goalInput: string;
  setGoalInput: (value: string) => void;
  onSave: () => void;
  isInitialSetup: boolean;
}

export default function GoalsModal({
  isOpen,
  onClose,
  initialInput,
  setInitialInput,
  goalInput,
  setGoalInput,
  onSave,
  isInitialSetup,
}: GoalsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          className="relative w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900/90 via-zinc-900/95 to-black/90 backdrop-blur-3xl border border-white/10 shadow-4xl p-12 lg:p-16 text-center">
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition"
            >
              <X className="w-7 h-7" />
            </button>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-12">
              {isInitialSetup ? "Set Your Journey" : "Update Goals"}
            </h1>

            <div className="space-y-8">
              <div>
                <p className="text-white/60 mb-2">Starting Capital</p>
                <input
                  type="text"
                  value={initialInput}
                  onChange={(e) =>
                    setInitialInput(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full px-8 py-6 text-5xl text-center bg-white/5 rounded-2xl border border-white/10 focus:border-cyan-400 outline-none text-white"
                  autoFocus
                />
              </div>

              <div>
                <p className="text-white/60 mb-2">Freedom Goal</p>
                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) =>
                    setGoalInput(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full px-8 py-6 text-5xl text-center bg-white/5 rounded-2xl border border-white/10 focus:border-purple-400 outline-none text-white"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSave}
                className="w-full py-8 text-3xl font-bold bg-linear-to-r from-cyan-500 to-purple-500 rounded-2xl shadow-2xl"
              >
                {isInitialSetup ? "BEGIN COMPOUNDING" : "UPDATE GOALS"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
