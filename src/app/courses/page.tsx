import Link from "next/link";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/actions";
import { CourseCard } from "@/components/CourseCard";
import { Search, BookOpen } from "lucide-react";

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category, q } = await searchParams;
  const user = await getCurrentUser();

  let sql = `
    SELECT 
      c.id, c.title, c.slug, c.description, c.short_description as "shortDescription",
      c.thumbnail, CAST(c.price AS FLOAT) as price, c.level, c.created_at,
      cat.name as category_name, cat.slug as category_slug,
      u.name as instructor_name, u.avatar_url as instructor_avatar
    FROM courses c
    LEFT JOIN categories cat ON c.category_id = cat.id
    JOIN users u ON c.instructor_id = u.id
    WHERE c.published = true
  `;
  const params: any[] = [];

  if (category) {
    params.push(category);
    sql += ` AND cat.slug = $${params.length}`;
  }

  if (q) {
    params.push(`%${q}%`);
    sql += ` AND (c.title ILIKE $${params.length} OR c.description ILIKE $${params.length})`;
  }

  sql += ` ORDER BY c.created_at DESC`;

  const [coursesRes, categoriesRes] = await Promise.all([
    pool.query(sql, params),
    pool.query("SELECT id, name, slug FROM categories ORDER BY name ASC"),
  ]);

  // Busca aulas de cada curso
  const lessonsRes = await pool.query(`
    SELECT m.course_id, l.id as lesson_id, l.duration_minutes
    FROM lessons l
    JOIN modules m ON l.module_id = m.id
  `);

  const lessonsByCourse: Record<string, { id: string; durationMinutes: number }[]> = {};
  lessonsRes.rows.forEach((row) => {
    if (!lessonsByCourse[row.course_id]) {
      lessonsByCourse[row.course_id] = [];
    }
    lessonsByCourse[row.course_id].push({
      id: row.lesson_id,
      durationMinutes: row.duration_minutes,
    });
  });

  const courses = coursesRes.rows.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    shortDescription: c.shortDescription,
    thumbnail: c.thumbnail,
    price: c.price,
    level: c.level,
    category: c.category_name ? { name: c.category_name, slug: c.category_slug } : null,
    instructor: {
      name: c.instructor_name,
      avatarUrl: c.instructor_avatar,
    },
    modules: [
      {
        lessons: lessonsByCourse[c.id] || [],
      },
    ],
  }));

  // Busca matrículas do usuário
  let userEnrollments: { course_id: string; completed_at: Date | null }[] = [];
  let completedLessonIds = new Set<string>();

  if (user) {
    const enrRes = await pool.query(
      "SELECT course_id, completed_at FROM enrollments WHERE user_id = $1",
      [user.id]
    );
    userEnrollments = enrRes.rows;

    const prgRes = await pool.query(
      "SELECT lesson_id FROM lesson_progress WHERE user_id = $1 AND completed = true",
      [user.id]
    );
    completedLessonIds = new Set(prgRes.rows.map((r) => r.lesson_id));
  }

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
          {categoriesRes.rows.map((cat) => (
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
            const enrollment = userEnrollments.find((e) => e.course_id === course.id);

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
                completedAt: enrollment.completed_at,
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
