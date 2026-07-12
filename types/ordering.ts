import type { MenuItem, SelectedModifier } from "./menu";

export type BrainCartLine = {
  lineItemId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  modifiers: SelectedModifier[];
  specialInstructions?: string;
};

export type BrainCart = {
  lines: BrainCartLine[];
};

export type ConversationPhase = "greeting" | "ordering" | "clarifying" | "editing" | "confirming";

export type PendingClarification = {
  reason: string;
  options: Pick<MenuItem, "id" | "name" | "categoryName">[];
  originalMessage: string;
};

export type BrainState = {
  phase: ConversationPhase;
  cart: BrainCart;
  pendingClarification?: PendingClarification;
  failedAttempts: number;
};

export type BrainResponse = {
  reply: string;
  state: BrainState;
};
