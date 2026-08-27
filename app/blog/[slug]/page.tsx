import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getPost } from '@/lib/blogPosts';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="postsec">
      <div className="postwrap">
        <div className="posttop">
          <span className="blogcat">{post.category}</span>
          <span className="blogtime">
            {post.readMinutes} min read · {post.publishedAt}
          </span>
        </div>
        <h1 className="posttitle">{post.title}</h1>
        <div className="postbody">
          {post.blocks.map((b, i) => {
            if (b.type === 'p') return <p key={i}>{b.text}</p>;
            if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>;
            if (b.type === 'h3') return <h3 key={i}>{b.text}</h3>;
            if (b.type === 'ul')
              return (
                <ul key={i}>
                  {b.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              );
            if (b.type === 'tip') return <div className="posttip" key={i}>{b.text}</div>;
            return null;
          })}
        </div>

        <div className="postcta">
          <h3>Try it yourself</h3>
          <div className="postctagrid">
            {post.relatedTools.map((t) => (
              <a className="postctacard" href={t.href} key={t.href}>
                {t.label} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
