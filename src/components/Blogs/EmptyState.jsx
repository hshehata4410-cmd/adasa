export default function EmptyState({ hasActiveFilters, onClear }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-[#111] px-6 py-16 text-center">
      <svg className="h-12 w-12 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5M8.5 11h5" />
      </svg>
      <h2 className="mt-5 text-xl font-bold text-white">
        {hasActiveFilters ? 'لا توجد مقالات مطابقة' : 'لا توجد مقالات حالياً'}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-7 text-neutral-400">
        {hasActiveFilters
          ? 'جرّب كلمات بحث مختلفة أو اختر تصنيفاً آخر.'
          : 'ستظهر المقالات هنا فور إضافتها.'}
      </p>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          مسح البحث والفلاتر
        </button>
      )}
    </div>
  );
}
