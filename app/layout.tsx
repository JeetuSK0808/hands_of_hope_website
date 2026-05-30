import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/site/nav-bar";
import { Chatbot } from "@/components/site/chatbot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Hands of Hope · Compassion in action",
  description:
    "Hands of Hope is a 501(c)(3) student-led nonprofit connecting high school students with the communities just outside their classroom, through chapters, STEM Buddies, and the annual Awards Ceremony.",
  metadataBase: new URL("https://www.handsofhope-outreach.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Chatbot />
      </body>
    </html>
  );
}
