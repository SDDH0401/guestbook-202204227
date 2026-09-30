"use client";

import { useActionState, useEffect, useState } from "react";
import { deleteEntryAction, editEntryAction, type DeleteState, type EditState } from "@/app/actions";
import type { Entry } from "@/lib/entries";
import { LIMITS } from "@/lib/limits";
import { dangerButton, inputClass, quietButton, secondaryButton } from "./styles";

type Mode = "view" | "edit" | "delete";

type Props = { entry: Entry; createdAt: string; updatedAt: string | null };

export function EntryItem({ entry, createdAt, updatedAt }: Props) {
  const [mode, setMode] = useState<Mode>("view");
  const close = () => setMode("view");

  return (
    <li className="flex gap-3.5 py-5">
      <div
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f3ff] text-[15px] font-bold text-[#3182f6]"
      >
        {entry.name.slice(0, 1)}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-[15px] font-semibold text-[#191f28]">{entry.name}</span>
            <span className="shrink-0 text-[13px] text-[#8b95a1]">{createdAt}</span>
          </div>
          {mode === "view" && (
            <div className="-mr-2 flex shrink-0">
              <button type="button" onClick={() => setMode("edit")} className={quietButton}>
                수정
              </button>
              <button type="button" onClick={() => setMode("delete")} className={quietButton}>
                삭제
              </button>
            </div>
          )}
        </div>
        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-[#333d4b]">{entry.message}</p>
        {updatedAt && <p className="text-[12px] text-[#b0b8c1]">수정됨 · {updatedAt}</p>}

        {mode === "edit" && <EditForm entry={entry} onClose={close} />}
        {mode === "delete" && <DeleteForm entry={entry} onClose={close} />}
      </div>
    </li>
  );
}

function EditForm({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  const initial: EditState = { error: null, message: entry.message, done: false, version: 0 };
  const [state, action, pending] = useActionState(editEntryAction.bind(null, entry.id), initial);

  useEffect(() => {
    if (state.done) onClose();
  }, [state.done, onClose]);

  return (
    <form key={state.version} action={action} className={panelClass}>
      <textarea
        name="message"
        aria-label="메시지 수정"
        defaultValue={state.message}
        maxLength={LIMITS.messageMaxLength}
        required
        rows={3}
        className={`${inputClass} resize-none bg-white`}
      />
      <PasswordField error={state.error} />
      <FormFooter onClose={onClose}>
        <button type="submit" disabled={pending} className={secondaryButton}>
          {pending ? "수정 중" : "수정하기"}
        </button>
      </FormFooter>
    </form>
  );
}

function DeleteForm({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  const initial: DeleteState = { error: null, version: 0 };
  const [state, action, pending] = useActionState(deleteEntryAction.bind(null, entry.id), initial);

  return (
    <form key={state.version} action={action} className={panelClass}>
      <p className="px-1 text-[14px] text-[#4e5968]">삭제하면 되돌릴 수 없어요. 글 비밀번호를 입력해 주세요.</p>
      <PasswordField error={state.error} />
      <FormFooter onClose={onClose}>
        <button type="submit" disabled={pending} className={dangerButton}>
          {pending ? "삭제 중" : "삭제하기"}
        </button>
      </FormFooter>
    </form>
  );
}

const panelClass = "mt-2 flex flex-col gap-2.5 rounded-2xl bg-[#f9fafb] p-3";

function FormFooter({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="flex justify-end gap-2">
      <button type="button" onClick={onClose} className={quietButton}>
        취소
      </button>
      {children}
    </div>
  );
}

function PasswordField({ error }: { error: string | null }) {
  return (
    <>
      <input
        name="password"
        type="password"
        aria-label="글 비밀번호"
        placeholder="글 비밀번호"
        required
        autoComplete="current-password"
        autoFocus
        className={`${inputClass} bg-white ${error ? "ring-2 ring-[#f04452]" : ""}`}
      />
      {error && (
        <p role="alert" className="px-1 text-[13px] font-medium text-[#f04452]">
          {error}
        </p>
      )}
    </>
  );
}
