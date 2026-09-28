import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Limpando banco de dados para recriação em Português...");
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

  console.log("👤 Criando instrutores e alunos...");
  const instructor = await prisma.user.create({
    data: {
      name: "Profª. Helena Carvalho",
      email: "helena@elearning.com",
      role: "INSTRUCTOR",
      bio: "Especialista em Engenharia de Software, React, Next.js e Arquitetura Web moderna no Brasil.",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
  });

  const instructorGuanabara = await prisma.user.create({
    data: {
      name: "Prof. Gustavo Guanabara",
      email: "guanabara@elearning.com",
      role: "INSTRUCTOR",
      bio: "Educador apaixonado por tecnologia, criador do Curso em Vídeo e referência nacional no ensino de programação em português.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Lucas Silva",
      email: "lucas@elearning.com",
      role: "STUDENT",
      bio: "Desenvolvedor júnior dedicado a aprender novas tecnologias com cursos em português.",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("📂 Criando categorias...");
  const catTech = await prisma.category.create({
    data: { name: "Programação & Desenvolvimento Web", slug: "programacao-web" },
  });

  const catDesign = await prisma.category.create({
    data: { name: "Design & Experiência do Usuário (UI/UX)", slug: "design-ui-ux" },
  });

  const catAI = await prisma.category.create({
    data: { name: "Inteligência Artificial & Ciência de Dados", slug: "ia-dados" },
  });

  console.log("📚 Criando cursos 100% em português com aulas reais em vídeo...");

  // CURSO 1: Next.js 15 Full-Stack
  const course1 = await prisma.course.create({
    data: {
      title: "Next.js 15 Full-Stack: Do Zero à Produção",
      slug: "nextjs-15-fullstack",
      description: "Domine a construção de aplicações web completas em português. Você aprenderá na prática o novo modelo de Server Components do Next.js 15, Server Actions, rotas dinâmicas, autenticação com JWT e publicação na nuvem.",
      shortDescription: "Aprenda Next.js 15 com App Router, Server Actions e TypeScript com aulas totalmente em português.",
      thumbnail: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80",
      price: 199.90,
      published: true,
      level: "INTERMEDIATE",
      categoryId: catTech.id,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Módulo 1: Fundamentos do Next.js e App Router",
            description: "Introdução à arquitetura moderna de Server Components e renderização híbrida.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Do React ao Next.js: Criando um App Completo",
                  description: "Nesta aula em português, exploramos a transição do React tradicional para o ecossistema Next.js com Server Components.",
                  videoUrl: "https://www.youtube.com/embed/F1S-13T5q5Y",
                  durationMinutes: 25,
                  order: 1,
                },
                {
                  title: "2. Resumo Completo do Next.js: Server Components e Actions",
                  description: "Entenda com detalhes como funciona a divisão entre código que executa no servidor e no cliente.",
                  videoUrl: "https://www.youtube.com/embed/R59253u6iXo",
                  durationMinutes: 18,
                  order: 2,
                },
                {
                  title: "3. Estrutura Inicial e Primeiro Projeto Prático",
                  description: "Mão na massa: configurando o ambiente de desenvolvimento, rotas e arquivos especiais.",
                  videoUrl: "https://www.youtube.com/embed/ZfX4S5W9V6Q",
                  durationMinutes: 15,
                  order: 3,
                },
              ],
            },
          },
          {
            title: "Módulo 2: Autenticação, APIs e Publicação",
            description: "Protegendo rotas, consumindo dados dinâmicos e fazendo o deploy para o mundo.",
            order: 2,
            lessons: {
              create: [
                {
                  title: "4. Autenticação e Proteção com JWT",
                  description: "Como implementar controle de acesso seguro para usuários autenticados.",
                  videoUrl: "https://www.youtube.com/embed/S21iF046C-U",
                  durationMinutes: 22,
                  order: 1,
                },
                {
                  title: "5. Requisições e Fetch de Dados em APIs Reais",
                  description: "Boas práticas para consumir dados externos com cache inteligente.",
                  videoUrl: "https://www.youtube.com/embed/V7W_Z0v7A8s",
                  durationMinutes: 16,
                  order: 2,
                },
                {
                  title: "6. Publicação e Deploy na Nuvem (Vercel)",
                  description: "Passo a passo para colocar a aplicação em produção com domínio e variáveis de ambiente.",
                  videoUrl: "https://www.youtube.com/embed/aG0O3sXpZ5I",
                  durationMinutes: 14,
                  order: 3,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      modules: {
        include: { lessons: true },
      },
    },
  });

  // CURSO 2: UI/UX Design com Figma
  const course2 = await prisma.course.create({
    data: {
      title: "Design de Interfaces Modernas com Figma: UI/UX na Prática",
      slug: "design-interfaces-figma-ui-ux",
      description: "Curso completo em português voltado para quem quer criar layouts, protótipos de alta fidelidade e design systems profissionais utilizando o Figma.",
      shortDescription: "Aprenda a prototipar interfaces digitais, sistemas de cores, auto-layout e componentes reutilizáveis.",
      thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
      price: 149.90,
      published: true,
      level: "BEGINNER",
      categoryId: catDesign.id,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Módulo 1: Primeiros Passos e Interface do Figma",
            description: "Conhecendo a área de trabalho, atalhos indispensáveis e navegação fluida.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Introdução ao Figma, Instalação e Criação de Conta",
                  description: "Aula inaugural em português apresentando a ferramenta e seus principais painéis de controle.",
                  videoUrl: "https://www.youtube.com/embed/F3S6J0-i7cE",
                  durationMinutes: 18,
                  order: 1,
                },
                {
                  title: "2. Prototipando Telas: Grids de 8pt e Espaçamentos",
                  description: "Construindo grades consistentes para criar telas harmoniosas e responsivas.",
                  videoUrl: "https://www.youtube.com/embed/R3f-846Wj2Y",
                  durationMinutes: 20,
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
        include: { lessons: true },
      },
    },
  });

  // CURSO 3: Inteligência Artificial e Machine Learning
  const course3 = await prisma.course.create({
    data: {
      title: "Inteligência Artificial e Machine Learning no Dia a Dia",
      slug: "ia-machine-learning-pratica",
      description: "Entenda como a Inteligência Artificial e os Modelos de Linguagem (LLMs) funcionam de verdade. Aprenda com explicações claras em português como integrar IAs no seu fluxo de desenvolvimento.",
      shortDescription: "Conceitos práticos de Machine Learning, LLMs, ChatGPT e automações inteligentes em português.",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
      price: 189.90,
      published: true,
      level: "INTERMEDIATE",
      categoryId: catAI.id,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Módulo 1: Fundamentos de IA e Algoritmos",
            description: "Como as máquinas aprendem e como utilizar modelos no navegador.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Machine Learning na Prática Usando o Navegador",
                  description: "Aula didática em português demonstrando o treinamento de modelos inteligentes passo a passo.",
                  videoUrl: "https://www.youtube.com/embed/ccZ2pyr3YDw",
                  durationMinutes: 24,
                  order: 1,
                },
                {
                  title: "2. Como Modelos de Linguagem (ChatGPT e LLMs) Criam Código",
                  description: "Análise profunda sobre o funcionamento das IAs generativas e engenharia de prompts assertivos.",
                  videoUrl: "https://www.youtube.com/embed/pR6Atd6Ul4Y",
                  durationMinutes: 19,
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
        include: { lessons: true },
      },
    },
  });

  // CURSO 4: JavaScript para Iniciantes com Guanabara
  const course4 = await prisma.course.create({
    data: {
      title: "JavaScript Moderno e Lógica para Iniciantes",
      slug: "javascript-moderno-iniciantes",
      description: "O curso de introdução à programação mais famoso do Brasil. Ministrado com a didática consagrada do Prof. Gustavo Guanabara, cobrindo desde o que é a linguagem até interação com páginas web.",
      shortDescription: "Comece a programar do zero absoluto com a melhor didática em português da internet.",
      thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80",
      price: 0.0, // Gratuito
      published: true,
      level: "BEGINNER",
      categoryId: catTech.id,
      instructorId: instructorGuanabara.id,
      modules: {
        create: [
          {
            title: "Módulo 1: Primeiros Passos com JavaScript",
            description: "Descubra o poder do JavaScript e execute seus primeiros comandos.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. O que o JavaScript é capaz de fazer?",
                  description: "Conheça a história e as possibilidades incríveis que o JavaScript oferece para o desenvolvimento de software.",
                  videoUrl: "https://www.youtube.com/embed/BXqUH86F-KA",
                  durationMinutes: 28,
                  order: 1,
                },
                {
                  title: "2. Para que serve o JavaScript e primeiros comandos",
                  description: "Criando alertas, janelas interativas e interagindo com o usuário no navegador.",
                  videoUrl: "https://www.youtube.com/embed/1-w1RfGiov4",
                  durationMinutes: 25,
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
        include: { lessons: true },
      },
    },
  });

  // CURSO 5: Python do Zero
  const course5 = await prisma.course.create({
    data: {
      title: "Python 3 Completo: Do Básico ao Primeiro Projeto",
      slug: "python-3-completo-do-zero",
      description: "Aprenda Python com uma metodologia 100% prática e brasileira. Ideal para quem busca entrar no mercado de dados, automação de tarefas ou inteligência artificial.",
      shortDescription: "Aprenda a linguagem mais versátil do mundo com aulas e exercícios práticos em português.",
      thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80",
      price: 119.90,
      published: true,
      level: "BEGINNER",
      categoryId: catTech.id,
      instructorId: instructorGuanabara.id,
      modules: {
        create: [
          {
            title: "Módulo 1: Primeiros Passos no Python",
            description: "Instalação do interpretador, variáveis e primeiros programas.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Seja um Programador: Introdução ao Python",
                  description: "Entenda o que é programação e por que o Python se tornou a linguagem mais popular do mundo.",
                  videoUrl: "https://www.youtube.com/embed/S9uPNppGsGo",
                  durationMinutes: 30,
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      modules: {
        include: { lessons: true },
      },
    },
  });

  console.log("📝 Criando Quizzes em Português...");
  const module1Next = course1.modules[0];
  await prisma.quiz.create({
    data: {
      title: "Avaliação Prática: Fundamentos do Next.js",
      description: "Teste seus conhecimentos sobre Server Components, Client Components e App Router.",
      passingScore: 70,
      moduleId: module1Next.id,
      questions: {
        create: [
          {
            text: "No Next.js com App Router, qual é o tipo de componente padrão quando criamos um arquivo na pasta app?",
            explanation: "No App Router, todos os componentes dentro do diretório app são React Server Components (RSC) por padrão.",
            order: 1,
            options: {
              create: [
                { text: "Componente de Servidor (Server Component)", isCorrect: true },
                { text: "Componente de Cliente (Client Component)", isCorrect: false },
                { text: "Hook Global Estático", isCorrect: false },
                { text: "Template sem suporte a renderização dinâmica", isCorrect: false },
              ],
            },
          },
          {
            text: "Qual diretiva deve ser adicionada na primeira linha de um arquivo para que ele execute interações no navegador?",
            explanation: "A diretiva 'use client' informa ao Next.js que o componente precisa de funcionalidades do navegador, como useState e onClick.",
            order: 2,
            options: {
              create: [
                { text: "'use client'", isCorrect: true },
                { text: "'use browser'", isCorrect: false },
                { text: "'use window'", isCorrect: false },
                { text: "'client-side'", isCorrect: false },
              ],
            },
          },
          {
            text: "Qual arquivo especial do Next.js é utilizado para definir a estrutura visual compartilhada entre rotas filhas?",
            explanation: "O arquivo layout.tsx renderiza o layout permanente e preserva o estado durante as transições de página.",
            order: 3,
            options: {
              create: [
                { text: "layout.tsx", isCorrect: true },
                { text: "template.tsx", isCorrect: false },
                { text: "page.tsx", isCorrect: false },
                { text: "container.tsx", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("🎓 Matriculando Lucas Silva no curso de Next.js...");
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
    },
  });

  // Marca as duas primeiras aulas como concluídas
  const allNextLessons = course1.modules.flatMap((m) => m.lessons);
  if (allNextLessons[0]) {
    await prisma.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: allNextLessons[0].id,
        completed: true,
        completedAt: new Date(),
      },
    });
  }
  if (allNextLessons[1]) {
    await prisma.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: allNextLessons[1].id,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  // Comentários de exemplo em português
  if (allNextLessons[0]) {
    await prisma.comment.create({
      data: {
        userId: student.id,
        lessonId: allNextLessons[0].id,
        content: "Excelente aula! Muito bom ver todo o conteúdo explicado diretamente em português com exemplos práticos.",
      },
    });

    await prisma.comment.create({
      data: {
        userId: instructor.id,
        lessonId: allNextLessons[0].id,
        content: "Muito obrigada, Lucas! Fico feliz que tenha gostado. Qualquer dúvida durante as aulas, pode perguntar por aqui!",
      },
    });
  }

  console.log("✅ Seed concluído com 5 cursos completos 100% em Português!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
