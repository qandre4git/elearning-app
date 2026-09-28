import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Limpando banco de dados...");
  await prisma.comment.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Criando usuários...");
  const instructor = await prisma.user.create({
    data: {
      name: "Prof. Helena Carvalho",
      email: "helena@elearning.com",
      role: "INSTRUCTOR",
      bio: "Engenheira de Software sênior, especialista em React, TypeScript e arquitetura de sistemas.",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Lucas Silva",
      email: "lucas@elearning.com",
      role: "STUDENT",
      bio: "Desenvolvedor júnior em busca de aprimoramento e transição de carreira.",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("📂 Criando categorias...");
  const catTech = await prisma.category.create({
    data: { name: "Programação & Tech", slug: "tech" },
  });

  const catDesign = await prisma.category.create({
    data: { name: "Design & UI/UX", slug: "design" },
  });

  const catAI = await prisma.category.create({
    data: { name: "Inteligência Artificial", slug: "ia" },
  });

  console.log("📚 Criando cursos...");
  const course1 = await prisma.course.create({
    data: {
      title: "Next.js 15 Full-Stack: Do Zero à Produção",
      slug: "nextjs-15-fullstack",
      description: "Aprenda a construir aplicações web completas, escaláveis e de alta performance utilizando a versão mais recente do Next.js com App Router, TypeScript, Tailwind CSS e banco de dados relacional.",
      shortDescription: "Domine o framework React mais requisitado pelo mercado de trabalho.",
      thumbnail: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80",
      price: 199.90,
      published: true,
      level: "INTERMEDIATE",
      categoryId: catTech.id,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Módulo 1: Fundamentos Modernos",
            description: "Conceitos essenciais de Server Components, Client Components e roteamento por pastas.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Introdução ao Next.js 15 e Arquitetura App Router",
                  description: "Nesta aula você entenderá o paradigma de Server Components e o novo modelo de renderização híbrida.",
                  videoUrl: "https://www.youtube.com/embed/Sklc_fQBmcs",
                  durationMinutes: 12,
                  order: 1,
                },
                {
                  title: "2. Estrutura de Pastas e Roteamento Dinâmico",
                  description: "Como estruturar rotas agrupadas, layouts aninhados e parâmetros dinâmicos na URL.",
                  videoUrl: "https://www.youtube.com/embed/wm5gMKuwSYk",
                  durationMinutes: 15,
                  order: 2,
                },
                {
                  title: "3. Otimização de Imagens e Fontes com Next/Image",
                  description: "Técnicas de Core Web Vitals e renderização rápida de mídias.",
                  videoUrl: "https://www.youtube.com/embed/gp5H0Vw39yw",
                  durationMinutes: 10,
                  order: 3,
                },
              ],
            },
          },
          {
            title: "Módulo 2: Banco de Dados & Server Actions",
            description: "Integração segura com ORM, mutações sem APIs REST redundantes e validação com Zod.",
            order: 2,
            lessons: {
              create: [
                {
                  title: "4. Modelagem com Prisma ORM e Migrations",
                  description: "Criando tabelas relacionais, foreign keys e queries tipadas de alta velocidade.",
                  videoUrl: "https://www.youtube.com/embed/FMnlyiBagBh",
                  durationMinutes: 18,
                  order: 1,
                },
                {
                  title: "5. Server Actions: Envio e Mutação de Formulários",
                  description: "Submissão de dados direta do servidor com segurança de tipos e revalidação de cache.",
                  videoUrl: "https://www.youtube.com/embed/dDpZfOQBMaU",
                  durationMinutes: 20,
                  order: 2,
                },
              ],
            },
          },
          {
            title: "Módulo 3: Autenticação, Proteção e Deploy",
            description: "Protegendo rotas, middlewares, gerenciamento de tokens e deploy na Vercel.",
            order: 3,
            lessons: {
              create: [
                {
                  title: "6. Autenticação e Autorização com Middleware",
                  description: "Controle granular de acesso para alunos e instrutores.",
                  videoUrl: "https://www.youtube.com/embed/DJ-0vS8K5_o",
                  durationMinutes: 16,
                  order: 1,
                },
                {
                  title: "7. Build de Produção e CI/CD",
                  description: "Boas práticas de deploy, variáveis de ambiente seguras e monitoramento.",
                  videoUrl: "https://www.youtube.com/embed/Zq5fmkH0T78",
                  durationMinutes: 14,
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "UI/UX Design com Figma: Criando Interfaces Incríveis",
      slug: "ui-ux-design-figma",
      description: "Crie interfaces modernas, intuitivas e acessíveis. Aprenda design system, auto-layout, prototipagem avançada e transições fluidas no Figma.",
      shortDescription: "Da pesquisa com usuários até a entrega de protótipos de alta fidelidade.",
      thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
      price: 149.90,
      published: true,
      level: "BEGINNER",
      categoryId: catDesign.id,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Módulo 1: Fundamentos Visuais",
            description: "Tipografia, teoria das cores, hierarquia visual e espaçamentos.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Introdução ao Figma e Ferramentas Básicas",
                  description: "Ambientação no canvas, frames, grids e atalhos de produtividade.",
                  videoUrl: "https://www.youtube.com/embed/FTFaQWZBqQ8",
                  durationMinutes: 15,
                  order: 1,
                },
                {
                  title: "2. Auto-Layout e Componentes Reutilizáveis",
                  description: "Dominando layouts responsivos e variáveis no Figma.",
                  videoUrl: "https://www.youtube.com/embed/N5f5W8Gvh5A",
                  durationMinutes: 22,
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: "Inteligência Artificial Aplicada e Engenharia de Prompt",
      slug: "ia-aplicada-engenharia-prompt",
      description: "Aprenda a integrar modelos de linguagem em fluxos de trabalho reais, automação de tarefas e criação de agentes autônomos inteligentes.",
      shortDescription: "Domine LLMs, automações inteligentes e crie produtos com IA.",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
      price: 249.90,
      published: true,
      level: "ADVANCED",
      categoryId: catAI.id,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Módulo 1: Fundamentos de LLMs e Agentes",
            description: "Como modelos de linguagem funcionam e como arquitetar prompts assertivos.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. O que são LLMs e Tokens",
                  description: "Mecanismo de atenção, limites de contexto e fine-tuning.",
                  videoUrl: "https://www.youtube.com/embed/jkrNmkK_OKg",
                  durationMinutes: 18,
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("📝 Criando Quizzes para o Curso de Next.js...");
  const module1 = course1.modules[0];
  const quiz1 = await prisma.quiz.create({
    data: {
      title: "Desafio de Conhecimento: Next.js App Router",
      description: "Teste seus conhecimentos sobre Server Components, Client Components e estruturação de rotas.",
      passingScore: 70,
      moduleId: module1.id,
      questions: {
        create: [
          {
            text: "Qual é o comportamento padrão de um componente criado dentro do diretório app/ no Next.js?",
            explanation: "No App Router, todos os componentes dentro do diretório app são React Server Components (RSC) por padrão.",
            order: 1,
            options: {
              create: [
                { text: "É um Client Component por padrão", isCorrect: false },
                { text: "É um Server Component por padrão", isCorrect: true },
                { text: "É um Static Hook sem acesso a dados", isCorrect: false },
                { text: "Requer a diretiva 'use server' no topo do arquivo", isCorrect: false },
              ],
            },
          },
          {
            text: "Qual diretiva deve ser adicionada no topo de um arquivo para torná-lo um Client Component?",
            explanation: "A diretiva 'use client' informa ao empacotador que o arquivo e seus imports devem ser executados no cliente.",
            order: 2,
            options: {
              create: [
                { text: "'use browser'", isCorrect: false },
                { text: "'use client'", isCorrect: true },
                { text: "'client-side: true'", isCorrect: false },
                { text: "'use dynamic'", isCorrect: false },
              ],
            },
          },
          {
            text: "Qual pasta ou convenção de nome no App Router define um layout compartilhado entre rotas filhas?",
            explanation: "O arquivo layout.tsx renderiza a estrutura compartilhada e recebe os componentes de página como children.",
            order: 3,
            options: {
              create: [
                { text: "template.tsx", isCorrect: false },
                { text: "layout.tsx", isCorrect: true },
                { text: "wrapper.tsx", isCorrect: false },
                { text: "index.tsx", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("🎓 Matriculando Lucas no curso de Next.js com progresso parcial...");
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
    },
  });

  // Marca as duas primeiras aulas como concluídas para o aluno ter progresso visual
  const allLessons = course1.modules.flatMap((m) => m.lessons);
  if (allLessons[0]) {
    await prisma.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: allLessons[0].id,
        completed: true,
        completedAt: new Date(),
      },
    });
  }
  if (allLessons[1]) {
    await prisma.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: allLessons[1].id,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  // Comentários de exemplo na primeira aula
  if (allLessons[0]) {
    await prisma.comment.create({
      data: {
        userId: student.id,
        lessonId: allLessons[0].id,
        content: "Excelente explicação sobre Server Components! Ficou muito claro a diferença para o Pages Router antigo.",
      },
    });

    await prisma.comment.create({
      data: {
        userId: instructor.id,
        lessonId: allLessons[0].id,
        content: "Muito obrigado Lucas! Qualquer dúvida sobre o ciclo de renderização, pode postar aqui!",
      },
    });
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
