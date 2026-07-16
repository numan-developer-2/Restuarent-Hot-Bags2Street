"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mic, MessageCircle, Send, Square, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type AssistantApiResponse = {
  sessionId?: string;
  reply?: string;
  transcript?: string;
  normalizedTranscript?: string;
  audioUrl?: string;
  audioBase64?: string;
  audioMimeType?: string;
  error?: string;
};

const SESSION_STORAGE_KEY = "hot-bagels-brain-session-id";
const GENERIC_ERROR_REPLY =
  "I could not reach the ordering brain right now. Please make sure the local backend is running and try again.";

function createMessageId() {
  return crypto.randomUUID();
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    if (!open) return;
    window.requestAnimationFrame(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      inputRef.current?.focus();
    });
  }, [messages, assistantTyping, open]);

  useEffect(() => {
    setSessionId(window.sessionStorage.getItem(SESSION_STORAGE_KEY));
  }, []);

  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const playAssistantAudio = (data: AssistantApiResponse) => {
    if (data.audioUrl) {
      void new Audio(data.audioUrl).play().catch(() => undefined);
      return;
    }

    if (data.audioBase64) {
      const mimeType = data.audioMimeType ?? "audio/wav";
      void new Audio(`data:${mimeType};base64,${data.audioBase64}`).play().catch(() => undefined);
    }
  };

  const applyAssistantResponse = (data: AssistantApiResponse, voiceMessageId?: string) => {
    if (data.sessionId) {
      setSessionId(data.sessionId);
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, data.sessionId);
    }

    const displayedTranscript = data.normalizedTranscript ?? data.transcript;
    if (voiceMessageId && displayedTranscript) {
      setMessages((current) =>
        current.map((message) =>
          message.id === voiceMessageId ? { ...message, text: displayedTranscript ?? message.text } : message
        )
      );
    }

    setMessages((current) => [
      ...current,
      { id: createMessageId(), role: "assistant", text: data.reply ?? GENERIC_ERROR_REPLY }
    ]);
    playAssistantAudio(data);
  };

  const sendTextMessage = async (message: string) => {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId })
    });

    return (await response.json()) as AssistantApiResponse;
  };

  const sendVoiceMessage = async (audio: Blob, voiceMessageId: string) => {
    const formData = new FormData();
    formData.append("audio", audio, "customer-order.webm");
    if (sessionId) {
      formData.append("sessionId", sessionId);
    }

    const response = await fetch("/api/assistant/voice", {
      method: "POST",
      body: formData
    });

    const data = (await response.json()) as AssistantApiResponse;
    applyAssistantResponse(data, voiceMessageId);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || assistantTyping || recording) return;

    setInput("");
    setMessages((current) => [...current, { id: createMessageId(), role: "user", text: message }]);
    setAssistantTyping(true);

    try {
      applyAssistantResponse(await sendTextMessage(message));
    } catch {
      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: "assistant", text: GENERIC_ERROR_REPLY }
      ]);
    } finally {
      setAssistantTyping(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    setRecording(false);
  };

  const startRecording = async () => {
    if (assistantTyping || recording) return;

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          text: "Voice input is not available in this browser. Please type your order."
        }
      ]);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audio = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const voiceMessageId = createMessageId();

        setMessages((current) => [
          ...current,
          { id: voiceMessageId, role: "user", text: "Voice message received..." }
        ]);
        setAssistantTyping(true);

        void sendVoiceMessage(audio, voiceMessageId)
          .catch(() => {
            setMessages((current) => [
              ...current,
              { id: createMessageId(), role: "assistant", text: GENERIC_ERROR_REPLY }
            ]);
          })
          .finally(() => setAssistantTyping(false));
      };

      recorder.start();
      setRecording(true);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          text: "I could not access the microphone. Please allow microphone permission and try again."
        }
      ]);
    }
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
              disabled={assistantTyping || recording}
              placeholder={
                recording
                  ? "Listening..."
                  : assistantTyping
                    ? "Waiting for the ordering brain..."
                    : "Type your message..."
              }
              className="min-w-0 flex-1 rounded-md border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-orange"
            />
            <button
              type="button"
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                recording
                  ? "border-orange bg-orange text-white"
                  : "border-[var(--line)] bg-white text-brown hover:border-orange hover:text-orange"
              }`}
              aria-label={recording ? "Stop voice recording" : "Start voice recording"}
              onClick={recording ? stopRecording : startRecording}
              disabled={assistantTyping}
            >
              {recording ? <Square size={17} /> : <Mic size={18} />}
            </button>
            <button
              className="btn-primary grid h-12 w-12 place-items-center disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Send message"
              disabled={assistantTyping || recording || !input.trim()}
            >
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
