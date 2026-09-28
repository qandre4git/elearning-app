"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleLessonProgress, addComment } from "@/lib/actions";
import { QuizComponent } from "./QuizComponent";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  MessageSquare,
  FileText,
  Award,
  Send,
  Sparkles,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface CommentItem {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string;
    role: string;
    avatarUrl: string | null;
  };
}

interface LessonData {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  durationMinutes: number;
  order: number;
  completed: boolean;
  comments: CommentItem[];
}

interface ModuleData {
  id: string;
  title: string;
  order: number;
  lessons: LessonData[];
  quizzes?: any[];
}

interface LessonPlayerProps {
  course: {
    id: string;
    title: string;
    slug: string;
  };
  modules: ModuleData[];
  initialLessonId: string;
  currentUser: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: string;
  };
}

export function LessonPlayer({
  course,
  modules,
  initialLessonId,
  currentUser,
}: LessonPlayerProps) {
  const router = useRouter();
  const [activeLessonId, setActiveLessonId] = useState(initialLessonId);
  const [activeTab, setActiveTab] = useState<"about" | "comments" | "quiz">("about");
  const [commentInput, setCommentInput] = useState("");
  const [isPending, startTransition] = useTransition();

  // Encontra a aula ativa
  const allLessons = modules.flatMap((m) => m.lessons);
  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const activeModule = modules.find((m) =>
    m.lessons.some((l) => l.id === activeLesson?.id)
  );

  const completedCount = allLessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  // Navegação entre aulas
  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleToggleComplete = () => {
    if (!activeLesson) return;
    const newStatus = !activeLesson.completed;

    startTransition(async () => {
      await toggleLessonProgress(activeLesson.id, newStatus);
      activeLesson.completed = newStatus;

      // Se marcou como concluído e existe próxima aula, sugere ir para a próxima
      if (newStatus && nextLesson) {
        setActiveLessonId(nextLesson.id);
      }
    });
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeLesson) return;

    const text = commentInput.trim();
    setCommentInput("");

    try {
      const res = await addComment(activeLesson.id, text);
      if (res.success && res.comment) {
        activeLesson.comments.unshift({
          id: res.comment.id,
          content: res.comment.content,
          createdAt: res.comment.createdAt,
          user: {
            name: currentUser.name,
            role: currentUser.role,
            avatarUrl: currentUser.avatarUrl,
          },
        });
      }
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
    }
  };

  const currentQuiz = activeModule?.quizzes && activeModule.quizzes.length > 0 ? activeModule.quizzes[0] : null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar ao Curso</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <h1 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 max-w-md">
            {course.title}
          </h1>
        </div>

        {/* Global Progress Indicator */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              {completedCount} de {allLessons.length} aulas ({progressPercent}%)
            </span>
            <div className="w-28 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {progressPercent === 100 && (
            <Link
              href="/certificates"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Ver Certificado</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Learning Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full p-4 lg:p-6 gap-6">
        {/* Left Column: Player & Lesson Contents (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Video Container */}
          <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-lg border border-slate-900">
            {activeLesson?.videoUrl ? (
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                <PlayCircle className="w-12 h-12 text-slate-600" />
                <p className="text-sm">Vídeo em processamento pelo instrutor.</p>
              </div>
            )}
          </div>

          {/* Action Bar (Completion & Next/Prev) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={handleToggleComplete}
              disabled={isPending}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeLesson?.completed
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {activeLesson?.completed ? "Aula Concluída ✓" : "Marcar como Concluída"}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
                disabled={!prevLesson}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
              <button
                onClick={() => nextLesson && setActiveLessonId(nextLesson.id)}
                disabled={!nextLesson}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Próxima</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Navigation Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
                activeTab === "about"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Sobre esta Aula</span>
            </button>

            <button
              onClick={() => setActiveTab("comments")}
              className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
                activeTab === "comments"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Dúvidas ({activeLesson?.comments.length || 0})</span>
            </button>

            {currentQuiz && (
              <button
                onClick={() => setActiveTab("quiz")}
                className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
                  activeTab === "quiz"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Quiz do Módulo</span>
              </button>
            )}
          </div>

          {/* Tab Contents */}
          {activeTab === "about" && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeLesson?.title}
              </h2>
              <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {activeLesson?.description || "Nenhuma descrição fornecida para esta aula."}
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Fórum de Dúvidas da Aula
              </h3>

              {/* Form to submit question */}
              <form onSubmit={handleSendComment} className="flex gap-3">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Tem alguma dúvida sobre esta aula? Pergunte ao instrutor..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Perguntar</span>
                </button>
              </form>

              {/* Comments list */}
              <div className="space-y-4 pt-2">
                {activeLesson?.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Nenhuma dúvida postada ainda. Seja o primeiro a perguntar!
                  </p>
                ) : (
                  activeLesson?.comments.map((comm) => (
                    <div
                      key={comm.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {comm.user.avatarUrl ? (
                            <img
                              src={comm.user.avatarUrl}
                              alt={comm.user.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                              {comm.user.name.charAt(0)}
                            </div>
                          )}
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {comm.user.name}
                          </span>
                          {comm.user.role === "INSTRUCTOR" && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-extrabold px-1.5 py-0.5 rounded">
                              Instrutor
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {comm.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "quiz" && currentQuiz && (
            <QuizComponent quiz={currentQuiz} />
          )}
        </div>

        {/* Right Column: Playlist & Modules (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              Conteúdo do Curso
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {modules.map((mod, mIdx) => (
                <div key={mod.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>{mod.title}</span>
                    <span className="text-[10px] font-normal lowercase">
                      {mod.lessons.length} aulas
                    </span>
                  </div>

                  <div className="space-y-1">
                    {mod.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLesson?.id;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setActiveLessonId(lesson.id);
                            setActiveTab("about");
                          }}
                          className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 text-xs transition-all ${
                            isActive
                              ? "bg-indigo-50 border border-indigo-200 text-indigo-950 font-semibold dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-200"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {lesson.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                            )}
                          </div>

                          <div className="flex-1">
                            <p className="line-clamp-2 leading-tight">
                              {lesson.title}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {formatDuration(lesson.durationMinutes)}
                            </span>
                          </div>
                        </button>
                      );
                    })}

                    {/* Quiz Button for this module */}
                    {mod.quizzes && mod.quizzes.length > 0 && (
                      <button
                        onClick={() => {
                          const firstModLesson = mod.lessons[0];
                          if (firstModLesson) setActiveLessonId(firstModLesson.id);
                          setActiveTab("quiz");
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50/70 border border-purple-200/60 dark:bg-purple-950/30 dark:border-purple-900 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                      >
                        <Award className="w-4 h-4 text-purple-600" />
                        <span>Quiz: {mod.quizzes[0].title}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
