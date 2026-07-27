import VisitorCounter from "./VisitorCounter";

// Email 只顯示地址，不做 mailto 連結（避免點到就開啟郵件軟體）
const EMAIL = "zz32569469@gmail.com";

const links = [{ label: "GITHUB", href: "https://github.com/zz32569469" }];

export default function Footer() {
  return (
    <footer className="border-t-2 border-line bg-bg">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} MeihAO
        </p>
        <VisitorCounter />
        <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs tracking-wide">
          <li className="text-muted">
            [ EMAIL ] <span className="select-all text-ink">{EMAIL}</span>
          </li>
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
