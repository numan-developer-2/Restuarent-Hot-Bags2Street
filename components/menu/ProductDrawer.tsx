"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Minus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { calculateUnitPrice, formatMoney } from "../../lib/menu";
import { getItemImage } from "../../lib/images";
import { useCart } from "../../store/cart-store";
import type { MenuItem, SelectedModifier } from "../../types/menu";

type ProductDrawerProps = {
  item: MenuItem | null;
  onClose: () => void;
};

export function ProductDrawer({ item, onClose }: ProductDrawerProps) {
  const { addLine } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [missingGroup, setMissingGroup] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setSelected(
      Object.fromEntries(item.modifierGroups.map((group) => [group.name, []])) as Record<
        string,
        string[]
      >
    );
    setOpenGroups(new Set(item.modifierGroups[0] ? [item.modifierGroups[0].name] : []));
    setMissingGroup(null);
  }, [item]);

  const unitPrice = useMemo(() => {
    if (!item) return 0;
    return calculateUnitPrice(item, selected);
  }, [item, selected]);

  const selectedModifiers = useMemo<SelectedModifier[]>(() => {
    if (!item) return [];

    return item.modifierGroups.flatMap((group) =>
      (selected[group.name] ?? [])
        .map((optionId) => group.options.find((option) => option.id === optionId))
        .filter(Boolean)
        .map((option) => ({ groupName: group.name, option: option! }))
    );
  }, [item, selected]);

  if (!item) return null;

  const toggleGroup = (groupName: string) => {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };

  const toggleOption = (groupName: string, optionId: string, maxSelections: number) => {
    setSelected((current) => {
      const currentGroup = current[groupName] ?? [];
      const isSelected = currentGroup.includes(optionId);

      if (maxSelections === 1) {
        return { ...current, [groupName]: isSelected ? [] : [optionId] };
      }

      if (isSelected) {
        return { ...current, [groupName]: currentGroup.filter((id) => id !== optionId) };
      }

      if (currentGroup.length >= maxSelections) {
        return current;
      }

      return { ...current, [groupName]: [...currentGroup, optionId] };
    });
  };

  const handleAdd = () => {
    const missing = item.modifierGroups.find(
      (group) => group.required && (selected[group.name] ?? []).length === 0
    );

    if (missing) {
      setMissingGroup(missing.name);
      setOpenGroups((current) => new Set([...current, missing.name]));
      return;
    }

    addLine(item, quantity, unitPrice, selectedModifiers);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="product-backdrop"
        className="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        key="product-panel"
        className="drawer-panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-label={`Customize ${item.name}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
          <h2 className="font-display text-xl font-semibold">Customize</h2>
          <button aria-label="Close product drawer" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="relative mb-5 h-48 overflow-hidden rounded-md">
            <img
              src={getItemImage(item.name, item.categoryName)}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
            {item.categoryName}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold">{item.name}</h3>
          {item.description && <p className="mt-3 text-sm leading-6 text-brown">{item.description}</p>}
          <p className="mt-3 text-sm font-semibold text-orange">{formatMoney(item.basePrice)} base</p>

          {item.modifierGroups.length ? (
            <div className="mt-6 space-y-3">
              {item.modifierGroups.map((group, groupIndex) => {
                const selectedForGroup = selected[group.name] ?? [];
                const isOpen = openGroups.has(group.name);
                const isMissing = missingGroup === group.name && selectedForGroup.length === 0;

                return (
                  <section
                    key={`${item.id}-group-${groupIndex}-${group.name}`}
                    className={`overflow-hidden rounded-md border ${
                      isMissing ? "border-orange" : "border-[var(--line)]"
                    } bg-white/70`}
                  >
                    <button
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                      onClick={() => toggleGroup(group.name)}
                    >
                      <span>
                        <span className="text-sm font-semibold">{group.name}</span>
                        {group.required && <span className="ml-2 text-xs text-orange">Required</span>}
                      </span>
                      <span className="flex items-center gap-2 text-xs text-brown">
                        {selectedForGroup.length}/{group.max_selections} selected
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-[var(--line)] bg-cream/45 py-1">
                        {group.options.map((option, optionIndex) => {
                          const checked = selectedForGroup.includes(option.id);
                          const limitReached =
                            group.max_selections > 1 &&
                            selectedForGroup.length >= group.max_selections &&
                            !checked;

                          return (
                            <label
                              key={`${item.id}-${groupIndex}-${optionIndex}-${option.id}`}
                              className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                                limitReached ? "cursor-not-allowed opacity-45" : "cursor-pointer"
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <input
                                  type={group.max_selections === 1 ? "radio" : "checkbox"}
                                  name={group.name}
                                  checked={checked}
                                  disabled={limitReached}
                                  onChange={() =>
                                    toggleOption(group.name, option.id, group.max_selections)
                                  }
                                />
                                {option.name}
                              </span>
                              {option.price > 0 && (
                                <span className="text-brown">+{formatMoney(option.price)}</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <p className="mt-6 rounded-md bg-white/70 p-4 text-sm text-brown">
              This item has no additional customization.
            </p>
          )}
        </div>

        <div className="border-t border-[var(--line)] bg-cream px-6 py-5">
          <div className="mb-4 min-h-8 text-xs text-brown">
            {selectedModifiers.length ? (
              <div className="flex flex-wrap gap-2">
                {selectedModifiers.slice(0, 5).map((modifier, modifierIndex) => (
                  <span
                    key={`${modifier.groupName}-${modifier.option.id}-${modifierIndex}`}
                    className="rounded-full bg-white px-3 py-1"
                  >
                    {modifier.option.name}
                  </span>
                ))}
                {selectedModifiers.length > 5 && (
                  <span className="rounded-full bg-white px-3 py-1">
                    +{selectedModifiers.length - 5} more
                  </span>
                )}
              </div>
            ) : (
              "Selections will appear here as you build the item."
            )}
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                aria-label="Decrease quantity"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)]"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                aria-label="Increase quantity"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)]"
                onClick={() => setQuantity((current) => current + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="font-display text-xl font-semibold">
              {formatMoney(unitPrice * quantity)}
            </span>
          </div>
          {missingGroup && (
            <p className="mb-3 text-sm text-orange">Please choose an option for {missingGroup}.</p>
          )}
          <button className="btn-primary w-full py-3.5 font-semibold" onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
