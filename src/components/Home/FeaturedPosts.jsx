import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BlogCard from "../Blogs/BlogCard";
import { extractArticles, normalizeArticle } from "../Blogs/blogUtils";

const DATA_URL = "/Data/posts.json";
const FEATURED_COUNT = 3;

export default function FeaturedPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(DATA_URL)
      .then((res) => {
        if (cancelled) return;
        const all = extractArticles(res.data).map(normalizeArticle);
        const featured = all.filter((p) => p.featured);
        // If nothing is marked featured, fall back to the latest posts.
        setPosts((featured.length ? featured : all).slice(0, FEATURED_COUNT));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <section dir="rtl" className="bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-500">
              مميز
            </span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">مقالات مختارة</h2>
            <p className="mt-3 text-sm text-neutral-400 sm:text-base">
              محتوى منتقى لبدء رحلة تعلمك
            </p>
          </div>
          <Link
            to="/blogs"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            عرض الكل
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 6-6 6 6 6" />
            </svg>
          </Link>
        </header>

        <ul className="flex flex-col gap-6">
          {posts.map((post) => (
            <li key={post.id}>
              <BlogCard article={post} view="list" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}