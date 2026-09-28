# 🎓 EduFlow - Plataforma Moderna de E-Learning

EduFlow é uma plataforma de ensino a distância (LMS) completa desenvolvida com **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4** e **PostgreSQL Nativo (`pg` / node-postgres)**.

Todos os cursos, módulos, avaliações didáticas e videoaulas são **100% em Português**.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Framework Web** | [Next.js 15 (App Router)](https://nextjs.org) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org) |
| **Estilização** | [Tailwind CSS v4](https://tailwindcss.com) + [Lucide Icons](https://lucide.dev) |
| **Banco de Dados** | **PostgreSQL 16** (Driver nativo `pg` com pool de conexões e SQL puro) |
| **Infraestrutura** | Docker Compose em `database/postgres/` |
| **Mutações & Estado** | Next.js Server Actions |

---

## 📁 Estrutura de Diretórios do Projeto

```
elearning-app/
├── database/
│   └── postgres/              # Módulo completo de banco de dados
│       ├── schema.sql         # DDL com todas as tabelas e constraints SQL
│       ├── setup.ts           # Script de migração e criação das tabelas
│       ├── seed.ts            # Carga com 5 cursos e aulas em português
│       ├── docker-compose.yml # Definição do serviço PostgreSQL 16
│       └── README.md          # Documentação de infraestrutura
├── src/
│   ├── app/
│   │   ├── (public)/          # Catálogo de cursos, busca e landing page
│   │   ├── courses/           # Detalhes da ementa e player de aulas
│   │   ├── dashboard/         # Painel do aluno com progresso e horas de estudo
│   │   ├── certificates/      # Emissão oficial e impressão de certificados
│   │   └── instructor/        # Painel de gestão do instrutor e métricas
│   ├── components/            # Componentes reutilizáveis (Player, Quiz, Cards)
│   └── lib/
│       ├── db.ts              # Pool singleton do PostgreSQL nativo (`pg`)
│       ├── actions.ts         # Server Actions com queries SQL parametrizadas
│       └── utils.ts           # Utilitários de formatação e estilos
├── .env.example               # Modelo de variáveis de ambiente
├── docker-compose.yml         # Atalho de orquestração na raiz
└── package.json
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clonar e entrar na pasta do projeto
```bash
git clone https://github.com/qandre4git/elearning-app.git
cd elearning-app
```

### 2. Iniciar o Banco de Dados PostgreSQL
Suba o container do PostgreSQL com o comando:
```bash
docker compose up -d
# ou: npm run db:up
```

### 3. Criar as Tabelas e Popular Dados Iniciais
Execute a criação das tabelas SQL e o seed dos cursos em português:
```bash
npm run db:setup
npm run db:seed
```

### 4. Iniciar a Aplicação Next.js
```bash
npm run dev
```
Acesse a aplicação no navegador em: **[http://localhost:3000](http://localhost:3000)**

---

## 📜 Comandos Disponíveis no `package.json`

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento na porta `3000` |
| `npm run build` | Compila a aplicação para produção |
| `npm run db:up` | Sobe o container PostgreSQL em segundo plano |
| `npm run db:down` | Encerra o container PostgreSQL |
| `npm run db:setup` | Cria/atualiza as tabelas no PostgreSQL executando `schema.sql` |
| `npm run db:seed` | Popula o banco com 5 cursos e videoaulas em português |

---

## 🌐 Configuração da String de Conexão (.env)

Por padrão, a aplicação conecta ao PostgreSQL local configurado no Docker:

```env
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/elearning_db?schema=public"
```

Caso queira utilizar um banco PostgreSQL hospedado na nuvem (ex.: **Supabase**, **Neon** ou **Railway**), basta substituir a variável `DATABASE_URL` no seu arquivo `.env` pela URL fornecida pelo provedor.
