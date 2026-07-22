const skills = ["C#", "Unity", "JavaScript / TypeScript", "React / Next.js", "Git"];

const experience = [
  {
    period: "2024 - 現在",
    title: "職稱 / 專案名稱",
    detail: "簡短描述你在這段期間做了什麼、負責什麼。",
  },
];

export default function About() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-24">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-wide">關於我</h1>
        <p className="mt-4 max-w-2xl text-muted">
          在這裡寫一段自我介紹：背景、興趣、目前在做的事、想找的機會等等。
          兩到三句話即可，不用寫成流水帳。
        </p>
      </div>

      <div>
        <h2 className="font-mono text-xs font-bold tracking-wide text-accent uppercase">
          技能
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="border-2 border-line bg-surface px-3 py-1 text-sm text-ink"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-mono text-xs font-bold tracking-wide text-accent uppercase">
          經歷
        </h2>
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
    </section>
  );
}
