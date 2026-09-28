import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions";
import { CertificateCard } from "@/components/CertificateCard";
import { SampleCertificateButton } from "@/components/SampleCertificateButton";
import { Award, BookOpen, ArrowRight, ShieldCheck } from "lucide-react";

export default async function CertificatesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold">Faça login para ver seus certificados</h2>
      </div>
    );
  }

  const [certificates, firstCourse] = await Promise.all([
    prisma.certificate.findMany({
      where: { userId: user.id },
      include: {
        user: { select: { name: true } },
        course: {
          include: {
            instructor: { select: { name: true } },
            modules: {
              include: {
                lessons: { select: { durationMinutes: true } },
              },
            },
          },
        },
      },
      orderBy: { issuedAt: "desc" },
    }),
    prisma.course.findFirst({
      where: { published: true },
    }),
  ]);

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
