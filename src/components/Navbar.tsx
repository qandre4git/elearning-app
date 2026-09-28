import Link from "next/link";
import { getCurrentUser } from "@/lib/actions";
import { UserSwitcher } from "./UserSwitcher";
import { GraduationCap, BookOpen, LayoutDashboard, Award, Sparkles } from "lucide-react";

export async function Navbar() {
  const user = await getCurrentUser();
  const isInstructor = user?.role === "INSTRUCTOR" || user?.email === "helena@elearning.com";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
              EduFlow
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/50">
              LMS
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            href="/courses"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Catálogo</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Meu Aprendizado</span>
          </Link>
          <Link
            href="/certificates"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
          >
            <Award className="w-4 h-4" />
            <span>Certificados</span>
          </Link>
          {isInstructor && (
            <Link
              href="/instructor"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 font-semibold hover:bg-purple-100 transition-colors ml-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Painel Instrutor</span>
            </Link>
          )}
        </nav>

        {/* Right side actions / User switcher */}
        <div className="flex items-center gap-3">
          <UserSwitcher currentUser={user} />
          {user?.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 object-cover hidden sm:block"
            />
          )}
        </div>
      </div>
    </header>
  );
}
