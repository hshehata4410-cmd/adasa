import { useState } from "react";
import { Link } from "react-router-dom";

const exploreLinks = [
  { label: "الرئيسية", to: "/" },
  { label: "المدونة", to: "/blogs" },
  { label: "من نحن", to: "/about" },
];

const categoryLinks = [
  { label: "إضاءة", to: "/blogs?category=lighting" },
  { label: "بورتريه", to: "/blogs?category=portrait" },
  { label: "مناظر طبيعية", to: "/blogs?category=landscape" },
  { label: "تقنيات", to: "/blogs?category=techniques" },
];

const socials = [
  {
    label: "X",
    href: "https://x.com",
    icon: <path d="M4 4l16 16M20 4L4 20" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 11v5M8 8v.01M12 16v-5M12 13a2 2 0 014 0v3" />
      </>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <path d="M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.2a2.8 2.8 0 00-.8-2.2c2.600-.3 5.300-1.300 5.300-5.800a4.500 4.500 0 00-1.200-3.100 4.200 4.200 0 00-.1-3.100s-1-.3-3.200 1.200a11 11 0 00-5.800 0C6.900 3.200 5.900 3.500 5.900 3.500a4.200 4.200 0 00-.1 3.100A4.500 4.500 0 004.600 9.700c0 4.500 2.700 5.500 5.300 5.800a2.800 2.800 0 00-.8 2.200V21" />
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <>
        <rect x="2.500" y="5" width="19" height="14" rx="4" />
        <path d="M10 9.500v5l4.500-2.500z" />
      </>
    ),
  },
];

const ColumnTitle = ({ children }) => (
  <h3 className="mb-6 flex items-center gap-3 text-sm font-bold text-white">
    <span className="h-0.5 w-6 rounded bg-orange-500" aria-hidden="true" />
    {children}
  </h3>
);

const FooterLinks = ({ links }) => (
  <ul className="space-y-3">
    {links.map((link) => (
      <li key={link.label}>
        <Link
          to={link.to}
          className="text-xs text-gray-500 transition-colors hover:text-orange-500"
        >
          {link.label}
        </Link>
      </li>
    ))}
  </ul>
);

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to your newsletter API
    setEmail("");
  };

  return (
    <footer dir="rtl" className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-5 inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white shadow-lg shadow-orange-500/30">
                ع
              </span>
              <span className="text-base font-bold text-white">عدسة</span>
            </Link>
            <p className="mb-6 max-w-xs text-xs leading-7 text-gray-500">
              مدونة متخصصة في فن التصوير الفوتوغرافي. نشارك معكم أسرار المحترفين ونصائح عملية
              لتطوير مهاراتكم.
            </p>
            <ul className="flex items-center gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-colors hover:border-orange-500/50 hover:text-orange-500"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      {s.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <nav aria-label="استكشف">
            <ColumnTitle>استكشف</ColumnTitle>
            <FooterLinks links={exploreLinks} />
          </nav>

          {/* Categories */}
          <nav aria-label="التصنيفات">
            <ColumnTitle>التصنيفات</ColumnTitle>
            <FooterLinks links={categoryLinks} />
          </nav>

          {/* Newsletter */}
          <div>
            <ColumnTitle>ابق على اطلاع</ColumnTitle>
            <p className="mb-4 text-xs leading-6 text-gray-500">
              اشترك للحصول على أحدث المقالات والتحديثات.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">
                البريد الإلكتروني
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ادخل بريدك الإلكتروني"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-600 outline-none transition-colors focus:border-orange-500/60"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-l from-orange-500 to-orange-600 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.02]"
              >
                اشترك
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-[11px] text-gray-500 sm:px-6 md:flex-row">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} عدسة. صنع بكل
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-orange-500" aria-label="حب">
              <path d="M12 21s-7.500-4.600-9.500-9.200C1.200 8.500 3 5 6.300 5c2 0 3.500 1.100 4.200 2.400h3C14.200 6.100 15.700 5 17.700 5 21 5 22.800 8.500 21.500 11.800 19.500 16.400 12 21 12 21z" />
            </svg>
            جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="transition-colors hover:text-orange-500">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="transition-colors hover:text-orange-500">
              شروط الخدمة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;