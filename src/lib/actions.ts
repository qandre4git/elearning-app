"use server";

import { pool } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("elearning_user_email")?.value || "lucas@elearning.com";

  let res = await pool.query(
    "SELECT id, name, email, role, avatar_url as \"avatarUrl\", bio FROM users WHERE email = $1 LIMIT 1",
    [userEmail]
  );

  if (res.rows.length === 0) {
    res = await pool.query(
      "SELECT id, name, email, role, avatar_url as \"avatarUrl\", bio FROM users LIMIT 1"
    );
  }

  return res.rows[0] || null;
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

  const enrId = `enr_${Math.random().toString(36).substring(2, 9)}`;
  await pool.query(
    `INSERT INTO enrollments (id, user_id, course_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, course_id) DO NOTHING`,
    [enrId, user.id, courseId]
  );

  revalidatePath(`/courses`);
  revalidatePath(`/dashboard`);
  return { success: true };
}

export async function toggleLessonProgress(lessonId: string, completed: boolean) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado");

  const prgId = `prg_${Math.random().toString(36).substring(2, 9)}`;
  await pool.query(
    `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, completed_at)
     VALUES ($1, $2, $3, $4, CASE WHEN $4 THEN CURRENT_TIMESTAMP ELSE NULL END)
     ON CONFLICT (user_id, lesson_id)
     DO UPDATE SET completed = $4, completed_at = CASE WHEN $4 THEN CURRENT_TIMESTAMP ELSE NULL END`,
    [prgId, user.id, lessonId, completed]
  );

  // Busca o curso dessa aula
  const courseRes = await pool.query(
    `SELECT c.id, c.slug 
     FROM lessons l
     JOIN modules m ON l.module_id = m.id
     JOIN courses c ON m.course_id = c.id
     WHERE l.id = $1 LIMIT 1`,
    [lessonId]
  );

  if (courseRes.rows.length > 0) {
    const course = courseRes.rows[0];

    // Checa total de aulas vs aulas concluídas
    const statsRes = await pool.query(
      `SELECT 
         COUNT(l.id) as total_lessons,
         COUNT(lp.id) FILTER (WHERE lp.completed = true) as completed_lessons
       FROM modules m
       JOIN lessons l ON l.module_id = m.id
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
       WHERE m.course_id = $2`,
      [user.id, course.id]
    );

    const stats = statsRes.rows[0];
    const isFinished =
      Number(stats.total_lessons) > 0 &&
      Number(stats.completed_lessons) >= Number(stats.total_lessons);

    if (isFinished) {
      await pool.query(
        "UPDATE enrollments SET completed_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND course_id = $2",
        [user.id, course.id]
      );

      const certCode = `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      const certId = `cert_${Math.random().toString(36).substring(2, 9)}`;

      await pool.query(
        `INSERT INTO certificates (id, code, user_id, course_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, course_id) DO NOTHING`,
        [certId, certCode, user.id, course.id]
      );
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

  const commentId = `cmt_${Math.random().toString(36).substring(2, 9)}`;
  const res = await pool.query(
    `INSERT INTO comments (id, content, user_id, lesson_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, content, created_at as "createdAt"`,
    [commentId, content.trim(), user.id, lessonId]
  );

  return {
    success: true,
    comment: {
      ...res.rows[0],
      user: {
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    },
  };
}

export async function submitQuizAttempt(quizId: string, score: number, passed: boolean) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado");

  const attemptId = `atm_${Math.random().toString(36).substring(2, 9)}`;
  await pool.query(
    `INSERT INTO quiz_attempts (id, user_id, quiz_id, score, passed)
     VALUES ($1, $2, $3, $4, $5)`,
    [attemptId, user.id, quizId, score, passed]
  );

  return { success: true };
}

export async function createNewCourse(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const categoryId = (formData.get("categoryId") as string) || null;
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

  const courseId = `crs_${Math.random().toString(36).substring(2, 9)}`;
  const moduleId = `mod_${Math.random().toString(36).substring(2, 9)}`;
  const lessonId = `les_${Math.random().toString(36).substring(2, 9)}`;

  await pool.query(
    `INSERT INTO courses (id, title, slug, description, short_description, thumbnail, price, published, level, category_id, instructor_id)
     VALUES ($1, $2, $3, $4, $4, $5, $6, true, $7, $8, $9)`,
    [courseId, title, slug, description, thumbnail, price, level, categoryId, user.id]
  );

  await pool.query(
    `INSERT INTO modules (id, title, description, "order", course_id)
     VALUES ($1, 'Módulo 1: Introdução ao Curso', 'Visão geral e boas-vindas.', 1, $2)`,
    [moduleId, courseId]
  );

  await pool.query(
    `INSERT INTO lessons (id, title, description, video_url, duration_minutes, "order", module_id)
     VALUES ($1, '1. Boas-vindas e Visão Geral', 'Apresentação dos tópicos e objetivos de aprendizado.', 'https://www.youtube.com/embed/F1S-13T5q5Y', 10, 1, $2)`,
    [lessonId, moduleId]
  );

  revalidatePath("/courses");
  revalidatePath("/instructor");
  return { success: true, courseId, slug };
}

export async function generateSampleCertificate(courseId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado");

  // Garante matrícula
  const enrId = `enr_${Math.random().toString(36).substring(2, 9)}`;
  await pool.query(
    `INSERT INTO enrollments (id, user_id, course_id, completed_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, course_id)
     DO UPDATE SET completed_at = CURRENT_TIMESTAMP`,
    [enrId, user.id, courseId]
  );

  // Marca todas as aulas do curso como concluídas
  const lessonsRes = await pool.query(
    `SELECT l.id FROM lessons l
     JOIN modules m ON l.module_id = m.id
     WHERE m.course_id = $1`,
    [courseId]
  );

  for (const row of lessonsRes.rows) {
    const prgId = `prg_${Math.random().toString(36).substring(2, 9)}`;
    await pool.query(
      `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, completed_at)
       VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET completed = true, completed_at = CURRENT_TIMESTAMP`,
      [prgId, user.id, row.id]
    );
  }

  // Gera certificado
  const certId = `cert_${Math.random().toString(36).substring(2, 9)}`;
  const certCode = `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  await pool.query(
    `INSERT INTO certificates (id, code, user_id, course_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, course_id) DO NOTHING`,
    [certId, certCode, user.id, courseId]
  );

  revalidatePath("/certificates");
  revalidatePath("/dashboard");
  return { success: true };
}
