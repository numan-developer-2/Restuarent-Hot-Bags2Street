import { NextResponse } from "next/server";
import { sendToGohlemBrain } from "../../../lib/ai/gohlemClient";
import { handleBrainMessage, initialBrainState } from "../../../lib/orderingBrain/conversationController";
import type { BrainState } from "../../../types/ordering";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    message?: string;
    cartSummary?: string;
    state?: BrainState;
  };

  if (!body.message?.trim()) {
    return NextResponse.json({ reply: "Send me what you are craving and I can help." });
  }

  try {
    if (!process.env.GOHLEM_API_URL || !process.env.GOHLEM_API_KEY) {
      return NextResponse.json(
        handleBrainMessage(body.message, body.state ?? initialBrainState)
      );
    }

    const result = await sendToGohlemBrain({
      message: body.message,
      cartSummary: body.cartSummary ?? ""
    });

    return NextResponse.json({
      reply: result.reply,
      state: body.state ?? initialBrainState
    });
  } catch {
    return NextResponse.json(
      {
        reply:
          "I had trouble processing that. Please try again or ask a team member for help.",
        state: body.state ?? initialBrainState
      },
      { status: 502 }
    );
  }
}
