import { useMemo, useState } from "react";
import { FaRegEnvelope, FaCheck } from "react-icons/fa";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function NewsletterSection({ posts = [] }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // صور أول 3 كتّاب من بيانات المقالات الفعلية
  const avatars = useMemo(() => {
    const seen = new Set();
    return posts
      .map((p) => p.author)
      .filter((a) => a?.avatar && !seen.has(a.name) && seen.add(a.name))
      .slice(0, 3);
  }, [posts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("من فضلك أدخل بريداً إلكترونياً صحيحاً");
      return;
    }
    // لا يوجد Backend في المشروع، لذلك الاشتراك هنا يظهر كحالة نجاح فقط
    setError("");
    setSubscribed(true);
  };

  return (
    <section dir="rtl" className="relative overflow-hidden bg-[#0a0a0a] px-4 py-16 text-white sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[28rem] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-[555px] rounded-3xl border border-white/10 bg-[#141414] px-6 py-10 text-center sm:px-10">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 text-lg text-white shadow-lg shadow-orange-500/20">
          <FaRegEnvelope />
        </span>

        <h2 className="mt-6 text-2xl font-extrabold sm:text-3xl">
          اشترك في <span className="text-amber-500">نشرتنا الإخبارية</span>
        </h2>
        <p className="mt-3 text-xs leading-6 text-gray-400 sm:text-sm">
          احصل على نصائح التصوير الحصرية ودروس جديدة مباشرة في بريدك الإلكتروني
        </p>

        {subscribed ? (
          <div
            role="status"
            className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-4 text-sm text-orange-100"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
              <FaCheck />
            </span>
            شكراً لاشتراكك! سنرسل لك أحدث المقالات على بريدك.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mx-auto mt-8 max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                البريد الإلكتروني
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="أدخل بريدك الإلكتروني"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "newsletter-error" : undefined}
                className="h-12 flex-1 rounded-xl border border-white/10 bg-[#0a0a0a] px-4 text-sm text-white placeholder:text-gray-500 transition focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
              <button
                type="submit"
                className="h-12 rounded-xl bg-gradient-to-l from-orange-600 to-orange-500 px-7 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
              >
                اشترك الآن
              </button>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="mt-2 text-start text-xs text-red-400">
                {error}
              </p>
            )}
          </form>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            {avatars.length > 0 && (
              <span className="flex">
                {avatars.map((a) => (
                  <img
                    key={a.name}
                    src={a.avatar}
                    alt=""
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="-mr-2 h-7 w-7 rounded-full border-2 border-[#141414] object-cover first:mr-0"
                  />
                ))}
              </span>
            )}
            <span>
              انضم لـ <b className="text-white">10,000+</b> مصور
            </span>
          </div>
          <span>بدون إزعاج</span>
          <span>إلغاء الاشتراك في أي وقت</span>
        </div>
      </div>
    </section>
  );
}
