import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaListUl,
  FaCamera,
  FaEnvelope,
  FaTags,
  FaShareAlt,
  FaLinkedinIn,
  FaWhatsapp,
  FaLink,
  FaImages,
  FaArrowLeft,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiChevronLeft, FiCalendar, FiClock } from "react-icons/fi";

// تاريخ كامل بالعربي، مثال: ٨ يناير ٢٠٢٦
const formatDate = (date) =>
  new Date(date).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// تاريخ مختصر، مثال: ٨ يناير
const formatShortDate = (date) =>
  new Date(date).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
  });

// نحوّل نص المقالة إلى: مقدمة + أقسام (كل سطر يبدأ بـ ## هو عنوان قسم)
function parseContent(content = "") {
  const blocks = content.split("\n\n").filter((b) => b.trim());
  const intro = [];
  const sections = [];

  blocks.forEach((block) => {
    if (block.startsWith("## ")) {
      sections.push({ title: block.replace("## ", "").trim(), paragraphs: [] });
    } else if (sections.length === 0) {
      intro.push(block);
    } else {
      sections[sections.length - 1].paragraphs.push(block);
    }
  });

  return { intro, sections };
}

function PostDetails() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [siteInfo, setSiteInfo] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setImageFailed(false);

    axios
      .get("/Data/posts.json")
      .then((response) => {
        const allPosts = response.data.posts;
        const current = allPosts.find((p) => p.slug === slug) || null;

        setPost(current);
        setSiteInfo(response.data.siteInfo);

        // مقالات مقترحة: من نفس التصنيف أولاً ثم باقي المقالات، بحد أقصى 3
        if (current) {
          const sameCategory = allPosts.filter(
            (p) => p.category === current.category && p.id !== current.id
          );
          const others = allPosts.filter(
            (p) => p.category !== current.category && p.id !== current.id
          );
          setRelatedPosts([...sameCategory, ...others].slice(0, 3));
        } else {
          setRelatedPosts([]);
        }
      })
      .catch((err) => {
        console.error("Error loading post:", err);
        setError("تعذّر تحميل المقالة. تأكد من اتصالك وحاول مرة أخرى.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // رجوع لأعلى الصفحة عند فتح مقالة جديدة
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // الانتقال لقسم معين عند الضغط عليه في "محتويات المقال"
  const scrollToSection = (index) => {
    document
      .getElementById(`section-${index}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { intro, sections } = post ? parseContent(post.content) : { intro: [], sections: [] };

  // نسخ رابط المقالة
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // روابط المشاركة
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(post?.title || "");
  const shareLinks = [
    { name: "X", icon: <FaXTwitter />, href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}` },
    { name: "LinkedIn", icon: <FaLinkedinIn />, href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
    { name: "WhatsApp", icon: <FaWhatsapp />, href: `https://wa.me/?text=${shareText}%20${shareUrl}` },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ================= حالات التحميل والخطأ وعدم الوجود ================= */}
      {loading && (
        <div className="mx-auto max-w-[820px] animate-pulse space-y-4 px-6 pt-24">
          <div className="h-8 w-28 rounded-full bg-white/10" />
          <div className="h-12 w-4/5 rounded bg-white/10" />
          <div className="h-12 w-2/3 rounded bg-white/10" />
          <div className="h-20 w-56 rounded-2xl bg-white/5" />
        </div>
      )}

      {!loading && error && (
        <div className="mx-auto max-w-xl px-6 pt-24">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && !post && (
        <div className="mx-auto max-w-xl px-6 pt-24">
          <div className="rounded-2xl border border-white/10 bg-[#141414] p-10 text-center">
            <h1 className="mb-3 text-2xl font-extrabold">المقالة غير موجودة</h1>
            <p className="mb-6 text-sm text-gray-400">
              ربما تم حذف المقالة أو أن الرابط غير صحيح.
            </p>
            <Link
              to="/blogs"
              className="rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              تصفح كل المقالات
            </Link>
          </div>
        </div>
      )}

      {/* ================= المقالة ================= */}
      {!loading && !error && post && (
        <>
          {/* ===== الهيرو ===== */}
          <header className="relative overflow-hidden pb-16 pt-8">
            {/* صورة الخلفية */}
            {post.image && !imageFailed && (
              <img
                src={post.image}
                alt=""
                onError={() => setImageFailed(true)}
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/20" />

            {/* مسار التنقل */}
            <div className="relative mx-auto max-w-[1300px] px-6">
              <nav className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs backdrop-blur">
                <Link to="/" className="text-gray-300 transition hover:text-orange-400">
                  <FaHome />
                </Link>
                <FiChevronLeft className="text-gray-500" />
                <Link to="/blogs" className="font-bold text-gray-300 transition hover:text-orange-400">
                  المدونة
                </Link>
                <FiChevronLeft className="text-gray-500" />
                <span className="font-bold text-orange-500">{post.category}</span>
              </nav>
            </div>

            {/* العنوان والبيانات */}
            <div className="relative mx-auto mt-12 max-w-[820px] px-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="rounded-full bg-orange-500 px-5 py-1.5 text-xs font-bold text-white shadow-lg shadow-orange-500/30">
                  {post.category}
                </span>
                <span className="flex items-center gap-2 text-xs text-gray-400">
                  <FiCalendar />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-2 text-xs text-gray-400">
                  <FiClock />
                  {post.readTime}
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-extrabold leading-[1.5] sm:text-5xl">
                {post.title}
              </h1>

              {/* بطاقة الكاتب */}
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur">
                {post.author?.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-orange-500"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 font-bold text-orange-400 ring-2 ring-orange-500">
                    {post.author?.name?.charAt(0)}
                  </div>
                )}
                <div className="leading-tight">
                  <p className="text-sm font-bold">{post.author?.name}</p>
                  <p className="mt-1 text-xs text-gray-400">{post.author?.role}</p>
                </div>
              </div>
            </div>
          </header>

          {/* ===== المحتوى ===== */}
          <div className="mx-auto grid max-w-[980px] gap-10 px-6 pb-16 lg:grid-cols-[1fr_240px]">
            {/* ---- العمود الرئيسي ---- */}
            <article>
              {/* المقتطف */}
              <blockquote className="rounded-2xl border border-orange-500/25 bg-gradient-to-l from-orange-500/5 to-orange-500/10 px-6 py-5 text-sm italic leading-8 text-gray-200">
                “{post.excerpt}”
              </blockquote>

              {/* المقدمة */}
              <div className="mt-10">
                {intro.map((text, i) => (
                  <p key={i} className="mb-4 text-sm leading-8 text-gray-300">
                    {text}
                  </p>
                ))}
              </div>

              {/* الأقسام */}
              {sections.map((section, index) => (
                <section
                  key={index}
                  id={`section-${index}`}
                  className="mt-10 scroll-mt-24"
                >
                  <h2 className="mb-4 flex items-center gap-3 text-2xl font-extrabold">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 text-base text-orange-500">
                      <FaCamera />
                    </span>
                    {section.title}
                  </h2>
                  {section.paragraphs.map((text, i) => (
                    <p key={i} className="mb-3 text-sm leading-8 text-gray-400">
                      {text}
                    </p>
                  ))}
                </section>
              ))}

              {/* ===== الوسوم + المشاركة + الكاتب ===== */}
              <div className="mt-12 space-y-5">
                {/* الوسوم */}
                {post.tags?.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 text-sm text-orange-500">
                        <FaTags />
                      </span>
                      <h3 className="text-sm font-extrabold">الوسوم</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* شارك المقال */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#141414] p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 text-sm text-orange-500">
                      <FaShareAlt />
                    </span>
                    <h3 className="text-sm font-extrabold">شارك المقال</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {shareLinks.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`مشاركة على ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-gray-400 transition hover:border-orange-500/40 hover:text-orange-400"
                      >
                        {item.icon}
                      </a>
                    ))}
                    <button
                      onClick={copyLink}
                      aria-label="نسخ الرابط"
                      title={copied ? "تم النسخ" : "نسخ الرابط"}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition ${
                        copied
                          ? "border-orange-500/60 bg-orange-500/10 text-orange-400"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-orange-500/40 hover:text-orange-400"
                      }`}
                    >
                      <FaLink />
                    </button>
                  </div>
                </div>

                {/* كاتب المقال */}
                <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-[#141414] p-6">
                  {post.author?.avatar ? (
                    <div className="shrink-0 rounded-2xl border-2 border-orange-500/30 bg-orange-500/10 p-1">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl border-2 border-orange-500/30 bg-orange-500/10 text-2xl font-bold text-orange-400">
                      {post.author?.name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-bold text-orange-500">كاتب المقال</p>
                    <h3 className="mt-1 text-lg font-extrabold">{post.author?.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">{post.author?.role}</p>
                    <p className="mt-3 text-xs leading-6 text-gray-400">
                      مصور محترف شغوف بمشاركة المعرفة والخبرات في عالم التصوير الفوتوغرافي.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* ---- الشريط الجانبي ---- */}
            <aside className="space-y-5 self-start lg:sticky lg:top-24">
              {/* محتويات المقال */}
              {sections.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-[#111] p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-xs font-extrabold">محتويات المقال</h3>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/10 text-xs text-orange-500">
                      <FaListUl />
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {sections.map((section, index) => (
                      <li key={index}>
                        <button
                          onClick={() => scrollToSection(index)}
                          className="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-start text-[11px] text-gray-400 transition hover:text-orange-400"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[10px]">
                            {index + 1}
                          </span>
                          {section.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* تاريخ النشر + وقت القراءة */}
              <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-[#111] p-[18px]">
                <div className="flex h-[92px] flex-col items-center justify-center rounded-2xl bg-[#1a1a1a] px-2 text-center">
                  <FiCalendar className="mb-2 text-base text-orange-500" />
                  <p className="text-[11px] font-bold leading-4">{formatShortDate(post.date)}</p>
                  <p className="mt-1 text-[9px] text-gray-500">تاريخ النشر</p>
                </div>
                <div className="flex h-[92px] flex-col items-center justify-center rounded-2xl bg-[#1a1a1a] px-2 text-center">
                  <FiClock className="mb-2 text-base text-orange-500" />
                  <p className="text-[11px] font-bold leading-4">{post.readTime}</p>
                  <p className="mt-1 text-[9px] text-gray-500">وقت القراءة</p>
                </div>
              </div>

              {/* التواصل */}
              <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/15 to-orange-500/5 p-5 text-center">
                <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/20 text-orange-500">
                  <FaEnvelope />
                </span>
                <h3 className="text-sm font-extrabold">لا تفوت جديدنا</h3>
                <p className="mt-2 text-[11px] leading-6 text-gray-400">
                  اشترك للحصول على أحدث المقالات
                </p>
                {siteInfo?.email && (
                  <a
                    href={`mailto:${siteInfo.email}`}
                    className="mt-4 inline-block rounded-full bg-orange-500 px-5 py-2 text-xs font-bold text-white transition hover:bg-orange-600"
                  >
                    تواصل معنا
                  </a>
                )}
              </div>
            </aside>
          </div>

          {/* ===== مقالات قد تعجبك ===== */}
          {relatedPosts.length > 0 && (
            <section className="mx-auto max-w-[960px] px-6 pb-24">
              <div className="border-t border-white/10 pt-12">

                <div className="mb-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 text-base text-orange-500">
                      <FaImages />
                    </span>
                    <div>
                      <h2 className="text-lg font-extrabold">مقالات قد تعجبك</h2>
                      <p className="mt-1 text-[11px] text-gray-500">
                        استكشف المزيد من المحتوى المميز
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 transition hover:text-orange-400"
                  >
                    <FaArrowLeft className="text-[10px]" />
                    عرض الكل
                  </Link>
                </div>

                {/* الكروت */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((item) => (
                    <Link
                      key={item.id}
                      to={`/blogs/${item.slug}`}
                      className="group relative block h-[238px] overflow-hidden rounded-2xl border border-white/10 bg-[#141414] transition hover:-translate-y-1 hover:border-orange-500/40"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />

                      <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold text-white">
                        {item.category}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="line-clamp-2 text-sm font-bold leading-6">
                          {item.title}
                        </h3>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                          <span className="flex items-center gap-2">
                            {item.author?.avatar ? (
                              <img
                                src={item.author.avatar}
                                alt={item.author.name}
                                className="h-5 w-5 rounded-full object-cover"
                              />
                            ) : (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/20 text-[9px] font-bold text-orange-400">
                                {item.author?.name?.charAt(0)}
                              </span>
                            )}
                            {item.author?.name}
                          </span>
                          <span>{item.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default PostDetails;