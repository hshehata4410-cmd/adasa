const base =
  'flex h-10 w-10 items-center justify-center rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40';

export default function ViewToggle({ view, onChange }) {
  const cls = (active) =>
    `${base} ${active ? 'bg-orange-500 text-white' : 'text-neutral-400 hover:text-white'}`;

  return (
    <div
      role="group"
      aria-label="طريقة عرض المقالات"
      className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#151515] p-1"
    >
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-pressed={view === 'grid'}
        aria-label="عرض شبكي"
        title="عرض شبكي"
        className={cls(view === 'grid')}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
        aria-label="عرض قائمة"
        title="عرض قائمة"
        className={cls(view === 'list')}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
