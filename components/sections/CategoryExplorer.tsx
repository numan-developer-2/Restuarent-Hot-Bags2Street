"use client";

import { motion } from "framer-motion";
import type { MenuCategory } from "../../types/menu";
import { PRIMARY_STOREFRONT_CATEGORIES } from "../../lib/categoryConfig";

type CategoryExplorerProps = {
  categories: MenuCategory[];
  onCategorySelect: (categoryName: string) => void;
};

export function CategoryExplorer({ categories, onCategorySelect }: CategoryExplorerProps) {
  const primaryCategories = PRIMARY_STOREFRONT_CATEGORIES.map((name) =>
    categories.find((category) => category.name === name)
  ).filter(Boolean) as MenuCategory[];

  return (
    <section className="bg-cream/60 py-24 md:py-32">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="font-display text-4xl font-bold md:text-5xl">Explore Our Menu</h2>
          <p className="mt-4 text-brown">
            From classic bagels to gourmet sandwiches, fresh salads, and specialty drinks
          </p>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {primaryCategories.map((category) => (
            <button
              key={category.name}
              className="group relative h-64 overflow-hidden rounded-md text-left"
              onClick={() => onCategorySelect(category.name)}
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <h3 className="font-display text-xl font-semibold">{category.name}</h3>
                <p className="mt-1 text-sm text-white/80">{category.items.length} items</p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button
            className="btn-primary px-7 py-3 text-sm font-semibold"
            onClick={() => onCategorySelect("All Items")}
          >
            View Complete Menu
          </button>
        </div>
      </div>
    </section>
  );
}
