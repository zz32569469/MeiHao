import Image from "next/image";
import PlumBlossomMark from "@/components/PlumBlossomMark";

type Project = {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  demo?: string;
  github?: string;
  itch?: string;
};

// 還沒有能公開的作品，先留空。要加作品時往這個陣列 push 一筆即可。
const projects: Project[] = [];

const linkFields: { key: keyof Project; label: string }[] = [
  { key: "demo", label: "DEMO" },
  { key: "github", label: "GITHUB" },
  { key: "itch", label: "ITCH.IO" },
];

export default function Projects() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-24">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-wide">作品集</h1>
        <p className="mt-2 text-sm text-muted">
          把 <code>image</code> 欄位指到 <code>public/projects/</code> 底下的圖片檔就會換成真的封面圖，沒填會顯示佔位框。
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border-2 border-dashed border-line px-6 py-16 text-center">
          <PlumBlossomMark className="opacity-60" />
          <p className="font-serif text-lg font-bold text-ink">作品還在路上</p>
          <p className="max-w-sm text-sm text-muted">目前還沒有能公開的作品，之後會陸續放上來。</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="flex flex-col gap-3 border-2 border-line bg-surface p-5"
            >
              {project.image ? (
                <div className="relative aspect-video w-full overflow-hidden border-2 border-line">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-line text-muted">
                  <PlumBlossomMark className="opacity-60" />
                  <span className="font-mono text-[0.65rem] tracking-wide uppercase">
                    封面圖 / GIF
                  </span>
                </div>
              )}

              <h2 className="font-serif font-bold text-ink">{project.title}</h2>
              <p className="text-sm text-muted">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-line px-2 py-0.5 font-mono text-xs tracking-wide text-muted uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs tracking-wide">
                {linkFields.map(({ key, label }) => {
                  const href = project[key];
                  if (typeof href !== "string") return null;
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-strong"
                    >
                      [ {label} ]
                    </a>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
