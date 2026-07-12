"use client";

import { motion } from "framer-motion";
import { ProductCard } from "../ProductCard";
import type { MenuItem } from "../../types/menu";

type SignatureBagelsProps = {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
};

export function SignatureBagels({ items, onSelectItem }: SignatureBagelsProps) {
  return (
    <section id="signature" className="shell py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="font-display text-4xl font-bold md:text-5xl">Signature Bagels</h2>
        <p className="mt-4 text-brown">Our most loved creations, crafted with premium ingredients</p>
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} featured onSelect={onSelectItem} />
        ))}
      </div>
    </section>
  );
}
