"use client";

export function todayKey(prefix: string) {
  return `${prefix}_${new Date().toISOString().slice(0, 10)}`;
}

export function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export async function speakBrief(text: string) {
  try {
    const response = await fetch("http://localhost:8881", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    await audio.play();
  } catch {
    console.log("Voice server offline. Run: npm run voice");
  }
}
