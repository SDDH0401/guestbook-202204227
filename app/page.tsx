import { connection } from "next/server";
import { EntryItem } from "@/components/EntryItem";
import { NewEntryForm } from "@/components/NewEntryForm";
import { getDb } from "@/lib/db";
import { createEntryStore } from "@/lib/entries";
import { formatKst } from "@/lib/format";

export default async function Home() {
  // 요청마다 DB를 읽는다 (빌드 시점에 정적으로 굳지 않게).
  await connection();
  const entries = await createEntryStore(getDb()).listEntries();

  return (
    <>
      <NewEntryForm />
      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">방명록 ({entries.length})</h2>
        {entries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
            아직 방명록 글이 없습니다. 첫 글을 남겨 보세요!
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {entries.map((entry) => (
              <EntryItem
                key={entry.id}
                entry={entry}
                createdAt={formatKst(entry.createdAt)}
                updatedAt={entry.updatedAt && formatKst(entry.updatedAt)}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
