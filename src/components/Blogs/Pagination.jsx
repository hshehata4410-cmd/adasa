import { getPageNumbers } from './blogUtils';

const btn =
  'flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="التنقل بين الصفحات" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btn} gap-1.5 border-white/10 bg-[#151515] text-neutral-300 hover:border-orange-500/50 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-neutral-300`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
        السابق
      </button>

      {getPageNumbers(currentPage, totalPages).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className="px-1 text-neutral-600" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-label={`الصفحة ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`${btn} ${
              p === currentPage
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-white/10 bg-[#151515] text-neutral-300 hover:border-orange-500/50 hover:text-orange-500'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btn} gap-1.5 border-white/10 bg-[#151515] text-neutral-300 hover:border-orange-500/50 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-neutral-300`}
      >
        التالي
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 6-6 6 6 6" />
        </svg>
      </button>
    </nav>
  );
}
