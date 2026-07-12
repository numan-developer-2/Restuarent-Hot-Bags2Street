"use client";

import { CalendarDays, Clock, Leaf, Star } from "lucide-react";

export function StorySections() {
  const reservationFieldClass =
    "mt-2 w-full rounded-md border border-white/20 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-brown/55 focus:border-orange focus:ring-2 focus:ring-orange/35";

  return (
    <>
      <section className="bg-ink py-24 text-white md:py-32">
        <div className="shell">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Why Choose Us</h2>
          </div>
          <div className="mx-auto mt-14 grid max-w-5xl gap-10 text-center md:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "Baked Fresh Daily",
                text: "Hand-rolled bagels are kettle-boiled and baked fresh throughout the morning."
              },
              {
                icon: Leaf,
                title: "Fresh Ingredients",
                text: "Produce, spreads, cheeses, and salads are prepared with a clean deli-style rhythm."
              },
              {
                icon: CalendarDays,
                title: "Fast Pickup",
                text: "Customize your order, choose pickup timing, and skip the counter wait."
              }
            ].map((item) => (
              <div key={item.title}>
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-orange/15 text-orange">
                  <item.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="shell grid gap-14 py-24 md:grid-cols-2 md:items-center md:py-32">
        <div className="h-[420px] overflow-hidden rounded-md">
          <img
            src="https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=1200&auto=format&fit=crop"
            alt="Warm bakery interior"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-orange">
            Our Story
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
            A neighborhood bakery, one bagel at a time
          </h2>
          <p className="mt-5 leading-7 text-brown">
            Hot Bagels 2nd Street started with a simple promise: bake it fresh, serve it warm,
            and treat every customer like a regular. The ordering experience keeps that same
            neighborhood care, now with a faster modern pickup flow.
          </p>
        </div>
      </section>

      <section id="gallery" className="bg-cream/60 py-24 md:py-32">
        <div className="shell">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Gallery</h2>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1584367369853-8b966cf0d6a3?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop"
            ].map((src, index) => (
              <div
                key={src}
                className={`overflow-hidden rounded-md ${index % 3 === 0 ? "row-span-2 h-full min-h-80" : "h-40"}`}
              >
                <img src={src} alt="Hot Bagels food and bakery detail" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="shell py-24 md:py-32">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Customer Reviews</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            ["Dana R.", "Best bagels in town. The everything bagel with lox is unreal."],
            ["Marcus T.", "The Mediterranean toast is worth the trip alone."],
            ["Priya S.", "Every salad option I wanted was there. Pickup was ready on time."]
          ].map(([name, text]) => (
            <article key={name} className="rounded-md bg-cream p-7">
              <div className="flex gap-1 text-orange" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={`${name}-star-${index}`} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/80">{text}</p>
              <p className="mt-4 text-sm font-semibold">- {name}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="reserve" className="scroll-mt-24 bg-green py-20 text-white md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Book a Table</h2>
          <p className="mt-4 text-white/75">Prefer to sit in? Reserve a table and we will have it ready.</p>
          <form
            className="mx-auto mt-10 grid max-w-3xl gap-5 text-left sm:grid-cols-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="block text-sm font-medium text-white/85">
              Date
              <input type="date" required className={reservationFieldClass} />
            </label>
            <label className="block text-sm font-medium text-white/85">
              Time
              <input type="time" required className={reservationFieldClass} />
            </label>
            <label className="block text-sm font-medium text-white/85">
              Guests
              <input type="number" min={1} defaultValue={2} required className={reservationFieldClass} />
            </label>
            <label className="block text-sm font-medium text-white/85">
              Name
              <input type="text" required placeholder="Your name" className={reservationFieldClass} />
            </label>
            <label className="block text-sm font-medium text-white/85 sm:col-span-2">
              Phone
              <input type="tel" required placeholder="Phone number" className={reservationFieldClass} />
            </label>
            <button className="btn-primary mt-1 py-3.5 font-semibold sm:col-span-2">Reserve</button>
          </form>
        </div>
      </section>
    </>
  );
}
