import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import type { Db } from "./db";

const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

/** 테스트용: 메모리에서 도는 Postgres에 실제 스키마를 적용한 Db. */
export async function createTestDb(): Promise<Db> {
  const pg = new PGlite();
  await pg.exec(schema);
  return {
    query: async <T>(text: string, params: unknown[] = []) =>
      (await pg.query<T>(text, params)).rows,
  };
}
