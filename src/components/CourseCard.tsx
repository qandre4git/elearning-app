import Link from "next/link";
import { formatPrice, formatDuration } from "@/lib/utils";
import { BookOpen, Clock, CheckCircle2, PlayCircle } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string | null;
    thumbnail: string | null;
    price: number;
    level: string;
    category?: { name: string; slug: string } | null;
    instructor: {
      name: string;
      avatarUrl: string | null;
    };
    modules: {
      lessons: {
        id: string;
        durationMinutes: number;
      }[];
    }[];
  };
  enrollment?: {
    completedAt: Date | null;
    completedLessonsCount: number;
    totalLessonsCount: number;
    progressPercentage: number;
  } | null;
}

export function CourseCard({ course, enrollment }: CourseCardProps) {
  const totalLessons =
    enrollment?.totalLessonsCount ??
    course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const totalDuration = course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0),
    0
  );

  const levelLabels: Record<string, { label: string; color: string }> = {
    BEGINNER: { label: "Iniciante", color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300" },
    INTERMEDIATE: { label: "Intermediário", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300" },
    ADVANCED: { label: "Avançado", color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300" },
  };

  const levelInfo = levelLabels[course.level] || levelLabels.BEGINNER;

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={
            course.thumbnail ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
          }
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {course.category && (
            <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white">
              {course.category.name}
            </span>
          )}
          <span className={`rounded-lg border px-2 py-0.5 text-xs font-semibold backdrop-blur-md ${levelInfo.color}`}>
            {levelInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {course.shortDescription || "Aprenda na prática com aulas dinâmicas e materiais complementares."}
        </p>

        {/* Instructor */}
        <div className="mt-4 flex items-center gap-2.5">
          {course.instructor.avatarUrl ? (
            <img
              src={course.instructor.avatarUrl}
              alt={course.instructor.name}
              className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              {course.instructor.name.charAt(0)}
            </div>
          )}
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {course.instructor.name}
          </span>
        </div>

        {/* Meta Stats */}
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span>{totalLessons} aulas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>{formatDuration(totalDuration)}</span>
          </div>
        </div>

        {/* Enrollment Progress or Price Call to Action */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
          {enrollment ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {enrollment.completedAt ? "Concluído" : "Seu Progresso"}
                </span>
                <span className="font-bold text-indigo-600">
                  {enrollment.progressPercentage}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${enrollment.progressPercentage}%` }}
                />
              </div>

              <Link
                href={`/courses/${course.slug}/learn`}
                className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                {enrollment.completedAt ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Rever Aulas</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Continuar Aprendendo</span>
                  </>
                )}
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 block">Investimento</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {formatPrice(course.price)}
                </span>
              </div>

              <Link
                href={`/courses/${course.slug}`}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-indigo-500 dark:hover:text-white transition-colors"
              >
                Conhecer Curso
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
