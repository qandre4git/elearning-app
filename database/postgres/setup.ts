import fs from "fs";
import path from "path";
import { pool } from "../../src/lib/db";

async function setup() {
  console.log("⚙️ Executando migração DDL no PostgreSQL...");
  const sqlPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf-8");

  await pool.query(sql);
  console.log("✅ Tabelas PostgreSQL criadas com sucesso!");
  await pool.end();
}

setup().catch((err) => {
  console.error("Erro no setup do PostgreSQL:", err);
  process.exit(1);
});
