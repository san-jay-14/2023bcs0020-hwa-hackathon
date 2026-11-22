import type { Metadata, Viewport } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/chrome/Nav";
import { Footer } from "@/components/chrome/Footer";
import { CartDrawer } from "@/components/chrome/CartDrawer";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { Loader } from "@/components/chrome/Loader";
import { Cursor } from "@/components/chrome/Cursor";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "Longshift. One shell. Three Stages. Zero batteries.", template: "%s · Longshift" },
  description:
    "Longshift is a one-piece, chew-safe rubber shell with edible, texture-graded Stage refills. The food sets the pace. No batteries, no moving parts.",
};

export const viewport: Viewport = {
  themeColor: "#0e8a84",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('ls.loaded')==='1')document.documentElement.classList.add('ls-seen')}catch(e){}",
          }}
        />
      </head>
      <body>
        <Loader />
        <SmoothScroll />
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
