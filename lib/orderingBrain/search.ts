import type { MenuItem } from "../../types/menu";

const synonymMap: Record<string, string[]> = {
  barakas: ["bourekas"],
  borekas: ["bourekas"],
  lox: ["sliced lox", "smoked lox"],
  coffee: ["specialty beverages", "ready made beverages"],
  eggs: ["egg", "scrambled egg", "sliced eggs", "omelet"],
  challah: ["challah", "sourdough"]
};

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreItem(query: string, item: MenuItem) {
  const q = normalizeText(query);
  const name = normalizeText(item.name);
  const description = normalizeText(item.description);
  const category = normalizeText(item.categoryName);
  const expandedTerms = [q, ...(synonymMap[q] ?? [])];

  let score = 0;

  for (const term of expandedTerms) {
    if (!term) continue;
    if (name === term) score += 100;
    if (name.includes(term)) score += 45;
    if (term.includes(name)) score += 30;
    if (description.includes(term)) score += 14;
    if (category.includes(term)) score += 8;
  }

  const words = q.split(" ").filter(Boolean);
  for (const word of words) {
    if (name.includes(word)) score += 8;
    if (description.includes(word)) score += 3;
  }

  return score;
}

export function searchMenu(query: string, items: MenuItem[], limit = 6) {
  return items
    .map((item) => ({ item, score: scoreItem(query, item) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((match) => match.item);
}

export function findEggSandwichOptions(items: MenuItem[]) {
  return items
    .filter((item) => {
      const haystack = normalizeText(`${item.name} ${item.description}`);
      return /\beggs?\b/.test(haystack) && item.categoryName.includes("Sandwich");
    })
    .slice(0, 6);
}
