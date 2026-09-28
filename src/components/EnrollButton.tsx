"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollInCourse } from "@/lib/actions";
import { CheckCircle2, PlayCircle, Loader2 } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
  price: number;
}

export function EnrollButton({
  courseId,
  courseSlug,
  isEnrolled,
  price,
}: EnrollButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    startTransition(async () => {
      await enrollInCourse(courseId);
      router.push(`/courses/${courseSlug}/learn`);
    });
  };

  if (isEnrolled) {
    return (
      <button
        onClick={() => router.push(`/courses/${courseSlug}/learn`)}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
      >
        <PlayCircle className="w-5 h-5" />
        <span>Continuar Estudando</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
    >
      {isPending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processando Matrícula...</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          <span>Matricular-se {price > 0 ? "Agora" : "Gratuitamente"}</span>
        </>
      )}
    </button>
  );
}
