export default function BlogFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
  hasActiveFilters,
  onClear,
}) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-3 md:flex-row md:items-center"
    >
      {/* Search */}
      <div className="relative flex-1">
        <label htmlFor="blog-search" className="sr-only">
          ابحث في المقالات
        </label>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="blog-search"
          type="text"
          inputMode="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="ابحث عن مقال..."
          className="h-12 w-full rounded-xl border border-white/10 bg-[#151515] pr-12 pl-4 text-sm text-white placeholder:text-neutral-500 transition focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        />
      </div>

      {/* Category dropdown */}
      <div className="relative md:w-60">
        <label htmlFor="blog-category" className="sr-only">
          تصفية حسب التصنيف
        </label>
        <select
          id="blog-category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#151515] pr-4 pl-10 text-sm text-white transition [color-scheme:dark] focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        >
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {/* Clear */}
      <button
        type="button"
        onClick={onClear}
        disabled={!hasActiveFilters}
        className="h-12 rounded-xl border border-white/10 px-5 text-sm font-semibold text-neutral-300 transition hover:border-orange-500/50 hover:text-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-neutral-300"
      >
        مسح الفلاتر
      </button>
    </form>
  );
}
