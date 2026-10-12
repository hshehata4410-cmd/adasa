import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatReadTime, getArticleLink } from './blogUtils';

export default function BlogCard({ article, view = 'grid' }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const isList = view === 'list';

  const { title, description, category, authorName, authorAvatar, image, date, readTime, featured } = article;
  const readTimeText = formatReadTime(readTime);
  const dateText = formatDate(date);

  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-2xl border border-white/10 bg-[#151515] transition duration-300 hover:border-orange-500/40 ${
        isList ? 'flex-col md:flex-row' : 'flex-col'
      }`}
    >
      {/* Image */}
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-[#1d1d1d] ${
          isList ? 'md:aspect-auto md:min-h-[240px] md:w-5/12 md:shrink-0' : ''
        }`}
      >
        {image && !imageFailed ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-600" role="img" aria-label={title}>
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
          </div>
        )}
        {featured && (
          <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
            ★ مميز
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {(category || readTimeText) && (
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            {category && (
              <span className="rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 font-semibold text-orange-500">
                {category}
              </span>
            )}
            {readTimeText && (
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {readTimeText}
              </span>
            )}
          </div>
        )}

        <h2 className={`font-extrabold leading-snug text-white ${isList ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
          {/* after:inset-0 stretches this link over the whole card */}
          <Link
            to={getArticleLink(article)}
            className="line-clamp-2 transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-orange-500 focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-orange-500/60 focus-visible:after:rounded-2xl"
          >
            {title}
          </Link>
        </h2>

        {description && (
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-neutral-400">{description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          {authorName ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                {authorAvatar && !avatarFailed ? (
                  <img
                    src={authorAvatar}
                    alt=""
                    loading="lazy"
                    onError={() => setAvatarFailed(true)}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#262626] text-sm font-bold text-neutral-300" aria-hidden="true">
                    {authorName.charAt(0)}
                  </span>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#151515] bg-orange-500" aria-hidden="true" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">{authorName}</p>
                {dateText && <p className="mt-0.5 text-xs text-neutral-500">{dateText}</p>}
              </div>
            </div>
          ) : (
            <span className="text-xs text-neutral-500">{dateText}</span>
          )}

          <span className="flex items-center gap-1.5 text-xs font-bold text-orange-500" aria-hidden="true">
            اقرأ المقال
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m6-6-6 6 6 6" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
