import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions";
import { formatPrice, formatDuration, formatLevel } from "@/lib/utils";
import { EnrollButton } from "@/components/EnrollButton";
import {
  BookOpen,
  Clock,
  Award,
  ChevronLeft,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  PlayCircle,
  HelpCircle,
} from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      instructor: true,
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
          quizzes: true,
        },
      },
      enrollments: user ? { where: { userId: user.id } } : false,
    },
  });

  if (!course) {
    notFound();
  }

  const isEnrolled = course.enrollments && course.enrollments.length > 0;

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );

  const totalDuration = course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0),
    0
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Top Breadcrumb & Hero */}
      <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar ao Catálogo</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {course.category && (
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                    {course.category.name}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                  Nível {formatLevel(course.level)}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {course.shortDescription || course.description}
              </p>

              {/* Instructor info */}
              <div className="flex items-center gap-3 pt-2">
                {course.instructor.avatarUrl ? (
                  <img
                    src={course.instructor.avatarUrl}
                    alt={course.instructor.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {course.instructor.name.charAt(0)}
                  </div>
                )}
                <div>
                  <span className="text-xs text-slate-400 block">Criado por</span>
                  <span className="text-sm font-semibold text-white">
                    {course.instructor.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Sticky Card / Purchase Box (4 cols) */}
            <div className="lg:col-span-4 bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:bg-slate-900 dark:text-white dark:border-slate-800">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                <img
                  src={
                    course.thumbnail ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-medium">Preço</span>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {formatPrice(course.price)}
                  </span>
                </div>

                <EnrollButton
                  courseId={course.id}
                  courseSlug={course.slug}
                  isEnrolled={Boolean(isEnrolled)}
                  price={course.price}
                />

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{totalLessons} aulas gravadas em alta definição</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{formatDuration(totalDuration)} de carga horária total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Certificado de conclusão com código de validação</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Acesso vitalício e suporte a dúvidas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Detailed Description */}
          <div className="space-y-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Sobre o Curso
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* Curriculum */}
          <div className="space-y-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Grade Curricular
              </h2>
              <span className="text-xs text-slate-500">
                {course.modules.length} módulos • {totalLessons} aulas
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {course.modules.map((mod, index) => (
                <div
                  key={mod.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
                        Módulo {index + 1}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {mod.title}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      {mod.lessons.length} aulas
                    </span>
                  </div>

                  <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="py-2.5 px-3 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <PlayCircle className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        <span className="text-slate-400 font-mono">
                          {formatDuration(lesson.durationMinutes)}
                        </span>
                      </div>
                    ))}

                    {mod.quizzes.length > 0 && (
                      <div className="py-2.5 px-3 flex items-center justify-between text-xs text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold">
                            Quiz: {mod.quizzes[0].title}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold">Avaliação</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Bio */}
          <div className="space-y-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Instrutor(a)
            </h2>
            <div className="flex items-start gap-4">
              {course.instructor.avatarUrl && (
                <img
                  src={course.instructor.avatarUrl}
                  alt={course.instructor.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              )}
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {course.instructor.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {course.instructor.bio || "Instrutor especialista na área de tecnologia e desenvolvimento de produtos digitais."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
