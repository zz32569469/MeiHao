import VisitorCounter from "./VisitorCounter";

const links = [
  { label: "EMAIL", href: "mailto:zz32569469@gmail.com" },
  { label: "GITHUB", href: "https://github.com/zz32569469" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-line">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} 陳梅豪
        </p>
        <VisitorCounter />
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
