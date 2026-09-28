import Link from "next/link";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/actions";
import { CreateCourseForm } from "@/components/CreateCourseForm";
import { formatPrice, formatLevel } from "@/lib/utils";
import {
  Users,
  BookOpen,
  DollarSign,
  ExternalLink,
  Award,
  Sparkles,
} from "lucide-react";

export default async function InstructorPage() {
  const user = await getCurrentUser();

  const [coursesRes, categoriesRes, enrollmentsRes, attemptsRes] = await Promise.all([
    pool.query(`
      SELECT 
        c.id, c.title, c.slug, CAST(c.price AS FLOAT) as price, c.level, c.thumbnail,
        cat.name as category_name,
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT l.id) as total_lessons
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN modules m ON c.id = m.course_id
      LEFT JOIN lessons l ON m.id = l.module_id
      GROUP BY c.id, c.title, c.slug, c.price, c.level, c.thumbnail, cat.name
      ORDER BY c.created_at DESC
    `),
    pool.query("SELECT id, name FROM categories ORDER BY name ASC"),
    pool.query(`
      SELECT CAST(c.price AS FLOAT) as price
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
    `),
    pool.query("SELECT COUNT(*) as count FROM quiz_attempts"),
  ]);

  const totalRevenue = enrollmentsRes.rows.reduce(
    (acc, row) => acc + (row.price || 0),
    0
  );

  const totalEnrollmentsCount = enrollmentsRes.rows.length;
  const totalAttemptsCount = Number(attemptsRes.rows[0]?.count || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Gestão e Ensino • PostgreSQL</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Painel do Instrutor
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gerencie seus cursos, crie novos conteúdos e analise as métricas de retenção e faturamento.
          </p>
        </div>

        <CreateCourseForm categories={categoriesRes.rows} />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalEnrollmentsCount}
            </div>
            <div className="text-xs text-slate-500 font-medium">Alunos Matriculados</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {coursesRes.rows.length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Cursos Ativos</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatPrice(totalRevenue)}
            </div>
            <div className="text-xs text-slate-500 font-medium">Receita Estimada</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalAttemptsCount}
            </div>
            <div className="text-xs text-slate-500 font-medium">Quizzes Realizados</div>
          </div>
        </div>
      </div>

      {/* Courses Management Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Grade de Cursos Publicados
          </h2>
          <span className="text-xs text-slate-400">
            {coursesRes.rows.length} cursos cadastrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Curso</th>
                <th className="px-6 py-3.5 font-semibold">Categoria</th>
                <th className="px-6 py-3.5 font-semibold">Preço</th>
                <th className="px-6 py-3.5 font-semibold">Aulas</th>
                <th className="px-6 py-3.5 font-semibold">Alunos</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {coursesRes.rows.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          course.thumbnail ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
                        }
                        alt={course.title}
                        className="w-12 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm block">
                          {course.title}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Nível {formatLevel(course.level)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {course.category_name || "Geral"}
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {formatPrice(course.price)}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {course.total_lessons} aulas
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-indigo-600">
                      <Users className="w-3.5 h-3.5" />
                      {course.total_enrollments}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Publicado
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                    >
                      <span>Acessar</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
