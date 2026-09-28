import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AssessmentProvider } from "@/lib/assessment-context";
import { LanguageProvider } from "@/lib/language-context";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-devanagari",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "SAHAYAK AI — Scheme Matching & Channel Finance Guidance",
  description:
    "AI-driven scheme matching, financial EMI guidance, and operationally eligible Channel Partner routing for Scheduled Caste entrepreneurs and students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoSansDevanagari.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-neutral-950 antialiased font-sans">
        <LanguageProvider>
          <AssessmentProvider>
            <Header />
            <main id="main-content" className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </AssessmentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
