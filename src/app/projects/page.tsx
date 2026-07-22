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
      <h1 className="text-3xl font-bold tracking-tight">作品集</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-3 rounded-lg border border-neutral-800 p-5 hover:border-neutral-600"
          >
            <h2 className="font-semibold">{project.title}</h2>
            <p className="text-sm text-neutral-300">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300"
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
