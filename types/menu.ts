export type ModifierOption = {
  id: string;
  name: string;
  price: number;
};

export type ModifierGroup = {
  name: string;
  required: boolean;
  max_selections: number;
  options: ModifierOption[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  available: boolean;
  categoryName: string;
  modifierGroups: ModifierGroup[];
  hasUpchargeModifiers: boolean;
  priceLabel: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
  image: string;
};

export type MenuCatalog = {
  categories: MenuCategory[];
  allItems: MenuItem[];
  featuredItems: MenuItem[];
};

export type SelectedModifier = {
  groupName: string;
  option: ModifierOption;
};
