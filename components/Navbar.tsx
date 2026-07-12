"use client";

import { useEffect, useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useCart } from "../store/cart-store";

type NavbarProps = {
  onCartOpen: () => void;
};

export function Navbar({ onCartOpen }: NavbarProps) {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        solid
          ? "border-[var(--line)] bg-bg/95 text-ink backdrop-blur"
          : "border-transparent bg-transparent text-white"
      }`}
    >
      <div className="shell flex h-20 items-center justify-between">
        <a href="#hero" className="font-display text-xl font-bold tracking-wide">
          HOT BAGELS
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#menu">Menu</a>
          <a href="#story">Story</a>
          <a href="#gallery">Gallery</a>
          <a href="#reviews">Reviews</a>
          <a href="#reserve">Reserve</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="#menu" className="btn-primary hidden px-5 py-2.5 text-sm font-semibold sm:inline-flex">
            Order Now
          </a>
          <button
            aria-label="Open cart"
            className="relative grid h-10 w-10 place-items-center"
            onClick={onCartOpen}
          >
            <ShoppingCart size={19} />
            {itemCount > 0 && (
              <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle navigation"
            className="grid h-10 w-10 place-items-center md:hidden"
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-[var(--line)] bg-bg px-6 py-4 text-ink md:hidden">
          <div className="grid gap-4 text-sm font-semibold">
            {["Menu", "Story", "Gallery", "Reviews", "Reserve"].map((label) => (
              <a
                key={label}
                href={`#${label === "Menu" ? "menu" : label.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
            <a className="btn-primary inline-flex w-max px-5 py-2.5" href="#menu">
              Order Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
