"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getItemImage } from "../lib/images";
import type { MenuItem } from "../types/menu";

type ProductCardProps = {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  featured?: boolean;
};

export function ProductCard({ item, onSelect, featured = false }: ProductCardProps) {
  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className="overflow-hidden border border-[var(--line)] bg-white/70"
    >
      <button className="block w-full text-left" onClick={() => onSelect(item)}>
        <div className={featured ? "relative h-56 overflow-hidden" : "relative h-44 overflow-hidden"}>
          <img
            src={getItemImage(item.name, item.categoryName)}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <span className="price-pill absolute right-3 top-3">{item.priceLabel}</span>
        </div>
        <div className={featured ? "p-6" : "p-5"}>
          {featured && (
            <div className="mb-2 flex items-center gap-1 text-orange">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={14} fill="currentColor" strokeWidth={0} />
              ))}
              <span className="ml-1 text-xs text-brown">(4.8)</span>
            </div>
          )}
          <h3 className="font-display text-lg font-semibold leading-snug">{item.name}</h3>
          {item.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-brown">{item.description}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange">
            {item.modifierGroups.length ? "Customize" : "Add"} <span aria-hidden>→</span>
          </span>
        </div>
      </button>
    </motion.article>
  );
}
