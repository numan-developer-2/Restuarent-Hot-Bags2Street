"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const LEARNING_REPLY =
  "I'm currently learning! Full AI ordering assistance coming soon. For now, please use the menu to customize and add items to your cart.";

function createMessageId() {
  return crypto.randomUUID();
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      text: "Hi! I'm here to help you order. What can I get for you today?"
    }
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageViewportRef = useRef<HTMLDivElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const pendingRepliesRef = useRef(0);
  const replyTimersRef = useRef<number[]>([]);

  useEffect(() => {
    if (!open) return;
    window.requestAnimationFrame(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      inputRef.current?.focus();
    });
  }, [messages, assistantTyping, open]);

  useEffect(() => {
    return () => {
      replyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      replyTimersRef.current = [];
    };
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message) return;

    setInput("");
    setMessages((current) => [...current, { id: createMessageId(), role: "user", text: message }]);
    setAssistantTyping(true);
    pendingRepliesRef.current += 1;

    const timer = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: "assistant", text: LEARNING_REPLY }
      ]);
      pendingRepliesRef.current = Math.max(0, pendingRepliesRef.current - 1);
      setAssistantTyping(pendingRepliesRef.current > 0);
      replyTimersRef.current = replyTimersRef.current.filter((storedTimer) => storedTimer !== timer);
    }, 650);

    replyTimersRef.current.push(timer);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[min(520px,calc(100vh-128px))] w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-md border border-[var(--line)] bg-white shadow-2xl">
          <div className="shrink-0 bg-orange px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold">Order Assistant</p>
                <p className="text-sm text-white/90">Ask me anything about our menu</p>
              </div>
              <button aria-label="Close assistant" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div ref={messageViewportRef} className="flex-1 space-y-3 overflow-y-auto p-5 scroll-smooth">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-fit max-w-[82%] rounded-md px-4 py-3 text-sm leading-6 ${
                    message.role === "assistant"
                      ? "bg-cream text-ink"
                      : "ml-auto bg-orange text-white"
                  }`}
                >
                  {message.text}
                </motion.div>
              ))}
              {assistantTyping && (
                <motion.div
                  key="assistant-typing"
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="flex w-fit items-center gap-1 rounded-md bg-cream px-4 py-3"
                  aria-label="Assistant is typing"
                >
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 rounded-full bg-brown/60 animate-pulse"
                      style={{ animationDelay: `${dot * 120}ms` }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messageEndRef} />
          </div>

          <form onSubmit={submit} className="flex shrink-0 gap-2 border-t border-[var(--line)] bg-white p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              className="min-w-0 flex-1 rounded-md border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-orange"
            />
            <button className="btn-primary grid h-12 w-12 place-items-center" aria-label="Send message">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        aria-label="Open AI order assistant"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-orange text-white shadow-xl transition-transform hover:scale-105"
        onClick={() => setOpen((current) => !current)}
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
}
