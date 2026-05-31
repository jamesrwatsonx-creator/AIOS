"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { systemPaths } from "@/lib/systemPaths";
import { readStorage, writeStorage } from "@/lib/localStorageKeys";
import { recordObsidianEvent } from "@/lib/obsidianClient";

export function SettingsChamber() {
  const [profile, setProfile] = useState({ name: "James", title: "James AI Operator Dashboard" });
  const [apiKey, setApiKey] = useState("");
  const [n8nKey, setN8nKey] = useState("");
  const [n8nUrl, setN8nUrl] = useState("http://localhost:5678");
  const [browseKey, setBrowseKey] = useState("");
  const [message, setMessage] = useState("");
  const [appearance, setAppearance] = useState({ intensity: 70, font: "Medium", motion: true });
  const [voice, setVoice] = useState({ enabled: true, speed: 0.9 });
  const [voiceStatus, setVoiceStatus] = useState<"UNKNOWN" | "ONLINE" | "OFFLINE">("UNKNOWN");

  useEffect(() => {
    setProfile(readStorage("hermes_profile", profile));
    setVoice({ enabled: readStorage("hermes_voice_enabled", true), speed: readStorage("hermes_voice_speed", 0.9) });
    setN8nKey(readStorage("hermes_n8n_api_key", ""));
    setN8nUrl(readStorage("hermes_n8n_url", "http://localhost:5678"));
    setBrowseKey(readStorage("hermes_browsesh_key", ""));
    const localKey = readStorage("hermes_openrouter_api_key", "");
    if (localKey) setApiKey(localKey);
    else fetch("/api/hermes/config").then((response) => response.json()).then((config: { openRouterConfigured?: boolean }) => setApiKey(config.openRouterConfigured ? "[REDACTED - STORED LOCALLY]" : "")).catch(() => setApiKey(""));
  }, []);

  function flash(nextMessage: string) {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(""), 2000);
  }

  async function checkVoice() {
    try {
      const response = await fetch("http://localhost:8881", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "Hermes voice status check." }) });
      setVoiceStatus(response.ok ? "ONLINE" : "OFFLINE");
    } catch {
      setVoiceStatus("OFFLINE");
    }
  }

  async function testOpenRouterConnection() {
    try {
      const response = await fetch("/api/hermes/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: "System status", apiKeyOverride: apiKey }) });
      flash(response.ok ? "Connection confirmed. Saved ✓" : "Connection failed.");
    } catch {
      flash("Connection failed.");
    }
  }

  async function testN8n() {
    try {
      const response = await fetch(`${n8nUrl}/api/v1/workflows`, { headers: { "X-N8N-API-KEY": n8nKey } });
      flash(response.ok ? "n8n connected ✓" : "n8n offline or key rejected");
    } catch {
      flash("n8n offline");
    }
  }

  return (
    <AppShell><PageFrame eyebrow="Settings" title="Settings Chamber" subtitle="Local dashboard preferences only. No backend, database, or auth.">
      <ChamberPanel><SectionTitle eyebrow="Operator Profile" title="James" /><div className="mt-5 grid gap-3 md:grid-cols-2"><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /><input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /></div><button onClick={() => { writeStorage("hermes_profile", profile); void recordObsidianEvent({ category: "settings", title: "Operator profile saved", body: `${profile.name} · ${profile.title}` }); flash("Saved ✓"); }} className="mt-4 rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save Profile</button></ChamberPanel>
      <ChamberPanel><SectionTitle eyebrow="Appearance" title="Visual Canon" /><div className="mt-5 grid gap-4"><label className="text-soft-sand">Dark mode locked ON</label><label className="text-soft-sand">Gold accent intensity <input type="range" value={appearance.intensity} onChange={(e) => setAppearance({ ...appearance, intensity: Number(e.target.value) })} /></label><select value={appearance.font} onChange={(e) => setAppearance({ ...appearance, font: e.target.value })} className="rounded border border-gold/18 bg-obsidian/55 px-3 py-2 text-ivory"><option>Small</option><option>Medium</option><option>Large</option></select><label className="text-soft-sand"><input type="checkbox" checked={appearance.motion} onChange={(e) => setAppearance({ ...appearance, motion: e.target.checked })} /> Motion enabled</label><button onClick={() => { writeStorage("hermes_appearance", appearance); void recordObsidianEvent({ category: "settings", title: "Appearance saved", body: `Intensity ${appearance.intensity}, font ${appearance.font}, motion ${appearance.motion}` }); flash("Saved ✓"); }} className="justify-self-start rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save Appearance</button></div></ChamberPanel>
      <ChamberPanel><SectionTitle eyebrow="Hermes Settings" title="Voice" /><div className="mt-5 grid gap-4"><label className="text-soft-sand"><input type="checkbox" checked={voice.enabled} onChange={(e) => setVoice({ ...voice, enabled: e.target.checked })} /> Voice ON/OFF</label><label className="text-soft-sand">Voice speed <input type="range" min="0.5" max="1.5" step="0.1" value={voice.speed} onChange={(e) => setVoice({ ...voice, speed: Number(e.target.value) })} /></label><div className="flex flex-wrap items-center gap-3"><StatusPill label={`VOICE ENGINE ${voiceStatus}`} tone={voiceStatus === "ONLINE" ? "emerald" : "bronze"} /><button onClick={checkVoice} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Check Status</button><span className="text-sm text-soft-sand">Start voice: npm run voice</span></div><button onClick={() => { writeStorage("hermes_voice_speed", voice.speed); writeStorage("hermes_voice_enabled", voice.enabled); void recordObsidianEvent({ category: "settings", title: "Hermes voice settings saved", body: `Enabled ${voice.enabled}, speed ${voice.speed}` }); flash("Saved ✓"); }} className="justify-self-start rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save Hermes Settings</button></div></ChamberPanel>
      <ChamberPanel><SectionTitle eyebrow="API Settings" title="OpenRouter" /><input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="OpenRouter API Key" className="mt-5 w-full rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => { writeStorage("hermes_openrouter_api_key", apiKey); flash("Saved ✓"); }} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save Key</button><button onClick={testOpenRouterConnection} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Test Connection</button></div></ChamberPanel>
      <ChamberPanel><SectionTitle eyebrow="n8n Settings" title="Automation Bridge" /><div className="mt-5 grid gap-3 md:grid-cols-2"><input type="password" value={n8nKey} onChange={(e) => setN8nKey(e.target.value)} placeholder="n8n API Key" className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /><input value={n8nUrl} onChange={(e) => setN8nUrl(e.target.value)} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /></div><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => { writeStorage("hermes_n8n_api_key", n8nKey); writeStorage("hermes_n8n_url", n8nUrl); flash("Saved ✓"); }} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save Key</button><button onClick={testN8n} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Test Connection</button><a href={n8nUrl} target="_blank" className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Open n8n</a></div></ChamberPanel>
      <ChamberPanel><SectionTitle eyebrow="Browse.sh Settings" title="Horus Scanner" /><input type="password" value={browseKey} onChange={(e) => setBrowseKey(e.target.value)} placeholder="Browse.sh API Key" className="mt-5 w-full rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => { writeStorage("hermes_browsesh_key", browseKey); flash("Saved ✓"); }} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save Key</button><button onClick={() => flash(browseKey ? "CONNECTION READY" : "CONNECTION FAILED")} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Test Connection</button><a href="https://browse.sh" target="_blank" className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Get Key</a></div></ChamberPanel>
      <ChamberPanel><SectionTitle eyebrow="System Startup" title="James AI Operator OS" /><div className="mt-5 grid gap-2 text-sm text-soft-sand"><p><span className="text-gold">Terminal 1 — Dashboard:</span> <code className="text-gold">npm run dev</code></p><p><span className="text-gold">Terminal 2 — Automations:</span> <code className="text-gold">npm run workflows</code></p><p><span className="text-gold">Terminal 3 — Voice Engine:</span> <code className="text-gold">npm run voice</code></p><p>Place voice sample at: <code className="text-gold">/home/james/.hermes/voice-samples/target/clips/clip-1.wav</code></p><p>Browser: <code className="text-gold">http://localhost:3003</code></p></div></ChamberPanel>
      <ChamberPanel><SectionTitle eyebrow="System Paths" title="Read Only" /><div className="mt-5 grid gap-2 text-sm text-soft-sand">{Object.entries(systemPaths).map(([key, value]) => <p key={key}><span className="text-gold">{key}:</span> {value}</p>)}</div><button onClick={() => { if (window.confirm("Clear all localStorage?")) { localStorage.clear(); flash("Saved ✓"); } }} className="mt-5 rounded-none border border-burnt-bronze/60 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Reset All Settings</button>{message ? <p className="mt-3 font-mono text-xs uppercase text-gold">{message}</p> : null}</ChamberPanel>
    </PageFrame></AppShell>
  );
}
