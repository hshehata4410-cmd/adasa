import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCamera, FaArrowLeft, FaChevronLeft } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

// صورة المقال: لو مفيش صورة أو فشل تحميلها تظهر خلفية بديلة بأيقونة كاميرا
function PostImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-4xl text-orange-500/60">
        <FaCamera />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  );
}

// صورة الكاتب: لو فشلت تظهر أول حرف من الاسم
function Avatar({ src, name }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-400">
        {name?.charAt(0) || "؟"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-9 w-9 rounded-full object-cover"
    />
  );
}

// تاريخ بالعربي، مثال: ٨ يناير ٢٠٢٦
const formatDate = (date) =>
  new Date(date).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function LatestPosts({
  posts = [],
  loading,
  error,
  onRetry,
  start = 3,
  limit = 3,
}) {
  // أحدث المقالات حسب التاريخ
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(start, start + limit);

  return (
    <section dir="rtl" className="mx-auto max-w-[944px] px-4 pb-20 pt-6 text-white">
      {/* ===== رأس القسم ===== */}
      <div className="mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-1.5 text-[11px] font-bold text-orange-400">
          الأحدث
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          <span className="h-1 w-1 rounded-full bg-orange-500/40" />
        </span>

        <h2 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
          أحدث المقالات
        </h2>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-400">محتوى جديد طازج من المطبعة</p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 transition hover:text-orange-400"
          >
            <FaArrowLeft className="text-[10px]" />
            عرض جميع المقالات
          </Link>
        </div>
      </div>

      {/* ===== حالة التحميل ===== */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-3xl border border-white/10 bg-[#141414]"
            >
              <div className="h-40 bg-white/5" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-1/3 rounded bg-white/10" />
                <div className="h-5 w-4/5 rounded bg-white/10" />
                <div className="h-4 w-full rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== حالة الخطأ ===== */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <p className="mb-4 text-red-300">{error}</p>
          <button
            onClick={onRetry}
            className="rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* ===== الكروت ===== */}
      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-[#141414] transition hover:-translate-y-1 hover:border-orange-500/40"
            >
              <Link to={`/blogs/${post.slug}`} className="block">
                {/* الصورة + التصنيف */}
                <div className="relative h-40 overflow-hidden bg-neutral-900">
                  <PostImage src={post.image} alt={post.title} />
                  <span className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 text-[11px] font-bold text-white">
                    {post.category}
                  </span>
                </div>

                <div className="p-5">
                  {/* وقت القراءة + التاريخ */}
                  <div className="mb-3 flex items-center gap-2 text-[11px] text-gray-500">
                    <FiClock className="text-xs" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{formatDate(post.date)}</span>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-base font-bold leading-7">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-6 text-gray-400">
                    {post.excerpt}
                  </p>

                  {/* الكاتب + زر السهم */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={post.author?.avatar} name={post.author?.name} />
                      <div className="leading-tight">
                        <p className="text-xs font-bold">{post.author?.name}</p>
                        <p className="mt-1 text-[10px] text-gray-500">
                          {post.author?.role}
                        </p>
                      </div>
                    </div>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-[10px] text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                      <FaChevronLeft />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default LatestPosts;