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
      <section className="rounded-3xl bg-white px-6 pt-6 pb-1">
        <h2 className="text-[19px] font-bold text-[#191f28]">
          남겨진 글 <span className="text-[#3182f6]">{entries.length}</span>
        </h2>
        {entries.length === 0 ? (
          <p className="py-12 text-center text-[15px] text-[#8b95a1]">
            아직 방명록 글이 없습니다.
            <br />첫 번째 글을 남겨 보세요.
          </p>
        ) : (
          <ul className="divide-y divide-[#f2f4f6]">
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
