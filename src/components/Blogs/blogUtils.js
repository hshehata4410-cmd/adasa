// All JSON-shape assumptions live in this file.
// If your JSON uses different field names, only edit normalizeArticle().

export const PAGE_SIZE = 6;

// Change this if your details route differs (e.g. `/blogs/${slug}` or `/article/${id}`).
export const getArticleLink = (article) => `/blogs/${encodeURIComponent(article.slug)}`;

/** Accepts [..] or { blogs|articles|posts|data: [..] } */
export function extractArticles(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object') return [];
  const known = raw.blogs ?? raw.articles ?? raw.posts ?? raw.data;
  if (Array.isArray(known)) return known;
  return Object.values(raw).find(Array.isArray) ?? [];
}

const pick = (...values) => values.find((v) => v !== undefined && v !== null && v !== '');

export function normalizeArticle(a = {}, index = 0) {
  const author = a.author;
  const category = a.category;
  const id = pick(a.id, a.slug, index);

  return {
    id,
    slug: String(pick(a.slug, a.id, index)),
    title: String(pick(a.title, a.name, '') ?? ''),
    description: String(pick(a.description, a.excerpt, a.summary, '') ?? ''),
    content: typeof a.content === 'string' ? a.content : '',
    category:
      typeof category === 'object' && category
        ? pick(category.name, category.title, category.label) ?? ''
        : category ?? '',
    authorName:
      typeof author === 'string'
        ? author
        : pick(author?.name, a.authorName, '') ?? '',
    authorAvatar: pick(author?.avatar, author?.image, author?.photo, a.authorAvatar, a.authorImage) ?? '',
    image: pick(a.image, a.cover, a.coverImage, a.thumbnail, a.img) ?? '',
    date: pick(a.date, a.publishedAt, a.publishDate, a.createdAt) ?? '',
    readTime: pick(a.readTime, a.readingTime, a.read_time) ?? '',
    featured: Boolean(pick(a.featured, a.isFeatured, false)),
  };
}

/** Lowercase + strip Arabic diacritics/tatweel so search is forgiving. */
export function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/ى/g, 'ي')
    .trim();
}

export function getCategories(articles) {
  return [...new Set(articles.map((a) => a.category).filter(Boolean))];
}

export function filterArticles(articles, query, category) {
  const q = normalizeText(query);
  return articles.filter((a) => {
    if (category && a.category !== category) return false;
    if (!q) return true;
    return [a.title, a.description, a.content].some((field) => normalizeText(field).includes(q));
  });
}

/** [1, null, 4, 5, 6, null, 12] — null = ellipsis */
export function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

export function formatReadTime(value) {
  if (value === '' || value == null) return '';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value); // already text, e.g. "6 دقائق للقراءة"
  if (n === 1) return 'دقيقة واحدة للقراءة';
  if (n === 2) return 'دقيقتان للقراءة';
  return `${n} ${n >= 3 && n <= 10 ? 'دقائق' : 'دقيقة'} للقراءة`;
}