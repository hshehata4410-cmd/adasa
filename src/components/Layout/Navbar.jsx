import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navLinks = [
  { label: "الرئيسية", to: "/" },
  { label: "المدونة", to: "/blogs" },
  { label: "من نحن", to: "/about" },
];

function LensIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="9" strokeWidth="2.2" />
      <circle cx="11" cy="11" r="3" />
      <path d="M11 2.500l3.200 5.500M19 7l-6.400 1M19.500 15l-4.800-3.700M11 19.500l-3.200-5.500M3 15l6.400-1M2.500 7l4.800 3.700" />
      <path d="M17 18.500l5 3.500-1.200-5.200z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const desktopLinkClass = ({ isActive }) =>
    `block rounded-full px-5 py-2.5 text-[13px] font-bold leading-none transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-l from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
        : "text-gray-400 hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
      isActive
        ? "bg-gradient-to-l from-orange-500 to-orange-600 text-white"
        : "text-gray-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-t border-white/10 border-b border-b-white/5 bg-[#141414]/95 backdrop-blur"
    >
      <nav
        className="relative mx-auto flex h-[66px] max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="التنقل الرئيسي"
      >
        {/* Logo (right in RTL) */}
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            <LensIcon className="h-10 w-10" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold text-white">عدسة</span>
            <span className="text-[10px] text-orange-500">عالم التصوير الفوتوغرافي</span>
          </span>
        </Link>

        {/* Center pill nav (desktop / tablet) */}
        <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#0d0d0d] p-1.5 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.to === "/"} className={desktopLinkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions (left in RTL) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="بحث"
            className="hidden text-gray-400 transition-colors hover:text-white sm:block"
          >
            <SearchIcon className="h-4 w-4" />
          </button>

          <Link
            to="/blogs"
            className="hidden rounded-full bg-gradient-to-l from-orange-500 to-orange-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-105 sm:inline-block"
          >
            ابدأ القراءة
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="القائمة"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-white/5 bg-[#141414] transition-all duration-300 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={mobileLinkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="pt-2">
            <Link
              to="/blogs"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-gradient-to-l from-orange-500 to-orange-600 px-6 py-3 text-center text-sm font-bold text-white sm:hidden"
            >
              ابدأ القراءة
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
