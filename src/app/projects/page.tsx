import Image from "next/image";
import FlameMark from "@/components/FlameMark";

type Project = {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  demo?: string;
  github?: string;
  itch?: string;
};

const projects: Project[] = [
  {
    title: "專案名稱一",
    description: "一到兩句話描述這個專案在做什麼、你負責的部分、用了什麼技術。",
    tags: ["Unity", "C#"],
    demo: "https://your-username.itch.io/your-game",
    github: "https://github.com/your-username/your-repo",
    itch: "https://your-username.itch.io/your-game",
  },
  {
    title: "專案名稱二",
    description: "同上，換一個專案。",
    tags: ["TypeScript", "React"],
    demo: "https://your-project.example.com",
    github: "https://github.com/your-username/your-repo",
  },
];

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
                <FlameMark className="h-7 w-5 opacity-60" />
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
    </section>
  );
}
