import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blogPosts';

export const metadata: Metadata = {
  title: 'Beauty Guides & Style Tips',
  description:
    'Practical guides on face shape, hairstyles, glasses and color—written to help you get more from our free tools.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  return (
    <section className="blogsec">
      <div className="wrap">
        <h1>Beauty Guides &amp; Style Tips</h1>
        <p className="sub">
          Practical, no-nonsense guides that turn face shape, color and body data into choices you can actually make—haircuts, glasses,
          and outfits that fit.
        </p>
        <div className="bloggrid">
          {BLOG_POSTS.map((p) => (
            <a className="blogcard" href={`/blog/${p.slug}`} key={p.slug}>
              <div className="blogmeta">
                <span className="blogcat">{p.category}</span>
                <span className="blogtime">{p.readMinutes} min read</span>
              </div>
              <div className="blogt">{p.title}</div>
              <div className="blogx">{p.excerpt}</div>
              <div className="bloggo">Read guide →</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
