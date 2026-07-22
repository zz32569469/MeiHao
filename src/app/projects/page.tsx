const projects = [
  {
    title: "專案名稱一",
    description: "一到兩句話描述這個專案在做什麼、你負責的部分、用了什麼技術。",
    tags: ["Unity", "C#"],
    link: "https://github.com/your-username/your-repo",
  },
  {
    title: "專案名稱二",
    description: "同上，換一個專案。",
    tags: ["TypeScript", "React"],
    link: "https://github.com/your-username/your-repo",
  },
];

export default function Projects() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-24">
      <h1 className="font-serif text-3xl font-bold tracking-wide">作品集</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-3 border-2 border-line bg-surface p-5 hover:border-accent"
          >
            <h2 className="font-serif font-bold text-ink">{project.title}</h2>
            <p className="text-sm text-muted">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-line font-mono text-xs tracking-wide text-muted uppercase px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
