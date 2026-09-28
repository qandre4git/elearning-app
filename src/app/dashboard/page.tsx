import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions";
import { CourseCard } from "@/components/CourseCard";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold">Faça login para acessar seu painel</h2>
      </div>
    );
  }

  // Busca matrículas do aluno com cursos, módulos e aulas
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          category: true,
          instructor: { select: { name: true, avatarUrl: true } },
          modules: {
            include: {
              lessons: { select: { id: true, durationMinutes: true } },
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const progressList = await prisma.lessonProgress.findMany({
    where: { userId: user.id, completed: true },
    include: {
      lesson: { select: { id: true, durationMinutes: true } },
    },
  });

  const certificatesCount = await prisma.certificate.count({
    where: { userId: user.id },
  });

  const completedLessonIds = new Set(progressList.map((p) => p.lessonId));
  const totalMinutesStudied = progressList.reduce(
    (acc, p) => acc + p.lesson.durationMinutes,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-8 rounded-3xl shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Área do Estudante</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Olá, {user.name}! 👋
          </h1>
          <p className="text-indigo-200 text-sm max-w-lg">
            Acompanhe seu avanço, continue suas aulas de onde parou e conquiste novos certificados.
          </p>
        </div>

        <Link
          href="/courses"
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-950 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all"
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Explorar Mais Cursos</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {enrollments.length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Cursos Matriculados</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {progressList.length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Aulas Concluídas</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatDuration(totalMinutesStudied)}
            </div>
            <div className="text-xs text-slate-500 font-medium">Tempo de Estudo</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {certificatesCount}
            </div>
            <div className="text-xs text-slate-500 font-medium">Certificados</div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Meus Cursos em Andamento
          </h2>
          <span className="text-xs text-slate-400">
            {enrollments.length} {enrollments.length === 1 ? "curso" : "cursos"}
          </span>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Você ainda não está matriculado em nenhum curso
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Navegue pelo nosso catálogo e comece a aprender agora mesmo.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <span>Ver Catálogo de Cursos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enr) => {
              const allLessons = enr.course.modules.flatMap((m) => m.lessons);
              const completedCount = allLessons.filter((l) =>
                completedLessonIds.has(l.id)
              ).length;
              const totalLessonsCount = allLessons.length;
              const progressPercentage =
                totalLessonsCount > 0
                  ? Math.round((completedCount / totalLessonsCount) * 100)
                  : 0;

              const enrollmentInfo = {
                completedAt: enr.completedAt,
                completedLessonsCount: completedCount,
                totalLessonsCount,
                progressPercentage,
              };

              return (
                <CourseCard
                  key={enr.course.id}
                  course={enr.course}
                  enrollment={enrollmentInfo}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
