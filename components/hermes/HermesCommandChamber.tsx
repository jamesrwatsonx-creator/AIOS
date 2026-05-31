"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mic, Send } from "lucide-react";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { HermesCommandHistory, type HermesHistoryItem } from "@/components/hermes/HermesCommandHistory";
import { HermesResponsePanel } from "@/components/hermes/HermesResponsePanel";
import { HermesVoiceOrb, type HermesOrbState } from "@/components/hermes/HermesVoiceOrb";
import { quickHermesCommands, routeHermesCommand } from "@/lib/hermesCommands";
import { hermesFallbackResponse } from "@/lib/hermesPersonality";
import { createLocalId } from "@/lib/id";
import { readStorage, removeStorage, writeStorage } from "@/lib/localStorageKeys";
import { recordObsidianEvent } from "@/lib/obsidianClient";
import { upsertEntity } from "@/lib/entityStore";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

const historyKey = "hermes_command_history";

export function HermesCommandChamber() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orbState, setOrbState] = useState<HermesOrbState>("IDLE");
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState<HermesHistoryItem[]>([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    setHistory(readStorage(historyKey, []));
    const guardian = searchParams.get("guardian");
    if (guardian) setInput(`Send guidance through ${guardian}.`);
  }, [searchParams]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.code === "Space" && event.target === document.body) {
        event.preventDefault();
        startListening();
      }
    };
    const up = (event: KeyboardEvent) => {
      if (event.code === "Space") stopListening();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  });

  function persistHistory(next: HermesHistoryItem[]) {
    const capped = next.slice(0, 50);
    setHistory(capped);
    writeStorage(historyKey, capped);
  }

  function addHistory(command: string, reply: string) {
    const id = createLocalId("command");
    persistHistory([{ id, command, response: reply, timestamp: new Date().toLocaleString() }, ...history]);
    upsertEntity({
      id,
      type: "conversation",
      title: command.slice(0, 80),
      status: "RECORDED",
      guardian: "Hermes",
      guardianSlug: "hermes",
      category: "Hermes Conversation",
      tags: ["hermes", "conversation"],
      relationships: [{ type: "assigned_to", targetId: "guardian:hermes", label: "Hermes" }],
      source: "Command Center",
      metadata: { command, response: reply }
    }, "conversation_recorded");
    void recordObsidianEvent({
      category: "hermes",
      title: "Hermes command processed",
      body: `Command: ${command}\n\nResponse: ${reply}`,
      metadata: { source: "HermesCommandChamber" }
    });
  }

  async function speak(text = response) {
    if (!text.trim() || !readStorage("hermes_voice_enabled", true)) return;
    try {
      setOrbState("PROCESSING");
      const voiceResponse = await fetch("http://localhost:8881", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });
      if (!voiceResponse.ok) throw new Error("Voice server offline");
      const blob = await voiceResponse.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onplay = () => setOrbState("SPEAKING");
      audio.onended = () => {
        setOrbState("IDLE");
        URL.revokeObjectURL(url);
      };
      await audio.play();
    } catch {
      setOrbState("IDLE");
      console.log("Voice server offline. Run: npm run voice");
    }
  }

  async function askOpenRouter(userMessage: string) {
    const apiKeyOverride = readStorage("hermes_openrouter_api_key", "");
    const apiResponse = await fetch("/api/hermes/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        apiKeyOverride
      })
    });
    if (!apiResponse.ok) throw new Error("Hermes chat failed");
    const data = await apiResponse.json();
    return data?.reply as string | undefined;
  }

  async function processCommand(command: string) {
    const clean = command.trim();
    if (!clean) return;
    setOrbState("PROCESSING");
    const routed = routeHermesCommand(clean);
    try {
      let reply = routed.response ?? "";
      if (routed.type === "navigate" && routed.href) {
        router.push(routed.href);
      } else if (routed.type === "remote") {
        reply = (await askOpenRouter(clean)) ?? hermesFallbackResponse;
      }
      setResponse(reply);
      writeStorage("hermes_last_response", reply);
      addHistory(clean, reply);
      void speak(reply);
    } catch {
      const failure = "The connection to Hermes intelligence is temporarily unavailable. Please check your API key in Settings.";
      setOrbState("ERROR");
      setResponse(failure);
      addHistory(clean, failure);
    }
  }

  function startListening() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setOrbState("ERROR");
      setResponse("Microphone access required James. Please allow permissions or use the text input below.");
      return;
    }
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => {
      setListening(true);
      setOrbState("LISTENING");
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join("");
      transcriptRef.current = transcript;
      setInput(transcript);
    };
    recognition.onend = () => {
      setListening(false);
      const transcript = transcriptRef.current;
      if (transcript) void processCommand(transcript);
    };
    recognition.onerror = () => {
      setListening(false);
      setOrbState("ERROR");
      setResponse("Microphone access required James. Please allow permissions or use the text input below.");
    };
    recognitionRef.current = recognition;
    transcriptRef.current = "";
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  return (
    <div className="grid gap-6">
      <section className="sacred-panel gold-circuit rounded-lg p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-gold">Command Center</p>
            <h1 className="mt-3 font-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.9] text-ivory">Hermes Command Chamber</h1>
          </div>
          <StatusPill label={orbState} tone={orbState === "ERROR" ? "bronze" : "gold"} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <ChamberPanel>
          <div className="grid place-items-center gap-5">
            <HermesVoiceOrb state={orbState} />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">{listening ? "Listening" : orbState}</p>
            <button
              type="button"
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              className="inline-flex items-center gap-2 rounded-none border border-gold/55 bg-obsidian px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-gold hover:bg-gold hover:text-obsidian"
            >
              <Mic className="h-4 w-4" /> Hold to Speak
            </button>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void processCommand(input);
              }}
              placeholder="Ask Hermes what to do, where to go, or what to start..."
              className="min-w-0 rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory outline-none focus:border-gold/55"
            />
            <button type="button" onClick={() => processCommand(input)} className="inline-flex items-center gap-2 rounded-none border border-gold/55 px-4 py-3 font-mono text-xs uppercase text-gold hover:bg-gold hover:text-obsidian">
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {quickHermesCommands.map((command) => (
              <button key={command} type="button" onClick={() => processCommand(command)} className="rounded border border-gold/20 bg-gold/10 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-gold hover:border-gold/55">
                {command}
              </button>
            ))}
          </div>
        </ChamberPanel>

        <HermesResponsePanel response={response} onSpeak={() => void speak()} onClear={() => setResponse("")} />
      </div>

      <HermesCommandHistory items={history} onClear={() => { setHistory([]); removeStorage(historyKey); }} onRerun={(command) => processCommand(command)} />
    </div>
  );
}
