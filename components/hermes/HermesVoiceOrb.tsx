"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export type HermesOrbState = "IDLE" | "LISTENING" | "PROCESSING" | "SPEAKING" | "ERROR";

type HermesVoiceOrbProps = {
  state: HermesOrbState;
  size?: "compact" | "full";
};

export function HermesVoiceOrb({ state, size = "full" }: HermesVoiceOrbProps) {
  const dimension = size === "compact" ? "h-[60px] w-[60px]" : "h-[200px] w-[200px]";
  const ring = state === "ERROR" ? "border-red-700/60 shadow-[0_0_30px_rgba(185,28,28,0.5)]" : "border-gold/45 shadow-[0_0_48px_rgba(212,166,74,0.34)]";

  return (
    <div className={`grid place-items-center ${dimension}`}>
      <motion.div
        animate={{ scale: state === "LISTENING" ? [1, 1.08, 1] : 1, rotate: state === "PROCESSING" ? 360 : 0 }}
        transition={{ duration: state === "PROCESSING" ? 6 : 2.4, repeat: Infinity, ease: "linear" }}
        className={`grid h-full w-full place-items-center rounded-full border bg-[radial-gradient(circle,rgba(26,167,184,0.18),rgba(212,166,74,0.12),rgba(5,5,5,0.92))] ${ring}`}
      >
        {state === "LISTENING" ? <span className="h-[82%] w-[82%] rounded-full border border-gold/25 animate-gold-pulse" /> : null}
        {state === "SPEAKING" ? <span className="h-[72%] w-[72%] rounded-full border-4 border-dotted border-nile-blue/60" /> : null}
        <Eye className={`${size === "compact" ? "h-7 w-7" : "h-16 w-16"} text-gold`} aria-hidden="true" />
      </motion.div>
    </div>
  );
}
