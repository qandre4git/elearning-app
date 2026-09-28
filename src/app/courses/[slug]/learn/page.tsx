import { notFound, redirect } from "next/navigation";
import { pool } from "@/lib/db";
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

  const courseRes = await pool.query(
    "SELECT id, title, slug FROM courses WHERE slug = $1 LIMIT 1",
    [slug]
  );

  if (courseRes.rows.length === 0) {
    notFound();
  }

  const course = courseRes.rows[0];

  // Auto-matricula se não estiver
  const enrId = `enr_${Math.random().toString(36).substring(2, 9)}`;
  await pool.query(
    `INSERT INTO enrollments (id, user_id, course_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, course_id) DO NOTHING`,
    [enrId, user.id, course.id]
  );

  // Módulos
  const modulesRes = await pool.query(
    `SELECT id, title, "order" FROM modules WHERE course_id = $1 ORDER BY "order" ASC`,
    [course.id]
  );

  // Aulas
  const lessonsRes = await pool.query(
    `SELECT l.id, l.title, l.description, l.video_url, l.duration_minutes, l."order", l.module_id,
            COALESCE(lp.completed, false) as completed
     FROM lessons l
     JOIN modules m ON l.module_id = m.id
     LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $2
     WHERE m.course_id = $1
     ORDER BY l."order" ASC`,
    [course.id, user.id]
  );

  // Comentários de todas as aulas do curso
  const commentsRes = await pool.query(
    `SELECT c.id, c.content, c.lesson_id, c.created_at,
            u.name as user_name, u.role as user_role, u.avatar_url as user_avatar
     FROM comments c
     JOIN users u ON c.user_id = u.id
     JOIN lessons l ON c.lesson_id = l.id
     JOIN modules m ON l.module_id = m.id
     WHERE m.course_id = $1
     ORDER BY c.created_at DESC`,
    [course.id]
  );

  // Quizzes, Perguntas e Opções
  const quizzesRes = await pool.query(
    `SELECT q.id, q.title, q.description, q.passing_score, q.module_id
     FROM quizzes q
     JOIN modules m ON q.module_id = m.id
     WHERE m.course_id = $1`,
    [course.id]
  );

  const questionsRes = await pool.query(
    `SELECT qst.id, qst.quiz_id, qst.text, qst.explanation, qst."order"
     FROM questions qst
     JOIN quizzes q ON qst.quiz_id = q.id
     JOIN modules m ON q.module_id = m.id
     WHERE m.course_id = $1
     ORDER BY qst."order" ASC`,
    [course.id]
  );

  const optionsRes = await pool.query(
    `SELECT opt.id, opt.question_id, opt.text, opt.is_correct
     FROM options opt
     JOIN questions qst ON opt.question_id = qst.id
     JOIN quizzes q ON qst.quiz_id = q.id
     JOIN modules m ON q.module_id = m.id
     WHERE m.course_id = $1`,
    [course.id]
  );

  // Monta hierarquia de quizzes
  const quizzesByModule: Record<string, any[]> = {};
  quizzesRes.rows.forEach((quiz) => {
    const questions = questionsRes.rows
      .filter((qst) => qst.quiz_id === quiz.id)
      .map((qst) => ({
        id: qst.id,
        text: qst.text,
        explanation: qst.explanation,
        order: qst.order,
        options: optionsRes.rows
          .filter((opt) => opt.question_id === qst.id)
          .map((opt) => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.is_correct,
          })),
      }));

    if (!quizzesByModule[quiz.module_id]) {
      quizzesByModule[quiz.module_id] = [];
    }
    quizzesByModule[quiz.module_id].push({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passing_score,
      questions,
    });
  });

  // Monta estrutura final para o LessonPlayer
  const modulesWithProgress = modulesRes.rows.map((m) => {
    const modLessons = lessonsRes.rows
      .filter((l) => l.module_id === m.id)
      .map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        videoUrl: l.video_url,
        durationMinutes: l.duration_minutes,
        order: l.order,
        completed: Boolean(l.completed),
        comments: commentsRes.rows
          .filter((c) => c.lesson_id === l.id)
          .map((c) => ({
            id: c.id,
            content: c.content,
            createdAt: c.created_at,
            user: {
              name: c.user_name,
              role: c.user_role,
              avatarUrl: c.user_avatar,
            },
          })),
      }));

    return {
      id: m.id,
      title: m.title,
      order: m.order,
      quizzes: quizzesByModule[m.id] || [],
      lessons: modLessons,
    };
  });

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
