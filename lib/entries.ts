import type { Db } from "./db";
import { LIMITS } from "./limits";
import { hashPassword, verifyPassword } from "./password";

/** 방명록에 보이는 글 하나. 비밀번호 해시는 절대 담지 않는다. */
export type Entry = {
  id: number;
  name: string;
  message: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateResult = { ok: true; id: number } | { ok: false; errors: string[] };

/** 수정·삭제가 글 비밀번호 확인 단계에서 거부되는 이유. */
export type PasswordFailure = "wrong-password" | "not-found";
export type EditOutcome = "edited" | PasswordFailure | { errors: string[] };
export type DeleteOutcome = "deleted" | PasswordFailure;

type EntryRow = {
  id: number | string;
  name: string;
  message: string;
  created_at: Date | string;
  updated_at: Date | string | null;
};

function validateName(name: string): string[] {
  if (!name) return ["이름을 입력해 주세요."];
  if (name.length > LIMITS.nameMaxLength) return [`이름은 ${LIMITS.nameMaxLength}자 이하로 입력해 주세요.`];
  return [];
}

function validateMessage(message: string): string[] {
  if (!message) return ["메시지를 입력해 주세요."];
  if (message.length > LIMITS.messageMaxLength) return [`메시지는 ${LIMITS.messageMaxLength}자 이하로 입력해 주세요.`];
  return [];
}

function validatePassword(password: string): string[] {
  const { passwordMinLength: min, passwordMaxLength: max } = LIMITS;
  if (password.length < min || password.length > max) return [`비밀번호는 ${min}~${max}자로 입력해 주세요.`];
  return [];
}

function toEntry(row: EntryRow): Entry {
  return {
    id: Number(row.id),
    name: row.name,
    message: row.message,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at === null ? null : new Date(row.updated_at),
  };
}

export function createEntryStore(db: Db, { now = () => new Date() }: { now?: () => Date } = {}) {
  return {
    async listEntries(): Promise<Entry[]> {
      const rows = await db.query<EntryRow>(
        "select id, name, message, created_at, updated_at from entries order by created_at desc, id desc",
      );
      return rows.map(toEntry);
    },

    async createEntry(input: { name: string; message: string; password: string }): Promise<CreateResult> {
      const name = input.name.trim();
      const message = input.message.trim();
      const errors = [...validateName(name), ...validateMessage(message), ...validatePassword(input.password)];
      if (errors.length > 0) return { ok: false, errors };

      const [row] = await db.query<{ id: number | string }>(
        "insert into entries (name, message, password_hash, created_at) values ($1, $2, $3, $4) returning id",
        [name, message, await hashPassword(input.password), now()],
      );
      return { ok: true, id: Number(row.id) };
    },

    async editEntry(input: { id: number; message: string; password: string }): Promise<EditOutcome> {
      const message = input.message.trim();
      const errors = validateMessage(message);
      if (errors.length > 0) return { errors };

      const passwordCheck = await checkPassword(input.id, input.password);
      if (passwordCheck !== "ok") return passwordCheck;

      // 확인과 수정 사이에 글이 지워졌으면 바뀐 행이 없다.
      const updated = await db.query("update entries set message = $1, updated_at = $2 where id = $3 returning id", [
        message,
        now(),
        input.id,
      ]);
      return updated.length > 0 ? "edited" : "not-found";
    },

    async deleteEntry(input: { id: number; password: string }): Promise<DeleteOutcome> {
      const passwordCheck = await checkPassword(input.id, input.password);
      if (passwordCheck !== "ok") return passwordCheck;

      const deleted = await db.query("delete from entries where id = $1 returning id", [input.id]);
      return deleted.length > 0 ? "deleted" : "not-found";
    },
  };

  async function checkPassword(id: number, password: string): Promise<"ok" | PasswordFailure> {
    // id는 클라이언트에서 오므로 정수가 아니면 DB에 묻지 않고 없는 글로 본다.
    if (!Number.isSafeInteger(id) || id <= 0) return "not-found";
    const [row] = await db.query<{ password_hash: string }>("select password_hash from entries where id = $1", [id]);
    if (!row) return "not-found";
    return (await verifyPassword(password, row.password_hash)) ? "ok" : "wrong-password";
  }
}

export type EntryStore = ReturnType<typeof createEntryStore>;
