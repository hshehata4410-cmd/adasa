import { Link } from "react-router-dom";
import { FaCamera, FaHome, FaArrowLeft } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <section dir="rtl" className="relative overflow-hidden bg-[#0a0a0a] text-white">
      {/* نمط الشبكة */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* توهج لوني خفيف */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-1.5 text-xs text-orange-100">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          خطأ 404
        </span>

        {/* الرقم 404 مع عدسة بدل الصفر */}
        <div
          dir="ltr"
          className="flex items-center justify-center gap-3 text-[96px] font-extrabold leading-none text-amber-500 sm:text-[140px]"
          aria-hidden="true"
        >
          <span>4</span>
          <span className="flex h-[1em] w-[1em] items-center justify-center rounded-full border-4 border-orange-500/60 bg-orange-500/10 text-[0.45em] text-orange-500">
            <FaCamera />
          </span>
          <span>4</span>
        </div>

        <h1 className="mt-8 text-3xl font-extrabold sm:text-4xl">الصفحة غير موجودة</h1>
        <p className="mt-4 max-w-md text-sm leading-8 text-gray-400 sm:text-base">
          يبدو أن اللقطة التي تبحث عنها خرجت عن الإطار. ربما تم نقل الصفحة أو أن الرابط غير صحيح.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-orange-600 to-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            <FaHome className="text-base" />
            العودة للرئيسية
          </Link>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white transition hover:border-orange-500/50 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
          >
            تصفح المقالات
            <FaArrowLeft className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}