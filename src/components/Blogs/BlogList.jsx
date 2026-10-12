import BlogCard from './BlogCard';

export default function BlogList({ articles, view }) {
  const layout =
    view === 'list' ? 'flex flex-col gap-6' : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <ul className={layout}>
      {articles.map((article) => (
        <li key={article.id} className="min-w-0">
          <BlogCard article={article} view={view} />
        </li>
      ))}
    </ul>
  );
}
