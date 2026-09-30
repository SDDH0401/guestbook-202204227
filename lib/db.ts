import "server-only";
import { neon } from "@neondatabase/serverless";

/** `$1`, `$2` 자리표시자를 쓰는 SQL 한 문장을 실행하고 행을 돌려준다. */
export type Db = {
  query<T>(text: string, params?: unknown[]): Promise<T[]>;
};

let neonDb: Db | undefined;

export function getDb(): Db {
  if (!neonDb) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL이 설정되지 않았습니다.");
    const sql = neon(url);
    neonDb = {
      query: async <T>(text: string, params: unknown[] = []) =>
        (await sql.query(text, params)) as T[],
    };
  }
  return neonDb;
}
