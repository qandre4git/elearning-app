import Link from "next/link";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/actions";
import { CertificateCard } from "@/components/CertificateCard";
import { SampleCertificateButton } from "@/components/SampleCertificateButton";
import { Award, BookOpen } from "lucide-react";

export default async function CertificatesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold">Faça login para ver seus certificados</h2>
      </div>
    );
  }

  // Busca certificados do usuário
  const certRes = await pool.query(
    `SELECT 
       cert.id, cert.code, cert.issued_at as "issuedAt",
       u.name as user_name,
       c.id as course_id, c.title as course_title,
       inst.name as instructor_name
     FROM certificates cert
     JOIN users u ON cert.user_id = u.id
     JOIN courses c ON cert.course_id = c.id
     JOIN users inst ON c.instructor_id = inst.id
     WHERE cert.user_id = $1
     ORDER BY cert.issued_at DESC`,
    [user.id]
  );

  // Busca aulas dos cursos desses certificados
  const courseIds = certRes.rows.map((r) => r.course_id);
  let lessonsByCourse: Record<string, { durationMinutes: number }[]> = {};

  if (courseIds.length > 0) {
    const lessonsRes = await pool.query(
      `SELECT m.course_id, l.duration_minutes
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = ANY($1)`,
      [courseIds]
    );

    lessonsRes.rows.forEach((row) => {
      if (!lessonsByCourse[row.course_id]) {
        lessonsByCourse[row.course_id] = [];
      }
      lessonsByCourse[row.course_id].push({
        durationMinutes: row.duration_minutes,
      });
    });
  }

  const certificates = certRes.rows.map((r) => ({
    id: r.id,
    code: r.code,
    issuedAt: r.issuedAt,
    user: {
      name: r.user_name,
    },
    course: {
      title: r.course_title,
      instructor: {
        name: r.instructor_name,
      },
      modules: [
        {
          lessons: lessonsByCourse[r.course_id] || [],
        },
      ],
    },
  }));

  const firstCourseRes = await pool.query(
    "SELECT id FROM courses WHERE published = true LIMIT 1"
  );
  const firstCourse = firstCourseRes.rows[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Validação de Conquistas</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Meus Certificados Oficiais
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Documentos emitidos com código de autenticidade criptográfico e prontos para compartilhamento e impressão.
          </p>
        </div>

        {firstCourse && certificates.length === 0 && (
          <div>
            <SampleCertificateButton courseId={firstCourse.id} />
          </div>
        )}
      </div>

      {/* List of Certificates */}
      {certificates.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Nenhum certificado conquistado ainda
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Para conquistar seu primeiro certificado, complete 100% das aulas e quizzes de um curso no seu painel.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Continuar Estudando</span>
            </Link>
            {firstCourse && (
              <SampleCertificateButton courseId={firstCourse.id} />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
}
