"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("elearning_user_email")?.value || "lucas@elearning.com";

  let user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    user = await prisma.user.findFirst();
  }

  return user;
}

export async function switchUser(email: string) {
  const cookieStore = await cookies();
  cookieStore.set("elearning_user_email", email, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });
  revalidatePath("/");
  return { success: true };
}

export async function enrollInCourse(courseId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado");

  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
  });

  if (!existing) {
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId,
      },
    });
  }

  revalidatePath(`/courses`);
  revalidatePath(`/dashboard`);
  return { success: true };
}

export async function toggleLessonProgress(lessonId: string, completed: boolean) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado");

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
    },
    create: {
      userId: user.id,
      lessonId,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  // Checa se o curso foi 100% concluído para gerar certificado automático
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: {
            include: {
              modules: {
                include: {
                  lessons: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (lesson) {
    const course = lesson.module.course;
    const allCourseLessons = course.modules.flatMap((m) => m.lessons);
    const completedProgresses = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        lessonId: { in: allCourseLessons.map((l) => l.id) },
        completed: true,
      },
    });

    const isCourseFinished = completedProgresses.length >= allCourseLessons.length;

    if (isCourseFinished) {
      await prisma.enrollment.updateMany({
        where: { userId: user.id, courseId: course.id },
        data: { completedAt: new Date() },
      });

      // Gera certificado se ainda não existir
      const existingCert = await prisma.certificate.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      });

      if (!existingCert) {
        const code = `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        await prisma.certificate.create({
          data: {
            code,
            userId: user.id,
            courseId: course.id,
          },
        });
      }
    }

    revalidatePath(`/courses/${course.slug}/learn`);
    revalidatePath(`/dashboard`);
  }

  return { success: true };
}

export async function addComment(lessonId: string, content: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado");

  if (!content.trim()) {
    throw new Error("Comentário não pode ser vazio");
  }

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      lessonId,
      userId: user.id,
    },
    include: {
      user: {
        select: {
          name: true,
          role: true,
          avatarUrl: true,
        },
      },
    },
  });

  return { success: true, comment };
}

export async function submitQuizAttempt(quizId: string, score: number, passed: boolean) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado");

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId,
      userId: user.id,
      score,
      passed,
    },
  });

  return { success: true, attempt };
}

export async function createNewCourse(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const price = parseFloat((formData.get("price") as string) || "0");
  const level = (formData.get("level") as string) || "BEGINNER";
  const thumbnail =
    (formData.get("thumbnail") as string) ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80";

  const slug =
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.floor(Math.random() * 1000);

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      description,
      price,
      level,
      thumbnail,
      published: true,
      categoryId: categoryId || undefined,
      instructorId: user.id,
      modules: {
        create: [
          {
            title: "Módulo 1: Introdução ao Curso",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Boas-vindas e Visão Geral",
                  description: "Apresentação dos tópicos e objetivos de aprendizado.",
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  durationMinutes: 10,
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  revalidatePath("/courses");
  revalidatePath("/instructor");
  return { success: true, courseId: course.id, slug: course.slug };
}

export async function generateSampleCertificate(courseId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado");

  // Marca todas as aulas do curso como concluídas para o usuário
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  if (!course) throw new Error("Curso não encontrado");

  // Garante matrícula
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    update: { completedAt: new Date() },
    create: {
      userId: user.id,
      courseId: course.id,
      completedAt: new Date(),
    },
  });

  const allLessons = course.modules.flatMap((m) => m.lessons);
  for (const lesson of allLessons) {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lesson.id,
        },
      },
      update: { completed: true, completedAt: new Date() },
      create: {
        userId: user.id,
        lessonId: lesson.id,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  // Gera certificado
  const code = `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  await prisma.certificate.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      code,
      userId: user.id,
      courseId: course.id,
    },
  });

  revalidatePath("/certificates");
  revalidatePath("/dashboard");
  return { success: true };
}
