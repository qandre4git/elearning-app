"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { submitQuizAttempt } from "@/lib/actions";
import { CheckCircle2, XCircle, Award, RotateCcw, AlertCircle, ArrowRight } from "lucide-react";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  explanation: string | null;
  order: number;
  options: Option[];
}

interface QuizProps {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    passingScore: number;
    questions: Question[];
  };
}

export function QuizComponent({ quiz }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [passed, setPassed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleFinish = async () => {
    if (quiz.questions.length === 0) return;

    let correctCount = 0;
    quiz.questions.forEach((q) => {
      const selectedOptionId = selectedAnswers[q.id];
      const correctOption = q.options.find((opt) => opt.isCorrect);
      if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    const hasPassed = calculatedScore >= quiz.passingScore;

    setScore(calculatedScore);
    setPassed(hasPassed);
    setSubmitted(true);

    if (hasPassed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    try {
      setLoading(true);
      await submitQuizAttempt(quiz.id, calculatedScore, hasPassed);
    } catch (err) {
      console.error("Falha ao salvar tentativa de quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
    setPassed(false);
  };

  const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase">
          <Award className="w-4 h-4" />
          <span>Avaliação de Aprendizado</span>
        </div>
        <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {quiz.title}
        </h3>
        {quiz.description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {quiz.description}
          </p>
        )}
        <div className="mt-2 text-xs text-slate-400">
          Nota mínima para aprovação: <span className="font-bold text-slate-700 dark:text-slate-200">{quiz.passingScore}%</span>
        </div>
      </div>

      {/* Results banner if submitted */}
      {submitted && score !== null && (
        <div
          className={`mt-6 p-4 rounded-xl flex items-start gap-3 border ${
            passed
              ? "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200"
              : "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-200"
          }`}
        >
          {passed ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <div className="flex-1">
            <h4 className="font-bold text-base">
              {passed ? "Parabéns! Você foi aprovado no Quiz!" : "Ainda não foi dessa vez..."}
            </h4>
            <p className="text-sm mt-0.5">
              Sua pontuação: <span className="font-extrabold">{score}%</span> ({passed ? "Atingiu" : "Abaixo da"} meta de {quiz.passingScore}%).
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-800 text-xs font-semibold shadow-sm hover:bg-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Questions list */}
      <div className="mt-6 space-y-6">
        {quiz.questions.map((question, qIdx) => {
          const selectedOptionId = selectedAnswers[question.id];

          return (
            <div
              key={question.id}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800/80 dark:bg-slate-800/40"
            >
              <h5 className="font-semibold text-slate-900 dark:text-white text-base">
                <span className="text-indigo-600 mr-1.5">{qIdx + 1}.</span> {question.text}
              </h5>

              <div className="mt-4 space-y-2.5">
                {question.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  let optionStyle =
                    "border-slate-200 hover:border-indigo-300 dark:border-slate-700 dark:hover:border-slate-600 bg-white dark:bg-slate-900";

                  if (isSelected && !submitted) {
                    optionStyle =
                      "border-indigo-600 bg-indigo-50/70 text-indigo-950 dark:bg-indigo-950/40 dark:border-indigo-500 dark:text-indigo-200 ring-1 ring-indigo-500";
                  }

                  if (submitted) {
                    if (option.isCorrect) {
                      optionStyle =
                        "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold";
                    } else if (isSelected && !option.isCorrect) {
                      optionStyle =
                        "border-rose-500 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-500 text-rose-900 dark:text-rose-200";
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(question.id, option.id)}
                      disabled={submitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm flex items-center justify-between transition-all ${optionStyle}`}
                    >
                      <span className="flex-1">{option.text}</span>
                      {submitted && option.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-2 shrink-0" />
                      )}
                      {submitted && isSelected && !option.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 ml-2 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && question.explanation && (
                <div className="mt-3.5 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Explicação:</strong> {question.explanation}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Submit Button */}
      {!submitted && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleFinish}
            disabled={!allAnswered || loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              allAnswered
                ? "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-indigo-600/20 shadow-md"
                : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
            }`}
          >
            <span>Submeter Respostas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
