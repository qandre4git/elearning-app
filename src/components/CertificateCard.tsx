"use client";

import { Award, Printer, CheckCircle, ShieldCheck } from "lucide-react";

interface CertificateCardProps {
  certificate: {
    id: string;
    code: string;
    issuedAt: Date;
    user: {
      name: string;
    };
    course: {
      title: string;
      instructor: {
        name: string;
      };
      modules: {
        lessons: {
          durationMinutes: number;
        }[];
      }[];
    };
  };
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const totalMinutes = certificate.course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0),
    0
  );
  const totalHours = Math.max(1, Math.round(totalMinutes / 60));

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(certificate.issuedAt));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Salvar PDF</span>
        </button>
      </div>

      {/* Official Certificate Canvas */}
      <div className="relative rounded-3xl border-8 border-double border-indigo-900/20 bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/30 p-8 sm:p-12 shadow-2xl text-slate-800 dark:text-slate-100 print:shadow-none print:border-indigo-900 print:p-8">
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-indigo-600/40 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-indigo-600/40 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-indigo-600/40 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-indigo-600/40 rounded-br-xl" />

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Header Badge */}
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-extrabold text-sm tracking-widest uppercase">
            <Award className="w-7 h-7 text-amber-500" />
            <span>EduFlow Academy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-950 dark:text-white">
            Certificado de Conclusão
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
            Certificamos solenemente que
          </p>

          {/* Student Name */}
          <div className="py-2 border-b-2 border-indigo-600/30 px-8 inline-block">
            <span className="text-2xl sm:text-4xl font-serif font-extrabold text-indigo-950 dark:text-indigo-300">
              {certificate.user.name}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            concluiu com aproveitamento integral o programa de estudos do curso
            especializado:
          </p>

          {/* Course Name */}
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white max-w-xl">
            {certificate.course.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Carga horária estimada de{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {totalHours} {totalHours === 1 ? "hora" : "horas"}
            </span>{" "}
            de conteúdo prático e avaliações aplicadas.
          </p>

          {/* Signatures & Seal */}
          <div className="pt-8 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 items-end border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col items-center">
              <span className="font-serif italic text-base text-slate-800 dark:text-slate-200 border-b border-slate-400 pb-1 px-4">
                {certificate.course.instructor.name}
              </span>
              <span className="text-xs text-slate-500 mt-1">Instrutor Responsável</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-lg border-2 border-white">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase mt-2">
                Autenticidade Verificada
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-400 pb-1 px-4">
                {formattedDate}
              </span>
              <span className="text-xs text-slate-500 mt-1">Data de Emissão</span>
            </div>
          </div>

          {/* Authentication Code Footer */}
          <div className="text-[11px] text-slate-400 font-mono tracking-wider pt-2">
            Código de Registro Único: <span className="font-bold text-slate-600 dark:text-slate-300">{certificate.code}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
