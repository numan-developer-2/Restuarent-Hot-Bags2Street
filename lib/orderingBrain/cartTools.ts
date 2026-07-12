import { calculateUnitPrice, formatMoney } from "../menu";
import type { MenuItem, ModifierGroup, SelectedModifier } from "../../types/menu";
import type { BrainCart, BrainCartLine } from "../../types/ordering";

function getDefaultOption(group: ModifierGroup) {
  return (
    group.options.find((option) => /plain|regular|default|lettuce/i.test(option.name)) ??
    group.options.find((option) => option.price === 0)
  );
}

export function selectModifiersFromMessage(item: MenuItem, message: string) {
  const selected: Record<string, string[]> = {};
  const modifiers: SelectedModifier[] = [];
  const lower = message.toLowerCase();
  const missingRequired: string[] = [];
  const rejected: string[] = [];

  for (const group of item.modifierGroups) {
    selected[group.name] = [];

    for (const option of group.options) {
      const optionName = option.name.toLowerCase();
      const compactOption = optionName.replace(/\([^)]*\)/g, "").trim();
      const requested =
        lower.includes(optionName) ||
        (compactOption.length > 2 && lower.includes(compactOption)) ||
        (optionName.includes("everything") && lower.includes("everything"));

      if (requested && selected[group.name].length < group.max_selections) {
        selected[group.name].push(option.id);
        modifiers.push({ groupName: group.name, option });
      }
    }

    if (group.required && selected[group.name].length === 0) {
      const defaultOption = getDefaultOption(group);
      if (defaultOption) {
        selected[group.name].push(defaultOption.id);
        modifiers.push({ groupName: group.name, option: defaultOption });
      } else {
        missingRequired.push(group.name);
      }
    }
  }

  for (const impossible of ["blue milk", "red milk"]) {
    if (lower.includes(impossible)) rejected.push(impossible);
  }

  return { selected, modifiers, missingRequired, rejected };
}

export function addToCart(
  cart: BrainCart,
  item: MenuItem,
  quantity: number,
  message: string,
  specialInstructions?: string
) {
  const { selected, modifiers, missingRequired, rejected } = selectModifiersFromMessage(item, message);
  const unitPrice = calculateUnitPrice(item, selected);
  const line: BrainCartLine = {
    lineItemId: crypto.randomUUID(),
    itemId: item.id,
    itemName: item.name,
    quantity,
    unitPrice,
    modifiers,
    specialInstructions
  };

  return {
    cart: { lines: [...cart.lines, line] },
    line,
    missingRequired,
    rejected
  };
}

export function removeFromCart(cart: BrainCart, lineItemId: string) {
  return { lines: cart.lines.filter((line) => line.lineItemId !== lineItemId) };
}

export function editCartItem(cart: BrainCart, lineItemId: string, changes: Partial<BrainCartLine>) {
  return {
    lines: cart.lines.map((line) => (line.lineItemId === lineItemId ? { ...line, ...changes } : line))
  };
}

export function getCartTotal(cart: BrainCart) {
  return cart.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function readBackCart(cart: BrainCart) {
  if (!cart.lines.length) return "Your cart is empty.";

  const lines = cart.lines.map((line, index) => {
    const mods = line.modifiers.length
      ? ` with ${line.modifiers.map((modifier) => modifier.option.name).join(", ")}`
      : "";
    const instructions = line.specialInstructions ? ` Notes: ${line.specialInstructions}` : "";
    return `${index + 1}. ${line.quantity} ${line.itemName}${mods}${instructions} — ${formatMoney(
      line.unitPrice * line.quantity
    )}`;
  });

  return `${lines.join("\n")}\nTotal: ${formatMoney(getCartTotal(cart))}`;
}
