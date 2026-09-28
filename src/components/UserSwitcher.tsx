"use client";

import { useTransition } from "react";
import { switchUser } from "@/lib/actions";
import { User, Shield, GraduationCap } from "lucide-react";

interface UserSwitcherProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string | null;
  } | null;
}

export function UserSwitcher({ currentUser }: UserSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (email: string) => {
    startTransition(async () => {
      await switchUser(email);
    });
  };

  const isInstructor = currentUser?.role === "INSTRUCTOR" || currentUser?.email === "helena@elearning.com";

  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs">
      <span className="text-slate-500 font-medium px-2 hidden sm:inline">Perfil:</span>
      <button
        onClick={() => handleSwitch("lucas@elearning.com")}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
          !isInstructor
            ? "bg-indigo-600 text-white shadow-sm font-semibold"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        }`}
        title="Alternar para visão de Aluno"
      >
        <GraduationCap className="w-3.5 h-3.5" />
        <span>Aluno (Lucas)</span>
      </button>

      <button
        onClick={() => handleSwitch("helena@elearning.com")}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
          isInstructor
            ? "bg-purple-600 text-white shadow-sm font-semibold"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        }`}
        title="Alternar para visão de Instrutora"
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Instrutora (Helena)</span>
      </button>
    </div>
  );
}
