# 🎓 EduFlow - Plataforma Moderna de E-Learning

EduFlow é uma plataforma de ensino a distância (LMS) completa desenvolvida com **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4** e **Prisma ORM**.

---

## 🚀 Funcionalidades Principais

- 📚 **Catálogo de Cursos**: Busca textual, filtros por categorias (Programação, Design, IA) e níveis (Iniciante, Intermediário, Avançado).
- 🎬 **Player de Aprendizado Imersivo**:
  - Reprodutor de vídeo com layout moderno.
  - Playlist lateral dinâmica com ordenação por módulos.
  - Marcação de aulas concluídas com atualização em tempo real do progresso (`%`).
  - Navegação fluida entre aulas anteriores e próximas.
- 📝 **Módulo de Quizzes Interativos**:
  - Avaliação ao final dos módulos com notas e porcentagem de acertos.
  - Explicações didáticas para cada alternativa.
  - Animação festiva de confetes (`canvas-confetti`) ao atingir a nota mínima.
- 💬 **Fórum de Dúvidas por Aula**:
  - Alunos podem enviar perguntas diretamente abaixo de cada aula.
  - Respostas identificadas com badge oficial de instrutor.
- 🏆 **Certificados Oficiais com Validação**:
  - Geração automática ao atingir 100% de conclusão do curso.
  - Código único de autenticidade (ex.: `CERT-ABC123-XYZ`).
  - Layout pronto para impressão e salvamento em PDF (`window.print`).
- 👨‍🏫 **Painel do Instrutor / Admin**:
  - Métricas em tempo real: alunos matriculados, cursos ativos, receita estimada e quizzes realizados.
  - Criação rápida de novos cursos e módulos via Server Actions.
- 🔄 **Alternador de Perfil Instantâneo**:
  - Alterne com 1 clique na barra de navegação entre a visão do aluno (**Lucas Silva**) e da instrutora (**Prof. Helena Carvalho**).

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Framework Web** | [Next.js 15 (App Router)](https://nextjs.org) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org) |
| **Estilização** | [Tailwind CSS v4](https://tailwindcss.com) + [Lucide Icons](https://lucide.dev) |
| **Banco de Dados & ORM** | [Prisma ORM](https://www.prisma.io) (SQLite local com suporte a PostgreSQL) |
| **Mutações & Estado** | Next.js Server Actions |

---

## 💻 Como Rodar o Projeto Localmente

### 1. Clonar ou navegar até a pasta
```bash
cd /home/andre/elearning-app
```

### 2. Instalar dependências (caso necessário)
```bash
npm install
```

### 3. Sincronizar o Banco e Popular Dados Iniciais (Seed)
O banco de dados SQLite já vem configurado e populado. Para recriar do zero:
```bash
npm run db:push
npm run db:seed
```

### 4. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🗄️ Estrutura de Rotas

| Rota | Descrição |
| :--- | :--- |
| `/` | Página inicial com hero, estatísticas e cursos em destaque |
| `/courses` | Catálogo completo com busca e filtros por categorias |
| `/courses/[slug]` | Página de apresentação do curso com grade curricular e botão de matrícula |
| `/courses/[slug]/learn` | Ambiente de estudos com reprodutor de vídeo, playlist e fórum |
| `/dashboard` | Painel do aluno com cursos em andamento, progresso e horas de estudo |
| `/certificates` | Visualização e impressão de certificados de conclusão |
| `/instructor` | Painel do instrutor com métricas e formulário de novo curso |

---

## 🐘 Como Migrar para PostgreSQL

Por padrão, o projeto utiliza SQLite para execução instantânea sem necessidade de instalar ou rodar servidores de banco. Para usar PostgreSQL (Supabase, Neon, Docker ou RDS):

1. No arquivo `prisma/schema.prisma`, altere o datasource:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
2. No seu arquivo `.env`, atualize a connection string:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/elearning_db?schema=public"
```
3. Execute a sincronização e o seed:
```bash
npm run db:push
npm run db:seed
```
