"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { formatMoney } from "../../lib/menu";
import { useCart } from "../../store/cart-store";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { lines, subtotal, removeLine, updateQuantity, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pickupTimes = useMemo(() => ["ASAP", "15 minutes", "30 minutes", "45 minutes"], []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-backdrop"
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            key="cart-panel"
            className="drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Cart drawer"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
              <h2 className="font-display text-xl font-semibold">Your Cart</h2>
              <button aria-label="Close cart" onClick={onClose}>
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {submitted ? (
                <div className="rounded-md bg-white p-5">
                  <p className="font-display text-xl font-semibold">Order Summary</p>
                  <p className="mt-2 text-sm leading-6 text-brown">
                    Thank you. Your pickup order summary is ready for the counter team.
                  </p>
                  <button
                    className="btn-primary mt-5 w-full py-3 text-sm font-semibold"
                    onClick={() => {
                      clearCart();
                      setSubmitted(false);
                      setCheckoutOpen(false);
                      onClose();
                    }}
                  >
                    Finish Demo Order
                  </button>
                </div>
              ) : lines.length ? (
                <div className="space-y-4">
                  {lines.map((line) => (
                    <div key={line.lineId} className="border-b border-[var(--line)] pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">{line.name}</p>
                          {line.modifiers.length > 0 && (
                            <p className="mt-1 text-xs leading-5 text-brown">
                              {line.modifiers.map((modifier) => modifier.option.name).join(", ")}
                            </p>
                          )}
                        </div>
                        <p className="whitespace-nowrap text-sm font-semibold">
                          {formatMoney(line.unitPrice * line.quantity)}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            aria-label={`Decrease ${line.name}`}
                            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)]"
                            onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">{line.quantity}</span>
                          <button
                            aria-label={`Increase ${line.name}`}
                            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)]"
                            onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          className="inline-flex items-center gap-1 text-xs font-semibold text-orange"
                          onClick={() => removeLine(line.lineId)}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-12 text-center text-sm text-brown">Your cart is empty.</p>
              )}

              {checkoutOpen && !submitted && lines.length > 0 && (
                <form
                  className="mt-6 space-y-4 rounded-md bg-white p-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <p className="font-display text-lg font-semibold">Pickup Details</p>
                  <input
                    required
                    placeholder="Name"
                    className="w-full rounded-sm border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-orange"
                  />
                  <input
                    required
                    placeholder="Phone"
                    type="tel"
                    className="w-full rounded-sm border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-orange"
                  />
                  <select className="w-full rounded-sm border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-orange">
                    {pickupTimes.map((time) => (
                      <option key={time}>{time}</option>
                    ))}
                  </select>
                  <select className="w-full rounded-sm border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-orange">
                    <option>Pay in store</option>
                    <option>Card on pickup</option>
                  </select>
                  <button className="btn-primary w-full py-3 font-semibold">Review Order</button>
                </form>
              )}
            </div>

            {!submitted && (
              <div className="border-t border-[var(--line)] px-6 py-5">
                <div className="mb-4 flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatMoney(subtotal)}</span>
                </div>
                <button
                  className="btn-primary w-full py-3.5 font-semibold disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={!lines.length}
                  onClick={() => setCheckoutOpen(true)}
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
