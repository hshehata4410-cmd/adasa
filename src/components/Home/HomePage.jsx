import FeaturedPosts from "./FeaturedPosts";
import CategoriesSection from "./CategoriesSection";
import NewsletterSection from "./NewsletterSection";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaNewspaper,
  FaUsers,
  FaFolderOpen,
  FaPenNib,
  FaArrowLeft,
} from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import LatestPosts from "./LatestPosts";

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get("/Data/posts.json")
      .then((response) => {
        setPosts(response.data.posts);
        setCategories(response.data.categories);
        setSiteInfo(response.data.siteInfo);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setError("تعذّر تحميل البيانات. تأكد من اتصالك وحاول مرة أخرى.");
      })
      .finally(() => setLoading(false));
  }, [reloadKey]);

  // إحصائيات محسوبة من البيانات الفعلية
  const authorsCount = new Set(posts.map((p) => p.author?.name)).size;

  const stats = [
    { label: "مقالة", value: `${posts.length}+`, icon: <FaNewspaper /> },
    { label: "قارئ", value: "+10", unit: "ألف", icon: <FaUsers /> },
    { label: "تصنيفات", value: `${categories.length}`, icon: <FaFolderOpen /> },
    { label: "كاتب", value: `${authorsCount}`, icon: <FaPenNib /> },
  ];

  const siteName = siteInfo?.name || "عدسة";

  return (
    <div dir="rtl" className="bg-[#0a0a0a] text-white">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden">
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
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-[-10%] h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-16 pt-8 text-center sm:pt-12">
          {/* شارة ترحيبية */}
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-1.5 text-xs text-orange-100">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            مرحباً بك في {siteName}
          </span>

          {/* العنوان */}
          <h1 className="text-4xl font-extrabold leading-[1.4] sm:text-6xl">
            اكتشف <span className="text-amber-400">فن</span>
            <br />
            التصوير الفوتوغرافي
          </h1>

          {/* الوصف */}
          <p className="mt-6 max-w-xl text-base leading-8 text-gray-400 sm:text-lg">
            {siteInfo?.description ||
              "انغمس في أسرار المحترفين ونصائح عملية لتطوير مهاراتك في التصوير."}
          </p>

          {/* الأزرار */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-orange-600 to-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:scale-105"
            >
              استكشف المقالات
              <FaArrowLeft className="text-xs" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white transition hover:border-orange-500/50 hover:bg-white/5"
            >
              <FiInfo className="text-base" />
              اعرف المزيد
            </Link>
          </div>

          {/* بطاقات الإحصائيات */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex h-[95px] w-[calc(50%-0.5rem)] flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-[#141414]/90 sm:w-[125px]"
              >
                <span className="text-xl text-orange-500">{stat.icon}</span>
                <span className="flex items-baseline gap-1 text-2xl font-extrabold leading-none text-amber-500">
                  {stat.unit && <span>{stat.unit}</span>}
                  <span dir="ltr">{loading || error ? "—" : stat.value}</span>
                </span>
                <span className="text-[11px] text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= مقالات مختارة ================= */}
      <FeaturedPosts />

      {/* ================= التصنيفات ================= */}
      <CategoriesSection posts={posts} categories={categories} />

      {/* ================= أحدث المقالات ================= */}
      <LatestPosts
        posts={posts}
        categories={categories}
        tagline={siteInfo?.tagline}
        loading={loading}
        error={error}
        onRetry={() => setReloadKey((k) => k + 1)}
      />

      {/* ================= النشرة الإخبارية ================= */}
      <NewsletterSection posts={posts} />
    </div>
  );
}

export default Home;