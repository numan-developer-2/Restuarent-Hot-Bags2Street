"use client";

import { useState } from "react";
import { AIAssistant } from "./AIAssistant";
import { CartDrawer } from "./cart/CartDrawer";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { InteractiveMenu } from "./menu/InteractiveMenu";
import { ProductDrawer } from "./menu/ProductDrawer";
import { Navbar } from "./Navbar";
import { Preloader } from "./Preloader";
import { CategoryExplorer } from "./sections/CategoryExplorer";
import { SignatureBagels } from "./sections/SignatureBagels";
import { StorySections } from "./sections/StorySections";
import { CartProvider } from "../store/cart-store";
import type { MenuCatalog, MenuItem } from "../types/menu";

type HomePageProps = {
  catalog: MenuCatalog;
};

export function HomePage({ catalog }: HomePageProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Items");

  const jumpToCategory = (categoryName: string) => {
    setActiveCategory(categoryName);
    window.requestAnimationFrame(() => {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <CartProvider>
      <Preloader />
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main>
        <Hero />
        <SignatureBagels items={catalog.featuredItems} onSelectItem={setSelectedItem} />
        <CategoryExplorer categories={catalog.categories} onCategorySelect={jumpToCategory} />
        <InteractiveMenu
          categories={catalog.categories}
          activeCategory={activeCategory}
          onActiveCategoryChange={setActiveCategory}
          onSelectItem={setSelectedItem}
        />
        <StorySections />
      </main>
      <Footer />
      <AIAssistant />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <ProductDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </CartProvider>
  );
}
