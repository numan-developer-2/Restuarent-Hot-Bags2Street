import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_BRAIN_URL = "http://127.0.0.1:8000";
const DEFAULT_TIMEOUT_MS = 180_000;

type AssistantRequest = {
  message?: string;
  sessionId?: string | null;
};

type BrainChatResponse = {
  session_id: string;
  reply: string;
  cart: unknown;
  state: string;
};

function normalizeBrainUrl() {
  return (
    process.env.HOT_BAGELS_BRAIN_URL ??
    process.env.BACKEND_PUBLIC_URL ??
    DEFAULT_BRAIN_URL
  ).replace(/\/$/, "");
}

export async function POST(request: Request) {
  const body = (await request.json()) as AssistantRequest;
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json({ reply: "Send me what you are craving and I can help." });
  }

  const brainUrl = normalizeBrainUrl();
  const timeoutMs = Number(process.env.HOT_BAGELS_BRAIN_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${brainUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: body.sessionId ?? null,
        message
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Brain responded with ${response.status}`);
    }

    const data = (await response.json()) as BrainChatResponse;

    return NextResponse.json({
      sessionId: data.session_id,
      reply: data.reply,
      cart: data.cart,
      state: data.state
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";

    return NextResponse.json(
      {
        reply: timedOut
          ? "The ordering brain is taking too long to respond. Please try again in a moment."
          : "The local ordering brain is not available yet. Please start the backend server and try again.",
        error: timedOut ? "brain_timeout" : "brain_unavailable"
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timer);
  }
}
