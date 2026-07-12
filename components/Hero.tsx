"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <header id="hero" className="relative h-screen min-h-[640px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=85&w=2200&auto=format&fit=crop"
        alt="Fresh baked sesame and poppy bagels"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/65" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 text-xs uppercase tracking-[0.25em] text-white/90 md:text-sm"
        >
          Hot Bagels 2nd Street
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-5xl font-bold leading-[1.05] md:text-7xl"
        >
          Freshly Baked
          <br />
          Every Morning
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-base text-white/85 md:text-lg"
        >
          Artisan bagels, gourmet sandwiches, and fresh coffee crafted with care. Order online for
          pickup and taste the difference.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#menu" className="btn-primary px-8 py-3.5 font-semibold">
            Order Now
          </a>
          <a href="#menu" className="btn-ghost px-8 py-3.5 font-semibold text-white">
            View Menu
          </a>
        </motion.div>
      </div>
      <a
        href="#signature"
        aria-label="Scroll to signature bagels"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-white/75 md:block"
      >
        <span className="block h-9 w-5 rounded-full border border-current">
          <span className="mx-auto mt-2 block h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      </a>
    </header>
  );
}
