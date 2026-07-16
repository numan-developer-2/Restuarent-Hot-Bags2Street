import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_BRAIN_URL = "http://127.0.0.1:8000";
const DEFAULT_TIMEOUT_MS = 180_000;

type BrainVoiceResponse = {
  session_id?: string;
  reply?: string;
  transcript?: string;
  normalized_transcript?: string;
  audio_url?: string;
  audio_base64?: string;
  audio_mime_type?: string;
  cart?: unknown;
  state?: string;
};

function normalizeBrainUrl() {
  return (
    process.env.HOT_BAGELS_BRAIN_URL ??
    process.env.BACKEND_PUBLIC_URL ??
    DEFAULT_BRAIN_URL
  ).replace(/\/$/, "");
}

function normalizeAudioUrl(audioUrl: string | undefined, brainUrl: string) {
  if (!audioUrl) {
    return undefined;
  }

  if (/^https?:\/\//i.test(audioUrl) || audioUrl.startsWith("data:")) {
    return audioUrl;
  }

  return `${brainUrl}${audioUrl.startsWith("/") ? "" : "/"}${audioUrl}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio");

  if (!(audio instanceof File) || audio.size === 0) {
    return NextResponse.json(
      {
        reply: "Please record your order again. I did not receive any voice audio.",
        error: "missing_audio"
      },
      { status: 400 }
    );
  }

  const brainFormData = new FormData();
  brainFormData.append("audio", audio, audio.name || "customer-order.webm");

  const sessionId = formData.get("sessionId");
  if (typeof sessionId === "string" && sessionId.trim()) {
    brainFormData.append("session_id", sessionId);
  }

  const brainUrl = normalizeBrainUrl();
  const timeoutMs = Number(process.env.HOT_BAGELS_BRAIN_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${brainUrl}/api/voice`, {
      method: "POST",
      body: brainFormData,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Voice brain responded with ${response.status}`);
    }

    const data = (await response.json()) as BrainVoiceResponse;

    return NextResponse.json({
      sessionId: data.session_id,
      reply: data.reply ?? "I heard you, but the ordering brain did not return a response.",
      transcript: data.transcript,
      normalizedTranscript: data.normalized_transcript,
      audioUrl: normalizeAudioUrl(data.audio_url, brainUrl),
      audioBase64: data.audio_base64,
      audioMimeType: data.audio_mime_type,
      cart: data.cart,
      state: data.state
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";

    return NextResponse.json(
      {
        reply: timedOut
          ? "The voice ordering brain is taking too long to respond. Please try again."
          : "Voice ordering is waiting for the local Faster-Whisper and Piper backend endpoint. Please start or complete the backend voice service first.",
        error: timedOut ? "voice_timeout" : "voice_unavailable"
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timer);
  }
}
