import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Blog() {
  const posts = getAllPosts();

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-24">
      <h1 className="font-serif text-3xl font-bold tracking-wide">開發紀錄</h1>
      <ul className="flex flex-col gap-6">
        {posts.map((post) => (
          <li key={post.slug} className="border-2 border-line bg-surface p-5">
            <p className="font-mono text-xs text-muted">{post.date}</p>
            <h2 className="mt-1 font-serif text-lg font-bold text-ink">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                {post.title}
              </Link>
            </h2>
            {post.excerpt ? (
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
            ) : null}
            {post.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-line px-2 py-0.5 font-mono text-xs tracking-wide text-muted uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
