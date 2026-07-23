import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_TC } from "next/font/google";
import Script from "next/script";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PetalField from "@/components/PetalField";
import { BASE_PATH, SITE_URL } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  weight: ["500", "700", "900"],
  subsets: ["latin"],
});

const title = "MeihAO | Personal Site";
const description = "個人作品集與自我介紹";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: `${BASE_PATH}/icon`,
  },
  openGraph: {
    title,
    description,
    url: `${BASE_PATH}/`,
    siteName: "MeihAO",
    images: [`${BASE_PATH}/og`],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${BASE_PATH}/og`],
  },
};

const themeInitScript = `
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifTC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <PetalField />
      </body>
    </html>
  );
}
