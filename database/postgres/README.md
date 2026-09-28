# 🐘 PostgreSQL - Configuração e Administração

Este diretório contém os arquivos de infraestrutura e orquestração do banco de dados relacional **PostgreSQL** para o projeto **EduFlow**.

---

## 📋 Especificações do Container

- **Imagem**: `postgres:16-alpine`
- **Nome do Container**: `elearning-postgres`
- **Porta**: `5432`
- **Banco de Dados**: `elearning_db`
- **Usuário**: `postgres`
- **Senha**: `postgrespassword`
- **Volume Persistente**: `postgres_data` (armazena os dados de forma persistente mesmo se o container for recriado)

---

## 🚀 Comandos Rápidos

A partir da raiz do projeto (`/home/andre/elearning-app-postgres`), você pode utilizar os atalhos do `package.json`:

```bash
# Iniciar o container PostgreSQL
npm run db:up

# Parar o container PostgreSQL
npm run db:down

# Sincronizar o schema do Prisma com o PostgreSQL
npm run db:push

# Popular o banco com dados de teste em português
npm run db:seed

# Abrir o visualizador gráfico do Prisma (Prisma Studio)
npm run db:studio
```

---

## 🔗 String de Conexão (.env)

```env
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/elearning_db?schema=public"
```
