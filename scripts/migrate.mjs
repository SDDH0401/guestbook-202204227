// db/schema.sql을 DATABASE_URL의 DB에 적용한다. 여러 번 실행해도 안전하다.
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL이 설정되지 않았습니다.");
  process.exit(1);
}

const sql = neon(url);
const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
// HTTP 드라이버는 한 번에 한 문장만 실행하므로 문장 단위로 나눈다.
const statements = schema
  .split(/;\s*$/m)
  .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);

for (const statement of statements) await sql.query(statement);
console.log(`스키마를 적용했습니다 (${statements.length}개 문장).`);
