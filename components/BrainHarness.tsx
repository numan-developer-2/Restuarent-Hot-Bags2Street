"use client";

import { FormEvent, useState } from "react";
import type { BrainState } from "../types/ordering";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export function BrainHarness() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<BrainState>({
    phase: "greeting",
    cart: { lines: [] },
    failedAttempts: 0
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hot Bagels ordering brain harness ready. Type a test order."
    }
  ]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message) return;

    setInput("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", text: message }]);

    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, state })
    });
    const data = (await response.json()) as { reply: string; state: BrainState };

    setState(data.state);
    setMessages((current) => [...current, { role: "assistant", text: data.reply }]);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-bg px-6 py-10 text-ink">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-md border border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] px-6 py-5">
            <p className="font-display text-3xl font-bold">Gohlem.ai Brain Harness</p>
            <p className="mt-2 text-sm text-brown">
              Text-chat test surface for Hot Bagels natural-language ordering.
            </p>
          </div>
          <div className="h-[620px] space-y-4 overflow-y-auto p-6">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[82%] whitespace-pre-wrap rounded-md px-4 py-3 text-sm leading-6 ${
                  message.role === "assistant"
                    ? "bg-cream text-brown"
                    : "ml-auto bg-orange text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && <p className="text-sm text-brown">Processing...</p>}
          </div>
          <form onSubmit={submit} className="flex gap-3 border-t border-[var(--line)] p-5">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Try: I want an everything bagel, cream cheese, smoked lox..."
              className="min-w-0 flex-1 rounded-sm border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-orange"
            />
            <button className="btn-primary px-6 py-3 text-sm font-semibold">Send</button>
          </form>
        </section>

        <aside className="rounded-md border border-[var(--line)] bg-white p-5">
          <p className="font-display text-xl font-semibold">Structured State</p>
          <pre className="mt-4 max-h-[720px] overflow-auto rounded-sm bg-ink p-4 text-xs leading-5 text-white">
            {JSON.stringify(state, null, 2)}
          </pre>
        </aside>
      </div>
    </main>
  );
}
