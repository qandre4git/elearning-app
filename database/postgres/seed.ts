import { pool } from "../../src/lib/db";

async function seed() {
  console.log("🌱 Limpando tabelas no PostgreSQL...");
  await pool.query(`
    TRUNCATE TABLE comments, quiz_attempts, options, questions, quizzes, 
    lesson_progress, enrollments, certificates, lessons, modules, courses, categories, users CASCADE;
  `);

  console.log("👤 Inserindo usuários...");
  const uHelena = "usr_helena_carvalho";
  const uGuanabara = "usr_gustavo_guanabara";
  const uLucas = "usr_lucas_silva";

  await pool.query(`
    INSERT INTO users (id, name, email, role, bio, avatar_url) VALUES
    ($1, 'Profª. Helena Carvalho', 'helena@elearning.com', 'INSTRUCTOR', 
     'Especialista em Engenharia de Software, React, Next.js e Arquitetura Web moderna no Brasil.',
     'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
    ($2, 'Prof. Gustavo Guanabara', 'guanabara@elearning.com', 'INSTRUCTOR',
     'Educador apaixonado por tecnologia, criador do Curso em Vídeo e referência nacional no ensino de programação em português.',
     'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    ($3, 'Lucas Silva', 'lucas@elearning.com', 'STUDENT',
     'Desenvolvedor júnior dedicado a aprender novas tecnologias com cursos em português.',
     'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80')
  `, [uHelena, uGuanabara, uLucas]);

  console.log("📂 Inserindo categorias...");
  const catTech = "cat_tech";
  const catDesign = "cat_design";
  const catAI = "cat_ai";

  await pool.query(`
    INSERT INTO categories (id, name, slug) VALUES
    ($1, 'Programação & Desenvolvimento Web', 'programacao-web'),
    ($2, 'Design & Experiência do Usuário (UI/UX)', 'design-ui-ux'),
    ($3, 'Inteligência Artificial & Ciência de Dados', 'ia-dados')
  `, [catTech, catDesign, catAI]);

  console.log("📚 Inserindo 5 cursos completos em português...");

  // CURSO 1: Next.js 15
  const cNext = "crs_nextjs_15";
  await pool.query(`
    INSERT INTO courses (id, title, slug, description, short_description, thumbnail, price, published, level, category_id, instructor_id)
    VALUES ($1, 'Next.js 15 Full-Stack: Do Zero à Produção', 'nextjs-15-fullstack',
    'Domine a construção de aplicações web completas em português. Você aprenderá na prática o novo modelo de Server Components do Next.js 15, Server Actions, rotas dinâmicas, autenticação com JWT e publicação na nuvem.',
    'Aprenda Next.js 15 com App Router, Server Actions e TypeScript com aulas totalmente em português.',
    'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80',
    199.90, true, 'INTERMEDIATE', $2, $3)
  `, [cNext, catTech, uHelena]);

  const modNext1 = "mod_next_1";
  const modNext2 = "mod_next_2";
  await pool.query(`
    INSERT INTO modules (id, title, description, "order", course_id) VALUES
    ($1, 'Módulo 1: Fundamentos do Next.js e App Router', 'Introdução à arquitetura moderna de Server Components e renderização híbrida.', 1, $3),
    ($2, 'Módulo 2: Autenticação, APIs e Publicação', 'Protegendo rotas, consumindo dados dinâmicos e fazendo o deploy para o mundo.', 2, $3)
  `, [modNext1, modNext2, cNext]);

  const lesNext1 = "les_next_1";
  const lesNext2 = "les_next_2";
  const lesNext3 = "les_next_3";
  const lesNext4 = "les_next_4";
  const lesNext5 = "les_next_5";
  const lesNext6 = "les_next_6";

  await pool.query(`
    INSERT INTO lessons (id, title, description, video_url, duration_minutes, "order", module_id) VALUES
    ($1, '1. Do React ao Next.js: Criando um App Completo', 'Nesta aula em português, exploramos a transição do React tradicional para o ecossistema Next.js com Server Components.', 'https://www.youtube.com/embed/F1S-13T5q5Y', 25, 1, $7),
    ($2, '2. Resumo Completo do Next.js: Server Components e Actions', 'Entenda com detalhes como funciona a divisão entre código que executa no servidor e no cliente.', 'https://www.youtube.com/embed/R59253u6iXo', 18, 2, $7),
    ($3, '3. Estrutura Inicial e Primeiro Projeto Prático', 'Mão na massa: configurando o ambiente de desenvolvimento, rotas e arquivos especiais.', 'https://www.youtube.com/embed/ZfX4S5W9V6Q', 15, 3, $7),
    ($4, '4. Autenticação e Proteção com JWT', 'Como implementar controle de acesso seguro para usuários autenticados.', 'https://www.youtube.com/embed/S21iF046C-U', 22, 1, $8),
    ($5, '5. Requisições e Fetch de Dados em APIs Reais', 'Boas práticas para consumir dados externos com cache inteligente.', 'https://www.youtube.com/embed/V7W_Z0v7A8s', 16, 2, $8),
    ($6, '6. Publicação e Deploy na Nuvem (Vercel)', 'Passo a passo para colocar a aplicação em produção com domínio e variáveis de ambiente.', 'https://www.youtube.com/embed/aG0O3sXpZ5I', 14, 3, $8)
  `, [lesNext1, lesNext2, lesNext3, lesNext4, lesNext5, lesNext6, modNext1, modNext2]);

  // CURSO 2: UI/UX Figma
  const cFigma = "crs_figma_uiux";
  await pool.query(`
    INSERT INTO courses (id, title, slug, description, short_description, thumbnail, price, published, level, category_id, instructor_id)
    VALUES ($1, 'Design de Interfaces Modernas com Figma: UI/UX na Prática', 'design-interfaces-figma-ui-ux',
    'Curso completo em português voltado para quem quer criar layouts, protótipos de alta fidelidade e design systems profissionais utilizando o Figma.',
    'Aprenda a prototipar interfaces digitais, sistemas de cores, auto-layout e componentes reutilizáveis.',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    149.90, true, 'BEGINNER', $2, $3)
  `, [cFigma, catDesign, uHelena]);

  const modFigma1 = "mod_figma_1";
  await pool.query(`
    INSERT INTO modules (id, title, description, "order", course_id) VALUES
    ($1, 'Módulo 1: Primeiros Passos e Interface do Figma', 'Conhecendo a área de trabalho, atalhos indispensáveis e navegação fluida.', 1, $2)
  `, [modFigma1, cFigma]);

  await pool.query(`
    INSERT INTO lessons (id, title, description, video_url, duration_minutes, "order", module_id) VALUES
    ('les_figma_1', '1. Introdução ao Figma, Instalação e Criação de Conta', 'Aula inaugural em português apresentando a ferramenta e seus principais painéis de controle.', 'https://www.youtube.com/embed/F3S6J0-i7cE', 18, 1, $1),
    ('les_figma_2', '2. Prototipando Telas: Grids de 8pt e Espaçamentos', 'Construindo grades consistentes para criar telas harmoniosas e responsivas.', 'https://www.youtube.com/embed/R3f-846Wj2Y', 20, 2, $1)
  `, [modFigma1]);

  // CURSO 3: IA & Machine Learning
  const cAI = "crs_ia_pratica";
  await pool.query(`
    INSERT INTO courses (id, title, slug, description, short_description, thumbnail, price, published, level, category_id, instructor_id)
    VALUES ($1, 'Inteligência Artificial e Machine Learning no Dia a Dia', 'ia-machine-learning-pratica',
    'Entenda como a Inteligência Artificial e os Modelos de Linguagem (LLMs) funcionam de verdade. Aprenda com explicações claras em português como integrar IAs no seu fluxo de desenvolvimento.',
    'Conceitos práticos de Machine Learning, LLMs, ChatGPT e automações inteligentes em português.',
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    189.90, true, 'INTERMEDIATE', $2, $3)
  `, [cAI, catAI, uHelena]);

  const modAI1 = "mod_ia_1";
  await pool.query(`
    INSERT INTO modules (id, title, description, "order", course_id) VALUES
    ($1, 'Módulo 1: Fundamentos de IA e Algoritmos', 'Como as máquinas aprendem e como utilizar modelos no navegador.', 1, $2)
  `, [modAI1, cAI]);

  await pool.query(`
    INSERT INTO lessons (id, title, description, video_url, duration_minutes, "order", module_id) VALUES
    ('les_ia_1', '1. Machine Learning na Prática Usando o Navegador', 'Aula didática em português demonstrando o treinamento de modelos inteligentes passo a passo.', 'https://www.youtube.com/embed/ccZ2pyr3YDw', 24, 1, $1),
    ('les_ia_2', '2. Como Modelos de Linguagem (ChatGPT e LLMs) Criam Código', 'Análise profunda sobre o funcionamento das IAs generativas e engenharia de prompts assertivos.', 'https://www.youtube.com/embed/pR6Atd6Ul4Y', 19, 2, $1)
  `, [modAI1]);

  // CURSO 4: JavaScript Iniciantes
  const cJS = "crs_js_iniciantes";
  await pool.query(`
    INSERT INTO courses (id, title, slug, description, short_description, thumbnail, price, published, level, category_id, instructor_id)
    VALUES ($1, 'JavaScript Moderno e Lógica para Iniciantes', 'javascript-moderno-iniciantes',
    'O curso de introdução à programação mais famoso do Brasil. Ministrado com a didática consagrada do Prof. Gustavo Guanabara, cobrindo desde o que é a linguagem até interação com páginas web.',
    'Comece a programar do zero absoluto com a melhor didática em português da internet.',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
    0.00, true, 'BEGINNER', $2, $3)
  `, [cJS, catTech, uGuanabara]);

  const modJS1 = "mod_js_1";
  await pool.query(`
    INSERT INTO modules (id, title, description, "order", course_id) VALUES
    ($1, 'Módulo 1: Primeiros Passos com JavaScript', 'Descubra o poder do JavaScript e execute seus primeiros comandos.', 1, $2)
  `, [modJS1, cJS]);

  await pool.query(`
    INSERT INTO lessons (id, title, description, video_url, duration_minutes, "order", module_id) VALUES
    ('les_js_1', '1. O que o JavaScript é capaz de fazer?', 'Conheça a história e as possibilidades incríveis que o JavaScript oferece para o desenvolvimento de software.', 'https://www.youtube.com/embed/BXqUH86F-KA', 28, 1, $1),
    ('les_js_2', '2. Para que serve o JavaScript e primeiros comandos', 'Criando alertas, janelas interativas e interagindo com o usuário no navegador.', 'https://www.youtube.com/embed/1-w1RfGiov4', 25, 2, $1)
  `, [modJS1]);

  // CURSO 5: Python 3
  const cPy = "crs_python_3";
  await pool.query(`
    INSERT INTO courses (id, title, slug, description, short_description, thumbnail, price, published, level, category_id, instructor_id)
    VALUES ($1, 'Python 3 Completo: Do Básico ao Primeiro Projeto', 'python-3-completo-do-zero',
    'Aprenda Python com uma metodologia 100% prática e brasileira. Ideal para quem busca entrar no mercado de dados, automação de tarefas ou inteligência artificial.',
    'Aprenda a linguagem mais versátil do mundo com aulas e exercícios práticos em português.',
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
    119.90, true, 'BEGINNER', $2, $3)
  `, [cPy, catTech, uGuanabara]);

  const modPy1 = "mod_py_1";
  await pool.query(`
    INSERT INTO modules (id, title, description, "order", course_id) VALUES
    ($1, 'Módulo 1: Primeiros Passos no Python', 'Instalação do interpretador, variáveis e primeiros programas.', 1, $2)
  `, [modPy1, cPy]);

  await pool.query(`
    INSERT INTO lessons (id, title, description, video_url, duration_minutes, "order", module_id) VALUES
    ('les_py_1', '1. Seja um Programador: Introdução ao Python', 'Entenda o que é programação e por que o Python se tornou a linguagem mais popular do mundo.', 'https://www.youtube.com/embed/S9uPNppGsGo', 30, 1, $1)
  `, [modPy1]);

  console.log("📝 Inserindo Quizzes...");
  const qNext = "quiz_next_1";
  await pool.query(`
    INSERT INTO quizzes (id, title, description, passing_score, module_id) VALUES
    ($1, 'Avaliação Prática: Fundamentos do Next.js', 'Teste seus conhecimentos sobre Server Components, Client Components e App Router.', 70, $2)
  `, [qNext, modNext1]);

  const qst1 = "qst_next_1";
  const qst2 = "qst_next_2";
  const qst3 = "qst_next_3";

  await pool.query(`
    INSERT INTO questions (id, quiz_id, text, explanation, "order") VALUES
    ($1, $4, 'No Next.js com App Router, qual é o tipo de componente padrão quando criamos um arquivo na pasta app?', 'No App Router, todos os componentes dentro do diretório app são React Server Components (RSC) por padrão.', 1),
    ($2, $4, 'Qual diretiva deve ser adicionada na primeira linha de um arquivo para que ele execute interações no navegador?', 'A diretiva use client informa ao Next.js que o componente precisa de funcionalidades do navegador, como useState e onClick.', 2),
    ($3, $4, 'Qual arquivo especial do Next.js é utilizado para definir a estrutura visual compartilhada entre rotas filhas?', 'O arquivo layout.tsx renderiza o layout permanente e preserva o estado durante as transições de página.', 3)
  `, [qst1, qst2, qst3, qNext]);

  await pool.query(`
    INSERT INTO options (id, question_id, text, is_correct) VALUES
    ('opt_1', $1, 'Componente de Servidor (Server Component)', true),
    ('opt_2', $1, 'Componente de Cliente (Client Component)', false),
    ('opt_3', $1, 'Hook Global Estático', false),
    ('opt_4', $1, 'Template sem suporte a renderização dinâmica', false),
    ('opt_5', $2, '''use client''', true),
    ('opt_6', $2, '''use browser''', false),
    ('opt_7', $2, '''use window''', false),
    ('opt_8', $2, '''client-side''', false),
    ('opt_9', $3, 'layout.tsx', true),
    ('opt_10', $3, 'template.tsx', false),
    ('opt_11', $3, 'page.tsx', false),
    ('opt_12', $3, 'container.tsx', false)
  `, [qst1, qst2, qst3]);

  console.log("🎓 Matriculando Lucas Silva...");
  await pool.query(`
    INSERT INTO enrollments (id, user_id, course_id) VALUES
    ('enr_lucas_next', $1, $2)
  `, [uLucas, cNext]);

  // Aulas concluídas
  await pool.query(`
    INSERT INTO lesson_progress (id, user_id, lesson_id, completed, completed_at) VALUES
    ('prg_lucas_1', $1, $2, true, CURRENT_TIMESTAMP),
    ('prg_lucas_2', $1, $3, true, CURRENT_TIMESTAMP)
  `, [uLucas, lesNext1, lesNext2]);

  // Comentários
  await pool.query(`
    INSERT INTO comments (id, content, user_id, lesson_id) VALUES
    ('cmt_1', 'Excelente aula! Muito bom ver todo o conteúdo explicado diretamente em português com exemplos práticos.', $1, $3),
    ('cmt_2', 'Muito obrigada, Lucas! Fico feliz que tenha gostado. Qualquer dúvida durante as aulas, pode perguntar por aqui!', $2, $3)
  `, [uLucas, uHelena, lesNext1]);

  console.log("✅ Seed executado com sucesso no PostgreSQL nativo!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
