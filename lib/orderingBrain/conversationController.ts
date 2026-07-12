import { getMenuCatalog } from "../menu";
import { addToCart, readBackCart } from "./cartTools";
import { extractSpecialInstructions, getItemRestriction } from "./rules";
import { findEggSandwichOptions, normalizeText, searchMenu } from "./search";
import type { BrainResponse, BrainState } from "../../types/ordering";
import type { MenuItem } from "../../types/menu";

export const initialBrainState: BrainState = {
  phase: "greeting",
  cart: { lines: [] },
  failedAttempts: 0
};

function quantityFromMessage(message: string) {
  const lower = normalizeText(message);
  if (/\b(two|2)\b/.test(lower)) return 2;
  if (/\b(three|3)\b/.test(lower)) return 3;
  if (/\b(four|4)\b/.test(lower)) return 4;
  if (/\b(six|6)\b/.test(lower)) return 6;
  return 1;
}

function splitLikelyItems(message: string) {
  return message
    .split(/\s+(?:and|also|plus)\s+|,/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 2);
}

function formatOptions(options: MenuItem[]) {
  return options.map((item) => item.name).join(", ");
}

function minimalOptions(options: MenuItem[]) {
  return options.map((item) => ({
    id: item.id,
    name: item.name,
    categoryName: item.categoryName
  }));
}

export function handleBrainMessage(message: string, state: BrainState = initialBrainState): BrainResponse {
  const catalog = getMenuCatalog();
  const items = catalog.allItems;
  const lower = normalizeText(message);

  if (!lower) {
    return { reply: "Tell me what you would like to order.", state };
  }

  if (/\b(cart|what.*order|read.*back|total)\b/.test(lower)) {
    return {
      reply: readBackCart(state.cart),
      state: { ...state, phase: "confirming" }
    };
  }

  if (/\b(that'?s it|confirm|done|checkout)\b/.test(lower)) {
    return {
      reply: `Here is your order:\n${readBackCart(state.cart)}`,
      state: { ...state, phase: "confirming" }
    };
  }

  if (state.pendingClarification) {
    const selected = searchMenu(message, items, 1)[0];
    if (selected) {
      const result = addToCart(state.cart, selected, quantityFromMessage(state.pendingClarification.originalMessage), state.pendingClarification.originalMessage);
      return {
        reply: `Added ${selected.name}. ${readBackCart(result.cart)}`,
        state: {
          ...state,
          phase: "ordering",
          cart: result.cart,
          pendingClarification: undefined,
          failedAttempts: 0
        }
      };
    }
  }

  if (lower.includes("sandwich with eggs") || lower.includes("sandwich with egg")) {
    const options = findEggSandwichOptions(items);
    return {
      reply: `Which egg sandwich did you mean? I found: ${formatOptions(options)}.`,
      state: {
        ...state,
        phase: "clarifying",
        pendingClarification: {
          reason: "egg sandwich ambiguity",
          options: minimalOptions(options),
          originalMessage: message
        }
      }
    };
  }

  const segments = splitLikelyItems(message);
  let cart = state.cart;
  const added: string[] = [];
  const rejected: string[] = [];
  const clarificationCandidates: MenuItem[] = [];

  for (const segment of segments) {
    const matches = searchMenu(segment, items, 4);
    if (!matches.length) continue;

    if (matches.length > 1 && matches[0].name !== matches[1].name && normalizeText(segment).split(" ").length <= 3) {
      clarificationCandidates.push(...matches.slice(0, 4));
      continue;
    }

    const item = matches[0];
    const restriction = getItemRestriction(item);
    if (restriction) {
      rejected.push(restriction.message);
      continue;
    }

    const quantity = quantityFromMessage(segment);
    const addCount = quantity > 1 ? quantity : 1;
    for (let index = 0; index < addCount; index += 1) {
      const result = addToCart(cart, item, 1, segment, extractSpecialInstructions(segment));
      cart = result.cart;
      added.push(item.name);
      rejected.push(...result.rejected.map((name) => `${name} is not available as a modifier.`));
    }
  }

  if (clarificationCandidates.length && !added.length) {
    const unique = Array.from(new Map(clarificationCandidates.map((item) => [item.id, item])).values());
    return {
      reply: `I found a few possible matches. Which one did you mean: ${formatOptions(unique.slice(0, 5))}?`,
      state: {
        ...state,
        phase: "clarifying",
        pendingClarification: {
          reason: "multiple menu matches",
          options: minimalOptions(unique.slice(0, 5)),
          originalMessage: message
        }
      }
    };
  }

  if (!added.length && !rejected.length) {
    const failedAttempts = state.failedAttempts + 1;
    return {
      reply:
        failedAttempts >= 2
          ? "I cannot find that item on the menu. A team member can help with that request."
          : "I could not confidently find that item. Can you say it another way?",
      state: { ...state, failedAttempts, phase: "clarifying" }
    };
  }

  const addedText = added.length ? `Added ${added.join(", ")}.` : "";
  const rejectedText = rejected.length ? ` ${rejected.join(" ")}` : "";

  return {
    reply: `${addedText}${rejectedText}\n${readBackCart(cart)}`.trim(),
    state: {
      ...state,
      phase: "ordering",
      cart,
      pendingClarification: undefined,
      failedAttempts: 0
    }
  };
}
