# 🎓 EduFlow - Plataforma Moderna de E-Learning

EduFlow é uma plataforma de ensino a distância (LMS) completa desenvolvida com **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4** e **PostgreSQL Nativo (`pg` / node-postgres)**.

Todos os cursos, módulos, avaliações didáticas e videoaulas são **100% em Português**.

---

## 🧒 Guia Passo a Passo: Clonando e Rodando na sua Máquina (Explicado para 5 anos!)

Se você nunca mexeu com programação ou com o GitHub antes, não se preocupe! Siga este passo a passo ilustrado:

### 🧩 Entendendo o que estamos fazendo:
- ☁️ **GitHub**: É como um **baú de brinquedos na nuvem** onde guardamos o código do projeto.
- 🚚 **Git**: É o **carrinho de entrega** no seu computador. Ele vai até o baú da nuvem, pega uma cópia idêntica do projeto e entrega na sua máquina.
- 👯 **Clonar**: Significa **fazer uma cópia exata** do projeto para a sua pasta.
- 💻 **Terminal / Prompt**: É a **janelinha preta** onde você digita comandos para o computador obedecer.

---

### Passo 1: Instalar o Git no seu computador

Escolha o sistema operacional que você usa:

#### 🪟 Se você usa Windows:
1. Acesse o site oficial: [git-scm.com/download/win](https://git-scm.com/download/win).
2. Baixe o instalador e vá clicando em **"Next" / "Avançar"** até terminar.
3. No menu Iniciar, procure e abra o aplicativo chamado **Git Bash** (ou use o **PowerShell**).

#### 🍎 Se você usa Mac (Apple):
1. Pressione as teclas `Command (⌘) + Barra de Espaço`, digite **Terminal** e aperte `Enter`.
2. Na janela preta que abrir, digite:
   ```bash
   git --version
   ```
3. Se você ainda não tiver o Git instalado, o próprio Mac abrirá uma janelinha perguntando se deseja instalar as ferramentas de desenvolvedor. Clique em **Instalar** e aguarde.

#### 🐧 Se você usa Linux (Ubuntu, Debian, Mint):
1. Abra o seu terminal pressionando `Ctrl + Alt + T`.
2. Digite o comando abaixo e aperte `Enter`:
   ```bash
   sudo apt update && sudo apt install -y git
   ```

---

### Passo 2: Dizer ao Git quem você é (Identidade)

Abra a janela do terminal e digite os dois comandos abaixo (troque pelo seu nome e seu e-mail do GitHub):

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```
> *Isso serve apenas para o Git saber quem é o autor das alterações.*

---

### Passo 3: Fazer o Clone (Baixar o projeto do GitHub)

1. No terminal, vá até a pasta onde você gosta de guardar seus projetos (por exemplo, na Área de Trabalho ou Documentos):
   ```bash
   cd ~/Documentos
   # (ou no Windows: cd Desktop)
   ```

2. Agora execute o comando de **clone**:
   ```bash
   git clone https://github.com/qandre4git/elearning-app.git
   ```

3. **Como este repositório é privado**, ele pode pedir para você se autenticar:
   - **Forma mais fácil (GitHub CLI)**:
     Instale o GitHub CLI e digite `gh auth login` para autorizar direto no navegador.
   - **Via Senha/Token**:
     Se o terminal pedir sua senha, no GitHub você deve usar um **Personal Access Token** no lugar da senha:
     *(Acesse seu GitHub ➔ Settings ➔ Developer Settings ➔ Personal access tokens ➔ Tokens (classic) ➔ Generate new token com permissão `repo`)*.

---

### Passo 4: Entrar na pasta do projeto

Agora que o projeto foi baixado, digite o comando para entrar dentro da pasta dele:

```bash
cd elearning-app
```
> *(A sigla `cd` vem de "Change Directory", que significa "entrar nesta pasta")*.

---

### Passo 5: Instalar as peças do projeto (Dependências)

Certifique-se de ter o **[Node.js](https://nodejs.org)** instalado no computador. Em seguida, digite:

```bash
npm install
```
> *(O computador vai baixar automaticamente todas as bibliotecas necessárias para a aplicação funcionar)*.

---

### Passo 6: Ligar o Banco de Dados e Rodar o Site!

Agora que tudo está pronto, só precisamos ligar os motores:

1. **Ligar o PostgreSQL (banco de dados)**:
   ```bash
   docker compose up -d
   ```
2. **Criar as tabelas e colocar os cursos em português**:
   ```bash
   npm run db:setup
   npm run db:seed
   ```
3. **Ligar a aplicação**:
   ```bash
   npm run dev
   ```

🎉 **Pronto!** Abra o seu navegador de internet e acesse:
👉 **[http://localhost:3000](http://localhost:3000)**

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
