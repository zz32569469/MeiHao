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
        <h1 className="text-3xl font-bold tracking-tight">關於我</h1>
        <p className="mt-4 max-w-2xl text-neutral-300">
          在這裡寫一段自我介紹：背景、興趣、目前在做的事、想找的機會等等。
          兩到三句話即可，不用寫成流水帳。
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
          技能
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-neutral-700 px-3 py-1 text-sm text-neutral-200"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
          經歷
        </h2>
        <ul className="mt-4 flex flex-col gap-6">
          {experience.map((item) => (
            <li key={item.title}>
              <p className="text-sm text-neutral-400">{item.period}</p>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-neutral-300">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
