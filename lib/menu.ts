import rawMenu from "../data/hot_bagels_menu.json";
import { getCategoryImage } from "./images";
import type { MenuCatalog, MenuCategory, MenuItem, ModifierGroup } from "../types/menu";

type RawOption = {
  id: string;
  name: string;
  price: number;
};

type RawModifierGroup = {
  name: string;
  required: boolean;
  max_selections: number;
  options: RawOption[];
};

type RawItem = {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  available: boolean;
  modifier_groups?: RawModifierGroup[];
};

type RawCategory = {
  name: string;
  items: RawItem[];
};

type RawMenuFile = {
  menu: {
    categories: RawCategory[];
  };
};

const menuFile = rawMenu as RawMenuFile;

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function getLowestPositiveOption(groups: ModifierGroup[]) {
  const prices = groups
    .flatMap((group) => group.options.map((option) => option.price))
    .filter((price) => price > 0)
    .sort((a, b) => a - b);

  return prices[0];
}

function getPriceLabel(basePrice: number, groups: ModifierGroup[]) {
  const hasUpcharge = groups.some((group) => group.options.some((option) => option.price > 0));

  if (basePrice === 0) {
    const lowest = getLowestPositiveOption(groups);
    return lowest ? `From ${formatMoney(lowest)}` : "Price varies";
  }

  return hasUpcharge ? `from ${formatMoney(basePrice)}` : formatMoney(basePrice);
}

function normalizeItem(item: RawItem, categoryName: string): MenuItem {
  const modifierGroups = (item.modifier_groups ?? []).map((group) => ({
    name: group.name,
    required: Boolean(group.required),
    max_selections: Number(group.max_selections ?? 1),
    options: (group.options ?? []).map((option) => ({
      id: option.id,
      name: option.name,
      price: Number(option.price ?? 0)
    }))
  }));

  return {
    id: item.id,
    name: item.name,
    description: item.description?.trim() ?? "",
    basePrice: Number(item.base_price ?? 0),
    available: item.available,
    categoryName,
    modifierGroups,
    hasUpchargeModifiers: modifierGroups.some((group) =>
      group.options.some((option) => option.price > 0)
    ),
    priceLabel: getPriceLabel(Number(item.base_price ?? 0), modifierGroups)
  };
}

export function getMenuCatalog(): MenuCatalog {
  const categories: MenuCategory[] = menuFile.menu.categories
    .map((category) => ({
      name: category.name,
      image: getCategoryImage(category.name),
      items: category.items.map((item) => normalizeItem(item, category.name))
    }))
    .filter((category) => category.items.length > 0);

  const allItems = categories.flatMap((category) => category.items);
  const featuredItems = allItems
    .filter((item) =>
      ["Bagels & Sandwiches", "Chef's Specialties Sandwiches"].includes(item.categoryName)
    )
    .sort((a, b) => b.basePrice - a.basePrice)
    .slice(0, 3);

  return { categories, allItems, featuredItems };
}

export function calculateUnitPrice(item: MenuItem, selectedOptionIds: Record<string, string[]>) {
  return item.modifierGroups.reduce((total, group) => {
    const selected = selectedOptionIds[group.name] ?? [];
    const additions = selected.reduce((sum, optionId) => {
      const option = group.options.find((candidate) => candidate.id === optionId);
      return sum + (option?.price ?? 0);
    }, 0);

    return total + additions;
  }, item.basePrice);
}
