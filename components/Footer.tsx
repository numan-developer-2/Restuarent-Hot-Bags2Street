import { ExternalLink, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

const quickLinks = [
  ["Menu", "#menu"],
  ["Our Story", "#story"],
  ["Gallery", "#gallery"],
  ["Reviews", "#reviews"],
  ["Reservations", "#reserve"]
];

const hours = [
  ["Mon - Fri", "6:00 AM - 6:00 PM"],
  ["Saturday", "7:00 AM - 5:00 PM"],
  ["Sunday", "7:00 AM - 3:00 PM"]
];

export function Footer() {
  return (
    <footer className="bg-[#1f1f1f] py-16 text-white">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.75fr_1.2fr_1.1fr]">
          <div>
            <p className="font-display text-2xl font-bold">HOT BAGELS</p>
            <p className="mt-6 max-w-xs text-sm leading-7 text-white/75">
              Freshly baked bagels and gourmet sandwiches since 2004.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Quick Links</h3>
            <nav className="mt-6 grid gap-3 text-sm text-white/75">
              {quickLinks.map(([label, href]) => (
                <a key={label} href={href} className="transition hover:text-orange">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Contact</h3>
            <div className="mt-6 grid gap-4 text-sm text-white/75">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-orange" size={18} />
                <span>123 2nd Street, New York, NY 10001</span>
              </p>
              <a className="flex items-center gap-3 transition hover:text-orange" href="tel:+15551234567">
                <Phone className="shrink-0 text-orange" size={18} />
                <span>(555) 123-4567</span>
              </a>
              <a
                className="flex items-center gap-3 transition hover:text-orange"
                href="mailto:hello@hotbagels.com"
              >
                <Mail className="shrink-0 text-orange" size={18} />
                <span>hello@hotbagels.com</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Hours</h3>
            <div className="mt-6 grid gap-3 text-sm text-white/75">
              {hours.map(([day, time]) => (
                <div key={day} className="grid grid-cols-[90px_1fr] gap-4">
                  <span>{day}</span>
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-md border border-white/10">
          <iframe
            title="Hot Bagels map location"
            src="https://www.google.com/maps?q=123%202nd%20Street%2C%20New%20York%2C%20NY%2010001&output=embed"
            className="h-72 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Hot Bagels 2nd Street. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#menu" aria-label="Open menu" className="transition hover:text-orange">
              <ExternalLink size={19} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="transition hover:text-orange">
              <Facebook size={19} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="transition hover:text-orange">
              <Instagram size={19} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="transition hover:text-orange">
              <Twitter size={19} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
