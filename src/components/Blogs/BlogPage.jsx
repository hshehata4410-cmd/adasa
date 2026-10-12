import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import BlogFilters from './BlogFilters';
import ViewToggle from './ViewToggle';
import BlogList from './BlogList';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import {
  PAGE_SIZE,
  extractArticles,
  filterArticles,
  getCategories,
  normalizeArticle,
} from './blogUtils';

// Same file the rest of the app loads (public/Data/posts.json).
const DATA_URL = '/Data/posts.json';

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | error | ready
  const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  // The URL (?category=...) is the single source of truth for the category filter.
  const category = searchParams.get('category') || '';
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const listTopRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(DATA_URL)
      .then((res) => {
        if (cancelled) return;
        setArticles(extractArticles(res.data).map(normalizeArticle));
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => getCategories(articles), [articles]);
  // Ignore unknown categories in the URL once the data has loaded.
  const activeCategory =
    categories.length === 0 || categories.includes(category) ? category : '';
  const filtered = useMemo(() => filterArticles(articles, query, activeCategory), [articles, query, activeCategory]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasActiveFilters = Boolean(query.trim() || activeCategory);

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
  };
  const updateCategory = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('category', value);
    else next.delete('category');
    setSearchParams(next, { replace: true });
  };
  const handleCategoryChange = (value) => {
    updateCategory(value);
    setPage(1);
  };
  const handleClear = () => {
    setQuery('');
    updateCategory('');
    setPage(1);
  };
  const handlePageChange = (next) => {
    setPage(next);
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section dir="rtl" className="bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <header className="mb-10">
          <span className="inline-flex items-center rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-500">
            المدونة
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">مقالات مختارة</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base">
            نصائح وأدلة عملية في التصوير الفوتوغرافي، من الإضاءة والتكوين إلى أسرار المحترفين.
          </p>
        </header>

        <BlogFilters
          query={query}
          onQueryChange={handleQueryChange}
          category={activeCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          onClear={handleClear}
        />

        <div ref={listTopRef} className="mt-8 scroll-mt-24">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm text-neutral-400" aria-live="polite">
              {filtered.length} مقال
              {hasActiveFilters && (
                <span className="text-neutral-600"> من أصل {articles.length}</span>
              )}
            </p>
            <ViewToggle view={view} onChange={setView} />
          </div>

          {status === 'loading' ? (
            <p className="py-16 text-center text-neutral-400" role="status">
              جاري تحميل المقالات...
            </p>
          ) : status === 'error' ? (
            <p className="py-16 text-center text-neutral-400" role="alert">
              تعذّر تحميل المقالات. تأكد من وجود الملف {DATA_URL} ثم أعد تحميل الصفحة.
            </p>
          ) : visible.length > 0 ? (
            <>
              <BlogList articles={visible} view={view} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyState hasActiveFilters={hasActiveFilters} onClear={handleClear} />
          )}
        </div>
      </div>
    </section>
  );
}
