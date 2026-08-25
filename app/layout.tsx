import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khaoniew Thai Bistro | Thajská restaurace Brno",
  description: "Rodinné thajské bistro na Zemědělské v Brně. Tradiční recepty, polední menu, thajské kari, nudle a rýže.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="cs"><body>{children}</body></html>;
}
