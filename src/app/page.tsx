import Image from "next/image";
import PlumBlossomMark from "@/components/PlumBlossomMark";
import GameShowcase from "@/components/games/GameShowcase";
import { BASE_PATH } from "@/lib/site-config";

type Project = {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  demo?: string;
  github?: string;
  itch?: string;
};

const experience = [
  {
    period: "2024 - 現在",
    title: "職稱 / 專案名稱",
    detail: "簡短描述你在這段期間做了什麼、負責什麼。",
  },
];

// 還沒有能公開的作品，先留空。要加作品時往這個陣列 push 一筆即可。
const projects: Project[] = [];

const linkFields: { key: keyof Project; label: string }[] = [
  { key: "demo", label: "DEMO" },
  { key: "github", label: "GITHUB" },
  { key: "itch", label: "ITCH.IO" },
];

export default function Home() {
  return (
    <>
      <section
        id="home"
        className="mx-auto flex max-w-3xl scroll-mt-20 flex-col gap-8 px-6 py-24 sm:flex-row sm:items-start"
      >
        <div className="relative h-24 w-24 flex-none overflow-hidden border-[3px] border-accent sm:h-28 sm:w-28">
          <Image src={`${BASE_PATH}/avatar.jpg`} alt="陳梅豪" fill className="object-cover" />
        </div>

        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 border-2 border-accent px-2.5 py-1 font-mono text-xs tracking-wide text-accent uppercase before:h-1.5 before:w-1.5 before:bg-status before:content-['']">
            STATUS · 你好，我是
          </span>
          <h1 className="font-serif text-4xl font-bold tracking-wide sm:text-5xl">
            陳梅豪
          </h1>
          <p className="max-w-xl text-lg text-muted">
            一句話介紹自己在做什麼，例如：軟體工程師，專注於遊戲開發與互動體驗。
          </p>
          <div className="flex gap-4 pt-4">
            <a
              href="#projects"
              className="border-2 border-accent bg-accent px-5 py-2.5 text-sm font-bold text-on-accent hover:bg-accent-strong hover:border-accent-strong"
            >
              看作品集
            </a>
            <a
              href="#about"
              className="border-2 border-accent px-5 py-2.5 text-sm font-bold text-accent hover:bg-surface"
            >
              關於我
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-20 border-t-2 border-line bg-surface">
        <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-24">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-wide">關於我</h2>
            <p className="mt-4 max-w-2xl text-muted">
              在這裡寫一段自我介紹：背景、興趣、目前在做的事、想找的機會等等。
              兩到三句話即可，不用寫成流水帳。
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold tracking-wide text-accent uppercase">
              經歷
            </h3>
            <ul className="mt-4 flex flex-col gap-6 border-l-2 border-line pl-5">
              {experience.map((item) => (
                <li key={item.title}>
                  <p className="font-mono text-xs text-muted">{item.period}</p>
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="text-sm text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="projects" className="scroll-mt-20 border-t-2 border-line">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-24">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-wide">作品集</h2>
            <p className="mt-2 text-sm text-muted">
              把 <code>image</code> 欄位指到 <code>public/projects/</code> 底下的圖片檔就會換成真的封面圖，沒填會顯示佔位框。
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <article
                key={project.title}
                className="flex flex-col gap-3 border-2 border-line bg-surface p-5"
              >
                {project.image ? (
                  <div className="relative aspect-video w-full overflow-hidden border-2 border-line">
                    <Image
                      src={`${BASE_PATH}${project.image}`}
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

                <h3 className="font-serif font-bold text-ink">{project.title}</h3>
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

            <GameShowcase />
          </div>
        </div>
      </section>
    </>
  );
}
