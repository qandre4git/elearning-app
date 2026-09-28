import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduFlow | Plataforma de E-Learning Moderna",
  description: "Aprenda tecnologia, design e inteligência artificial com cursos práticos, quizzes interativos e certificados verificados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} EduFlow LMS. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <span className="text-slate-400">Next.js 15 • TypeScript • Tailwind CSS • Prisma ORM</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
