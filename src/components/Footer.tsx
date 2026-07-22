const links = [
  { label: "EMAIL", href: "mailto:you@example.com" },
  { label: "GITHUB", href: "https://github.com/your-username" },
  { label: "ITCH.IO", href: "https://your-username.itch.io" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-line">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} 你的名字
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs tracking-wide">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-accent hover:text-accent-strong"
              >
                [ {link.label} ]
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
