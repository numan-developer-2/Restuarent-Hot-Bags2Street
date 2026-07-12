"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { MenuItem, SelectedModifier } from "../types/menu";

export type CartLine = {
  lineId: string;
  itemId: string;
  name: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  basePrice: number;
  modifiers: SelectedModifier[];
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addLine: (item: MenuItem, quantity: number, unitPrice: number, modifiers: SelectedModifier[]) => void;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "hot-bagels-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      setLines(JSON.parse(stored) as CartLine[]);
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

    return {
      lines,
      itemCount,
      subtotal,
      addLine(item, quantity, unitPrice, modifiers) {
        setLines((current) => [
          ...current,
          {
            lineId: crypto.randomUUID(),
            itemId: item.id,
            name: item.name,
            categoryName: item.categoryName,
            quantity,
            unitPrice,
            basePrice: item.basePrice,
            modifiers
          }
        ]);
      },
      removeLine(lineId) {
        setLines((current) => current.filter((line) => line.lineId !== lineId));
      },
      updateQuantity(lineId, quantity) {
        setLines((current) =>
          current.map((line) =>
            line.lineId === lineId ? { ...line, quantity: Math.max(1, quantity) } : line
          )
        );
      },
      clearCart() {
        setLines([]);
      }
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
