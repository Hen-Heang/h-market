export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-white/60 bg-slate-900 text-white"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-semibold text-white">H Market</div>
          <p className="mt-2 text-sm font-medium text-white/85">
            A modern partner and merchant platform built for fast B2B growth.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
            About
          </div>
          <p className="mt-3 text-sm font-medium text-white/85">
            Streamlined onboarding, clean workflows, and shared reporting that keep teams aligned.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
            Contact
          </div>
          <ul className="mt-3 space-y-2 text-sm font-medium text-white/85">
            <li>Phone: +855 12 850 001</li>
            <li>Email: support@h-market.com</li>
            <li>Hours: Mon-Sun, 8am - 9pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs font-medium text-white/70">
        (c) 2026 H-Market. All rights reserved.
      </div>
    </footer>
  );
}
