import type { Metadata } from "next";
import { IBM_Plex_Sans, Roboto } from "next/font/google";
import "@styles/styles.scss";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: [
    "cyrillic-ext",
    "cyrillic",
    "greek-ext",
    "greek",
    "vietnamese",
    "latin-ext",
    "latin",
  ],
  display: "swap",
  variable: "--font-roboto",
});

// 16x16   → browser tab
// 32x32   → bookmarks
// 48x48   → Windows
// 180x180 → iOS (Apple)
// 192x192 → Android
// 512x512 → PWA / install

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${roboto.className}`}>{children}</body>
    </html>
  );
}
