export const FALLBACK_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop";

export const categoryImageMap: Record<string, string> = {
  "Appetizers & Sides":
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
  "Bagels & Sandwiches":
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
  "Chef's Specialties Sandwiches":
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1200&auto=format&fit=crop",
  Salads:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
  Boba:
    "https://images.unsplash.com/photo-1558857563-b371033873b8?q=80&w=1200&auto=format&fit=crop",
  "Bottled Drinks":
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200&auto=format&fit=crop",
  "Ready Made Beverages":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
  "Specialty Beverages":
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
  Smoothies:
    "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?q=80&w=1200&auto=format&fit=crop",
  "Acai Bowls & Smoothies":
    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1200&auto=format&fit=crop",
  "Omelets & Breakfast":
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop",
  "Paninis & Wraps":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1200&auto=format&fit=crop",
  Pastries:
    "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1200&auto=format&fit=crop",
  "Pastries/Muffins/Donuts":
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200&auto=format&fit=crop",
  "Patis Pastries":
    "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1200&auto=format&fit=crop",
  "Patis Savory":
    "https://images.unsplash.com/photo-1568051243857-068aa3ea934d?q=80&w=1200&auto=format&fit=crop",
  "Main Dishes":
    "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?q=80&w=1200&auto=format&fit=crop",
  "Soup/ Farina":
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200&auto=format&fit=crop",
  "Sourdough/Challah":
    "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1200&auto=format&fit=crop",
  "Catering Platters":
    "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
  "Catering Salads":
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop",
  "Catering Hot Food":
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop",
  "Catering Drinks":
    "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1200&auto=format&fit=crop",
  "Grab n Go!":
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop",
  "Herring, Pickles, Dips":
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1200&auto=format&fit=crop",
  "Spreads & Vegetables":
    "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=1200&auto=format&fit=crop",
  "Shabbos Matamim":
    "https://images.unsplash.com/photo-1556911073-38141963c9e0?q=80&w=1200&auto=format&fit=crop",
  "Chanukah Donuts":
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200&auto=format&fit=crop"
};

export const itemImageMap: Record<string, string> = {
  "Scrambled Egg Sandwich":
    "https://images.unsplash.com/photo-1585478259715-1c6ee2c2e326?q=80&w=1200&auto=format&fit=crop",
  "Giant Pizza Bagel":
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
  "Cream Cheese Lox Croissant":
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
  "Chèvre Sandwich":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1200&auto=format&fit=crop",
  "Breakfast Burrito":
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop"
};

export function getCategoryImage(categoryName: string) {
  return categoryImageMap[categoryName] ?? FALLBACK_FOOD_IMAGE;
}

export function getItemImage(itemName: string, categoryName: string) {
  return itemImageMap[itemName] ?? getCategoryImage(categoryName);
}
