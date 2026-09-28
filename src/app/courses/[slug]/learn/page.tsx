import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions";
import { LessonPlayer } from "@/components/LessonPlayer";

interface LearnPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lessonId?: string;
  }>;
}

export default async function LearnPage({ params, searchParams }: LearnPageProps) {
  const { slug } = await params;
  const { lessonId } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/courses/${slug}`);
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          quizzes: {
            include: {
              questions: {
                orderBy: { order: "asc" },
                include: { options: true },
              },
            },
          },
          lessons: {
            orderBy: { order: "asc" },
            include: {
              progress: {
                where: { userId: user.id },
              },
              comments: {
                include: {
                  user: {
                    select: {
                      name: true,
                      role: true,
                      avatarUrl: true,
                    },
                  },
                },
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Se o aluno ainda não estiver matriculado, matricula automaticamente para facilitar o teste
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (!enrollment) {
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    });
  }

  // Prepara estrutura de dados plana para o Player
  const modulesWithProgress = course.modules.map((m) => ({
    id: m.id,
    title: m.title,
    order: m.order,
    quizzes: m.quizzes,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      videoUrl: l.videoUrl,
      durationMinutes: l.durationMinutes,
      order: l.order,
      completed: l.progress.length > 0 ? l.progress[0].completed : false,
      comments: l.comments,
    })),
  }));

  const allLessons = modulesWithProgress.flatMap((m) => m.lessons);
  const firstIncompleteLesson = allLessons.find((l) => !l.completed);
  const initialLessonId =
    lessonId || firstIncompleteLesson?.id || allLessons[0]?.id || "";

  return (
    <LessonPlayer
      course={{
        id: course.id,
        title: course.title,
        slug: course.slug,
      }}
      modules={modulesWithProgress}
      initialLessonId={initialLessonId}
      currentUser={{
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
      }}
    />
  );
}
