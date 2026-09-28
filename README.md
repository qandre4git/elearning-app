# 🎓 EduFlow - Plataforma Moderna de E-Learning

EduFlow é uma plataforma de ensino a distância (LMS) completa desenvolvida com **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4** e **PostgreSQL Nativo (`pg` / node-postgres)**.

Todos os cursos, módulos, avaliações didáticas e videoaulas são **100% em Português**.

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado no seu computador:

1. **Git** (sistema de controle de versão).
2. **Node.js** (versão 18.17+, 20+ ou 22+) e **npm**: [nodejs.org](https://nodejs.org).
3. **Docker** e **Docker Compose** (para executar o banco PostgreSQL localmente): [docker.com](https://www.docker.com).

---

## 🚀 Guia de Instalação e Execução Local

Siga as etapas abaixo para clonar o repositório, configurar o ambiente e executar o projeto na sua máquina.

### Etapa 1: Instalar e Configurar o Git

Se você ainda não possui o Git configurado no seu sistema operacional:

#### 🪟 No Windows:
1. Baixe o instalador oficial em [git-scm.com/download/win](https://git-scm.com/download/win) (ou execute no terminal: `winget install Git.Git`).
2. Siga as instruções do instalador mantendo as opções recomendadas.
3. Abra o **Git Bash** ou o **PowerShell**.

#### 🍎 No macOS:
1. Abra o **Terminal** (`Command + Barra de Espaço` ➔ digite `Terminal`).
2. Execute o comando abaixo para verificar se o Git já está presente ou instalar as ferramentas da Apple:
   ```bash
   git --version
   ```
3. Se necessário, instale via Homebrew: `brew install git`.

#### 🐧 No Linux (Ubuntu / Debian / Pop!_OS):
1. Abra o terminal (`Ctrl + Alt + T`).
2. Atualize os pacotes e instale o Git:
   ```bash
   sudo apt update && sudo apt install -y git
   ```

#### Configurar sua Identidade no Git (Global):
Execute uma única vez no terminal para definir seu nome e e-mail de autor dos commits:

```bash
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu-email@dominio.com"
```

---

### Etapa 2: Autenticação no GitHub

Como este repositório é privado, o Git solicitará suas credenciais para autorizar o download. Escolha uma das opções:

- **Opção A (Recomendada via GitHub CLI)**:
  Instale o GitHub CLI (`gh`) e execute `gh auth login`. Selecione `GitHub.com`, protocolo `HTTPS` e autorize pelo navegador.
- **Opção B (Via Personal Access Token - PAT)**:
  1. No GitHub, vá em **Settings** ➔ **Developer Settings** ➔ **Personal access tokens** ➔ **Tokens (classic)**.
  2. Gere um novo token marcando o escopo `repo`.
  3. Quando o Git solicitar a senha no terminal, cole o token gerado.

---

### Etapa 3: Clonar o Repositório

1. No terminal, navegue até o diretório onde deseja armazenar o projeto (por exemplo, na pasta de projetos ou documentos):
   ```bash
   cd ~/Documentos
   # (No Windows PowerShell: cd ~/Documents)
   ```

2. Execute o comando para clonar o repositório:
   ```bash
   git clone https://github.com/qandre4git/elearning-app.git
   ```

3. Entre no diretório do projeto recém-criado:
   ```bash
   cd elearning-app
   ```

---

### Etapa 4: Instalar as Dependências

Instale todos os pacotes Node.js necessários definidos no `package.json`:

```bash
npm install
```

---

### Etapa 5: Configurar Variáveis de Ambiente

O projeto utiliza um arquivo `.env` para gerenciar a conexão com o banco de dados. Caso ele ainda não exista na raiz, copie o modelo de exemplo:

```bash
cp .env.example .env
```

O conteúdo padrão para execução local é:
```env
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/elearning_db?schema=public"
```

---

### Etapa 6: Subir o Banco de Dados PostgreSQL (Docker)

Inicie o container do PostgreSQL em segundo plano:

```bash
docker compose up -d
# ou utilize o atalho: npm run db:up
```

Para verificar se o container está ativo e rodando na porta 5432:
```bash
docker compose ps
```

---

### Etapa 7: Criar Tabelas e Carregar Dados Iniciais (Seed)

Com o banco de dados PostgreSQL rodando, execute os dois comandos abaixo:

1. **Criar a estrutura de tabelas SQL** (executa o script DDL `database/postgres/schema.sql`):
   ```bash
   npm run db:setup
   ```

2. **Popular o banco com 5 cursos e aulas em português**:
   ```bash
   npm run db:seed
   ```

---

### Etapa 8: Iniciar o Servidor de Desenvolvimento

Inicie o servidor Next.js:

```bash
npm run dev
```

Abra o seu navegador e acesse a aplicação em:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Framework Web** | [Next.js 15 (App Router)](https://nextjs.org) | Renderização híbrida (Server & Client Components) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org) | Tipagem estática fim a fim |
| **Estilização** | [Tailwind CSS v4](https://tailwindcss.com) + [Lucide Icons](https://lucide.dev) | Interface moderna e responsiva |
| **Banco de Dados** | **PostgreSQL 16** | Banco relacional robusto com driver nativo `pg` (node-postgres) |
| **Infraestrutura** | Docker Compose | Orquestração do container do banco em `database/postgres/` |
| **Comunicação de Dados** | Next.js Server Actions | Mutações e operações de dados executadas no servidor |

---

## 📁 Estrutura de Diretórios do Projeto

```
elearning-app/
├── database/
│   └── postgres/              # Infraestrutura e scripts do PostgreSQL
│       ├── schema.sql         # DDL com CREATE TABLE, constraints e chaves
│       ├── setup.ts           # Script de execução da migração DDL
│       ├── seed.ts            # Carga com cursos, módulos e aulas em português
│       ├── docker-compose.yml # Definição do serviço PostgreSQL 16
│       └── README.md          # Documentação técnica do banco
├── src/
│   ├── app/
│   │   ├── (public)/          # Landing page e catálogo de cursos
│   │   ├── courses/           # Apresentação do curso e player de aulas (/learn)
│   │   ├── dashboard/         # Painel do estudante com progresso e horas
│   │   ├── certificates/      # Emissão e impressão de certificados oficiais
│   │   └── instructor/        # Painel com métricas de alunos e faturamento
│   ├── components/            # Componentes reutilizáveis (Player, Quiz, Cards)
│   └── lib/
│       ├── db.ts              # Pool singleton do PostgreSQL nativo (`pg`)
│       ├── actions.ts         # Server Actions com consultas SQL parametrizadas
│       └── utils.ts           # Utilitários de formatação de moeda e datas
├── .env.example               # Modelo de variáveis de ambiente
├── docker-compose.yml         # Atalho de orquestração do PostgreSQL na raiz
└── package.json
```

---

## 📜 Comandos Disponíveis no `package.json`

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento em `localhost:3000` |
| `npm run build` | Compila o projeto com otimizações para produção |
| `npm run start` | Inicia o servidor com o build compilado de produção |
| `npm run lint` | Executa o linter ESLint para validação de código |
| `npm run db:up` | Sobe o container PostgreSQL local em segundo plano |
| `npm run db:down` | Encerra o container PostgreSQL local |
| `npm run db:setup` | Executa o script `schema.sql` criando todas as tabelas |
| `npm run db:seed` | Popula o banco com os cursos e avaliações em português |

---

## 🔄 Fluxo de Atualização (Git)

Para manter sua máquina atualizada com o repositório remoto ou enviar novas alterações:

```bash
# Baixar alterações mais recentes do repositório:
git pull origin main

# Salvar e enviar suas alterações locais:
git add .
git commit -m "feat: sua mensagem descritiva"
git push origin main
```
