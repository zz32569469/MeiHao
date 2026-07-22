import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-24">
      <Link
        href="/blog"
        className="w-fit font-mono text-xs tracking-wide text-accent hover:text-accent-strong"
      >
        ← 回開發紀錄
      </Link>
      <div>
        <p className="font-mono text-xs text-muted">{post.date}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-wide">
          {post.title}
        </h1>
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
      </div>
      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
