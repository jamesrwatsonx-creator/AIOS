"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { QuickCaptureModal } from "@/components/capture/QuickCaptureModal";

export function QuickCapture() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key.toLowerCase() === "q" && !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) setOpen(true);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return (
    <>
      <button onClick={() => setOpen(true)} title="Quick Capture (Q)" className="fixed bottom-5 right-5 layer-floating grid h-14 w-14 place-items-center rounded-full border border-gold/55 bg-obsidian text-gold shadow-gold-soft animate-pulse">
        <Plus className="h-6 w-6" />
      </button>
      {open ? <QuickCaptureModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
