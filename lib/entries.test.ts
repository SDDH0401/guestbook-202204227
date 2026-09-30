import { beforeEach, describe, expect, it } from "vitest";
import { createEntryStore, type EntryStore } from "./entries";
import { createTestDb } from "./test-db";

let entries: EntryStore;
let now: Date;

beforeEach(async () => {
  now = new Date("2026-09-30T06:00:00Z");
  entries = createEntryStore(await createTestDb(), { now: () => now });
});

async function write(name: string, message: string, password = "1234") {
  const result = await entries.createEntry({ name, message, password });
  if (!result.ok) throw new Error(result.errors.join(", "));
  return result.id;
}

describe("글 남기기와 목록", () => {
  it("남긴 글이 이름, 메시지, 작성 시각과 함께 목록에 나타난다", async () => {
    const id = await write("동현", "안녕하세요!");

    expect(await entries.listEntries()).toEqual([
      { id, name: "동현", message: "안녕하세요!", createdAt: now, updatedAt: null },
    ]);
  });

  it("목록은 작성 시각 최신순이다", async () => {
    const first = await write("가", "첫 글");
    now = new Date("2026-09-30T06:01:00Z");
    const second = await write("나", "둘째 글");
    now = new Date("2026-09-30T06:02:00Z");
    const third = await write("다", "셋째 글");

    expect((await entries.listEntries()).map((e) => e.id)).toEqual([third, second, first]);
  });

  it("같은 시각에 쓴 글은 나중에 쓴 글이 위다", async () => {
    const first = await write("가", "a");
    const second = await write("나", "b");

    expect((await entries.listEntries()).map((e) => e.id)).toEqual([second, first]);
  });

  it("글이 없으면 빈 목록이다", async () => {
    expect(await entries.listEntries()).toEqual([]);
  });

  it("이름과 메시지의 앞뒤 공백은 지워서 저장한다", async () => {
    await write("  동현  ", "  반가워요  ");

    const [entry] = await entries.listEntries();
    expect(entry.name).toBe("동현");
    expect(entry.message).toBe("반가워요");
  });

  it("목록에는 비밀번호도 그 해시도 들어 있지 않다", async () => {
    await write("동현", "안녕", "secret-pw");

    const [entry] = await entries.listEntries();
    expect(Object.keys(entry).sort()).toEqual(["createdAt", "id", "message", "name", "updatedAt"]);
    expect(JSON.stringify(entry)).not.toContain("secret-pw");
  });
});

describe("글 남기기 검증", () => {
  it.each([
    ["이름이 비었다", { name: "   ", message: "hi", password: "1234" }, "이름을 입력해 주세요."],
    ["이름이 20자를 넘는다", { name: "가".repeat(21), message: "hi", password: "1234" }, "이름은 20자 이하로 입력해 주세요."],
    ["메시지가 비었다", { name: "동현", message: " ", password: "1234" }, "메시지를 입력해 주세요."],
    ["메시지가 500자를 넘는다", { name: "동현", message: "a".repeat(501), password: "1234" }, "메시지는 500자 이하로 입력해 주세요."],
    ["비밀번호가 4자보다 짧다", { name: "동현", message: "hi", password: "123" }, "비밀번호는 4~50자로 입력해 주세요."],
    ["비밀번호가 50자를 넘는다", { name: "동현", message: "hi", password: "p".repeat(51) }, "비밀번호는 4~50자로 입력해 주세요."],
  ])("%s면 거부되고 글이 생기지 않는다", async (_, input, error) => {
    const result = await entries.createEntry(input);

    expect(result).toEqual({ ok: false, errors: [error] });
    expect(await entries.listEntries()).toEqual([]);
  });

  it("경계값(이름 20자, 메시지 500자, 비밀번호 4자·50자)은 받아들인다", async () => {
    expect((await entries.createEntry({ name: "가".repeat(20), message: "a".repeat(500), password: "1234" })).ok).toBe(true);
    expect((await entries.createEntry({ name: "나", message: "b", password: "p".repeat(50) })).ok).toBe(true);
  });

  it("여러 규칙을 동시에 어기면 모든 이유를 알려 준다", async () => {
    const result = await entries.createEntry({ name: "", message: "", password: "" });

    expect(result).toEqual({
      ok: false,
      errors: ["이름을 입력해 주세요.", "메시지를 입력해 주세요.", "비밀번호는 4~50자로 입력해 주세요."],
    });
  });
});

describe("수정", () => {
  it("올바른 글 비밀번호로 메시지를 고치면 수정 시각이 붙는다", async () => {
    const id = await write("동현", "오타 있음", "pw-1234");
    now = new Date("2026-09-30T07:00:00Z");

    expect(await entries.editEntry({ id, message: "  오타 고침  ", password: "pw-1234" })).toBe("edited");

    expect(await entries.listEntries()).toEqual([
      {
        id,
        name: "동현",
        message: "오타 고침",
        createdAt: new Date("2026-09-30T06:00:00Z"),
        updatedAt: new Date("2026-09-30T07:00:00Z"),
      },
    ]);
  });

  it("수정해도 목록 순서는 작성 시각 기준 그대로다", async () => {
    const older = await write("가", "먼저 쓴 글", "aaaa");
    now = new Date("2026-09-30T06:05:00Z");
    const newer = await write("나", "나중 쓴 글", "bbbb");
    now = new Date("2026-09-30T06:10:00Z");

    await entries.editEntry({ id: older, message: "먼저 쓴 글(수정)", password: "aaaa" });

    expect((await entries.listEntries()).map((e) => e.id)).toEqual([newer, older]);
  });

  it("틀린 비밀번호면 거부되고 글은 그대로다", async () => {
    const id = await write("동현", "원래 메시지", "right");

    expect(await entries.editEntry({ id, message: "바꿔치기", password: "wrong" })).toBe("wrong-password");

    const [entry] = await entries.listEntries();
    expect(entry.message).toBe("원래 메시지");
    expect(entry.updatedAt).toBeNull();
  });

  it("다른 글의 비밀번호로는 고칠 수 없다", async () => {
    const mine = await write("동현", "내 글", "mine");
    await write("남", "남의 글", "other");

    expect(await entries.editEntry({ id: mine, message: "해킹", password: "other" })).toBe("wrong-password");
  });

  it("메시지가 비었거나 500자를 넘으면 비밀번호와 상관없이 거부된다", async () => {
    const id = await write("동현", "원래", "1234");

    expect(await entries.editEntry({ id, message: "  ", password: "1234" })).toEqual({
      errors: ["메시지를 입력해 주세요."],
    });
    expect(await entries.editEntry({ id, message: "a".repeat(501), password: "1234" })).toEqual({
      errors: ["메시지는 500자 이하로 입력해 주세요."],
    });
    expect((await entries.listEntries())[0].message).toBe("원래");
  });

  it("없는 글이면 not-found다", async () => {
    expect(await entries.editEntry({ id: 999, message: "hi", password: "1234" })).toBe("not-found");
  });
});

describe("삭제", () => {
  it("올바른 글 비밀번호로 지우면 목록에서 사라진다", async () => {
    const keep = await write("가", "남는 글", "aaaa");
    const gone = await write("나", "지울 글", "bbbb");

    expect(await entries.deleteEntry({ id: gone, password: "bbbb" })).toBe("deleted");

    expect((await entries.listEntries()).map((e) => e.id)).toEqual([keep]);
  });

  it("틀린 비밀번호면 거부되고 글은 남는다", async () => {
    const id = await write("동현", "지키고 싶은 글", "right");

    expect(await entries.deleteEntry({ id, password: "wrong" })).toBe("wrong-password");

    expect((await entries.listEntries()).map((e) => e.id)).toEqual([id]);
  });

  it("다른 글의 비밀번호로는 지울 수 없다", async () => {
    const mine = await write("동현", "내 글", "mine");
    await write("남", "남의 글", "other");

    expect(await entries.deleteEntry({ id: mine, password: "other" })).toBe("wrong-password");
    expect(await entries.listEntries()).toHaveLength(2);
  });

  it("이미 지운 글이면 not-found다", async () => {
    const id = await write("동현", "곧 사라짐", "1234");
    await entries.deleteEntry({ id, password: "1234" });

    expect(await entries.deleteEntry({ id, password: "1234" })).toBe("not-found");
  });
});

describe("조작된 글 id", () => {
  it.each([Number.NaN, 1.5, -1, 0, Number.MAX_SAFE_INTEGER + 2])("id가 %s면 수정·삭제 모두 not-found다", async (id) => {
    await write("동현", "안전", "1234");

    expect(await entries.editEntry({ id, message: "hi", password: "1234" })).toBe("not-found");
    expect(await entries.deleteEntry({ id, password: "1234" })).toBe("not-found");
    expect(await entries.listEntries()).toHaveLength(1);
  });
});
