import type { MenuItem } from "../../types/menu";

export function getItemRestriction(item: MenuItem) {
  const text = `${item.name} ${item.description}`.toLowerCase();

  if (text.includes("24 hours") || text.includes("24 hour") || text.includes("called in")) {
    return {
      code: "ADVANCE_NOTICE",
      message: `${item.name} requires 24-hour advance notice and should be called in to the store. I cannot add it for immediate pickup.`
    };
  }

  return null;
}

export function extractSpecialInstructions(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("smear tuna on both sides")) {
    return "Smear tuna on both sides.";
  }
  if (lower.includes("on the side")) {
    return "Requested on the side.";
  }
  return undefined;
}
