"use client";

import { useTransition } from "react";
import { generateSampleCertificate } from "@/lib/actions";
import { Award, Loader2 } from "lucide-react";

interface SampleCertificateButtonProps {
  courseId: string;
}

export function SampleCertificateButton({ courseId }: SampleCertificateButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await generateSampleCertificate(courseId);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Gerando Certificado...</span>
        </>
      ) : (
        <>
          <Award className="w-4 h-4 text-slate-950" />
          <span>Simular Conclusão de Curso (Emitir Certificado)</span>
        </>
      )}
    </button>
  );
}
