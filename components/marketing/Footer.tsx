export default function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="text-lg font-semibold">H-Market</div>
          <p className="mt-2 text-sm text-white/85">
            Partner & Merchant platform for modern B2B buying and selling.
          </p>
        </div>

        <div>
          <div className="text-lg font-semibold">About Us</div>
          <p className="mt-3 text-sm text-white/85">
            Built for modern operations: fast onboarding, role-based access, and clean workflows.
          </p>
        </div>

        <div>
          <div className="text-lg font-semibold">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>Phone: +855 12 850 001</li>
            <li>Email: support@h-market.com</li>
            <li>Hours: Mon-Sun, 8am - 9pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15 py-4 text-center text-xs text-white/80">
        © 2026 H-Market. All rights reserved.
      </div>
    </footer>
  );
}
