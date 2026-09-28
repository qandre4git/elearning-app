import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions";
import { CourseCard } from "@/components/CourseCard";
import { Search, Filter, BookOpen } from "lucide-react";

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category, q } = await searchParams;
  const user = await getCurrentUser();

  const whereClause: any = { published: true };

  if (category) {
    whereClause.category = { slug: category };
  }

  if (q) {
    whereClause.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const [courses, categories, userEnrollments] = await Promise.all([
    prisma.course.findMany({
      where: whereClause,
      include: {
        category: true,
        instructor: { select: { name: true, avatarUrl: true } },
        modules: {
          include: {
            lessons: { select: { id: true, durationMinutes: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
    user
      ? prisma.enrollment.findMany({
          where: { userId: user.id },
          include: {
            course: {
              include: {
                modules: {
                  include: { lessons: { select: { id: true } } },
                },
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const userProgress = user
    ? await prisma.lessonProgress.findMany({
        where: { userId: user.id, completed: true },
        select: { lessonId: true },
      })
    : [];

  const completedLessonIds = new Set(userProgress.map((p) => p.lessonId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Catálogo de Cursos
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore nossa grade de cursos e encontre o próximo passo para sua evolução profissional.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Link
            href="/courses"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              !category
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            Todos os Cursos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.slug}${q ? `&q=${q}` : ""}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat.slug
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Search Form */}
        <form action="/courses" method="GET" className="relative w-full sm:w-72">
          {category && <input type="hidden" name="category" value={category} />}
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Buscar por nome ou assunto..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">
            Nenhum curso encontrado
          </h3>
          <p className="text-xs text-slate-500">
            Tente buscar com outros termos ou selecione outra categoria.
          </p>
          <Link
            href="/courses"
            className="inline-block mt-2 text-xs text-indigo-600 font-semibold hover:underline"
          >
            Limpar filtros
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const enrollment = userEnrollments.find((e) => e.courseId === course.id);

            let enrollmentInfo = null;
            if (enrollment) {
              const allLessons = course.modules.flatMap((m) => m.lessons);
              const completedCount = allLessons.filter((l) =>
                completedLessonIds.has(l.id)
              ).length;
              const totalLessonsCount = allLessons.length;
              const progressPercentage =
                totalLessonsCount > 0
                  ? Math.round((completedCount / totalLessonsCount) * 100)
                  : 0;

              enrollmentInfo = {
                completedAt: enrollment.completedAt,
                completedLessonsCount: completedCount,
                totalLessonsCount,
                progressPercentage,
              };
            }

            return (
              <CourseCard
                key={course.id}
                course={course}
                enrollment={enrollmentInfo}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
