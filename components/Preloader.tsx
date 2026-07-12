"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "hot-bagels-loader-seen";

export function Preloader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = window.sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;

    setVisible(true);
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(STORAGE_KEY, "true");
      setVisible(false);
    }, 760);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] grid place-items-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, visibility: "hidden" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="font-display text-3xl font-bold tracking-wide text-ink"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            HOT BAGELS
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
