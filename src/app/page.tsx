import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions";
import { CourseCard } from "@/components/CourseCard";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  CheckCircle,
  Play,
  TrendingUp,
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  const [courses, categories, totalStudents, userEnrollments] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      include: {
        category: true,
        instructor: {
          select: { name: true, avatarUrl: true },
        },
        modules: {
          include: {
            lessons: {
              select: { id: true, durationMinutes: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
    prisma.enrollment.count(),
    user
      ? prisma.enrollment.findMany({
          where: { userId: user.id },
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: { select: { id: true } },
                  },
                },
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  // Busca o progresso das aulas do usuário atual
  const userProgress = user
    ? await prisma.lessonProgress.findMany({
        where: { userId: user.id, completed: true },
        select: { lessonId: true },
      })
    : [];

  const completedLessonIds = new Set(userProgress.map((p) => p.lessonId));

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-950 pt-16 pb-20 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Educação Prática e Direta ao Ponto</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Aprenda as habilidades mais valorizadas com{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              cursos imersivos
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Plataforma completa de aprendizado com aulas interativas, quizzes de
            fixação em tempo real, suporte a dúvidas e emissão de certificados
            oficiais.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/courses"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:scale-105 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explorar Todos os Cursos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 transition-all"
            >
              <Play className="w-4 h-4 text-indigo-600" />
              <span>Meu Painel de Estudos</span>
            </Link>
          </div>

          {/* Social Proof & Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-slate-200/80 dark:border-slate-800 max-w-4xl mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                100%
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Prático & Direto</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {courses.length}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Cursos Especializados</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Instantâneo
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Certificado Verificado</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                24/7
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Acesso Ilimitado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Destaques da Plataforma</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
              Cursos Mais Populares
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Comece hoje mesmo a transformar sua carreira com conteúdos atualizados.
            </p>
          </div>

          <Link
            href="/courses"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Ver todo o catálogo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const enrollment = userEnrollments.find(
              (e) => e.courseId === course.id
            );

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
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-indigo-900 text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-800/80 flex items-center justify-center text-indigo-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Trilhas Estruturadas</h3>
              <p className="text-sm text-indigo-200 leading-relaxed">
                Aulas passo a passo divididas em módulos lógicos, do básico ao
                avançado, com código-fonte e projetos reais.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-800/80 flex items-center justify-center text-indigo-300">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Quizzes e Validações</h3>
              <p className="text-sm text-indigo-200 leading-relaxed">
                Avalie sua retenção de conteúdo com testes interativos e
                feedbacks instantâneos sobre cada resposta.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-800/80 flex items-center justify-center text-indigo-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Comunidade & Fórum</h3>
              <p className="text-sm text-indigo-200 leading-relaxed">
                Tire dúvidas diretamente com os instrutores em cada aula e
                aprenda com as perguntas de outros alunos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
