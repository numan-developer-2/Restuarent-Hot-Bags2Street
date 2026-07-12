"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../ProductCard";
import type { MenuCategory, MenuItem } from "../../types/menu";

type InteractiveMenuProps = {
  categories: MenuCategory[];
  activeCategory: string;
  onActiveCategoryChange: (categoryName: string) => void;
  onSelectItem: (item: MenuItem) => void;
};

const PAGE_SIZE = 18;

export function InteractiveMenu({
  categories,
  activeCategory,
  onActiveCategoryChange,
  onSelectItem
}: InteractiveMenuProps) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allItems = useMemo(() => categories.flatMap((category) => category.items), [categories]);
  const categoryTabs = useMemo(() => ["All Items", ...categories.map((category) => category.name)], [categories]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, query]);

  const filteredItems = useMemo(() => {
    const source =
      activeCategory === "All Items"
        ? allItems
        : allItems.filter((item) => item.categoryName === activeCategory);
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return source;

    return source.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.categoryName.toLowerCase().includes(normalizedQuery)
    );
  }, [activeCategory, allItems, query]);

  const visibleItems = filteredItems.slice(0, visibleCount);

  return (
    <section id="menu" className="shell py-24 md:py-32">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-4xl font-bold md:text-5xl">Full Menu</h2>
        <p className="mt-4 text-brown">Browse our complete selection and customize your perfect order</p>
      </div>

      <div className="relative mx-auto mt-10 max-w-xl">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brown/55"
          size={18}
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search menu..."
          className="w-full rounded-sm border border-[var(--line)] bg-white px-12 py-4 text-sm outline-none transition focus:border-orange"
        />
      </div>

      <div className="mx-auto mt-8 max-w-6xl">
        <div className="flex gap-3 overflow-x-auto pb-4">
          {categoryTabs.map((categoryName) => {
            const count =
              categoryName === "All Items"
                ? allItems.length
                : categories.find((category) => category.name === categoryName)?.items.length ?? 0;

            return (
              <button
                key={categoryName}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  categoryName === activeCategory
                    ? "border-orange bg-orange text-white"
                    : "border-[var(--line)] bg-white/80 text-brown hover:border-orange/50"
                }`}
                onClick={() => onActiveCategoryChange(categoryName)}
              >
                {categoryName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {visibleItems.length ? (
        <>
          <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => (
              <ProductCard key={item.id} item={item} onSelect={onSelectItem} />
            ))}
          </div>
          {visibleItems.length < filteredItems.length && (
            <div className="mt-12 text-center">
              <button
                className="btn-primary px-8 py-3 text-sm font-semibold"
                onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="mt-12 text-center text-brown">No items match your search.</p>
      )}
    </section>
  );
}
