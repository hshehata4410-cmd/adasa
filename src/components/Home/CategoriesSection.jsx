import { Link } from "react-router-dom";
import { FaLightbulb, FaUser, FaMountain, FaCog } from "react-icons/fa";
import { FiSliders, FiFolder } from "react-icons/fi";

// الأيقونة لكل تصنيف (حسب الاسم). أي تصنيف جديد يأخذ أيقونة المجلد.
const ICONS = {
  "إضاءة": <FaLightbulb />,
  "بورتريه": <FaUser />,
  "مناظر طبيعية": <FaMountain />,
  "تقنيات": <FiSliders />,
  "معدات": <FaCog />,
};

export default function CategoriesSection({ posts = [], categories = [] }) {
  if (!posts.length) return null;

  // العدد محسوب من المقالات الفعلية، والترتيب من قائمة التصنيفات في الـ JSON
  const names = categories.length
    ? categories.map((c) => c.name)
    : [...new Set(posts.map((p) => p.category))];

  const items = names
    .map((name) => ({
      name,
      count: posts.filter((p) => p.category === name).length,
    }))
    .filter((item) => item.count > 0);

  return (
    <section dir="rtl" className="bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <header className="mb-12 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-500">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            التصنيفات
          </span>
          <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl">استكشف حسب الموضوع</h2>
          <p className="mt-3 text-sm text-neutral-400 sm:text-base">
            اعثر على محتوى مصمم حسب اهتماماتك
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <li key={item.name}>
              <Link
                to={`/blogs?category=${encodeURIComponent(item.name)}`}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#141414] p-5 transition duration-300 hover:border-orange-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-lg text-orange-500 transition group-hover:bg-orange-500/20">
                  {ICONS[item.name] || <FiFolder />}
                </span>
                <span className="mt-6 text-base font-bold text-white">{item.name}</span>
                <span className="mt-1 text-xs text-neutral-500">{item.count} مقالة</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}