"use client";

import { useActionState, useEffect, useState } from "react";
import { deleteEntryAction, editEntryAction, type DeleteState, type EditState } from "@/app/actions";
import type { Entry } from "@/lib/entries";
import { LIMITS } from "@/lib/limits";
import { dangerButton, ghostButton, inputClass, primaryButton } from "./styles";

type Mode = "view" | "edit" | "delete";

type Props = { entry: Entry; createdAt: string; updatedAt: string | null };

export function EntryItem({ entry, createdAt, updatedAt }: Props) {
  const [mode, setMode] = useState<Mode>("view");
  const close = () => setMode("view");

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-semibold">{entry.name}</span>
        <span className="text-xs text-zinc-500">
          {createdAt}
          {updatedAt && ` (수정됨 · ${updatedAt})`}
        </span>
      </div>
      <p className="whitespace-pre-wrap break-words text-sm">{entry.message}</p>

      {mode === "view" && (
        <div className="flex justify-end gap-1">
          <button type="button" onClick={() => setMode("edit")} className={ghostButton}>
            수정
          </button>
          <button type="button" onClick={() => setMode("delete")} className={ghostButton}>
            삭제
          </button>
        </div>
      )}
      {mode === "edit" && <EditForm entry={entry} onClose={close} />}
      {mode === "delete" && <DeleteForm entry={entry} onClose={close} />}
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
    <form key={state.version} action={action} className={formClass}>
      <label className="flex flex-col gap-1">
        <span className="text-sm">메시지 수정</span>
        <textarea
          name="message"
          defaultValue={state.message}
          maxLength={LIMITS.messageMaxLength}
          required
          rows={3}
          className={inputClass}
        />
      </label>
      <PasswordField error={state.error} />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className={ghostButton}>
          취소
        </button>
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "수정 중…" : "수정하기"}
        </button>
      </div>
    </form>
  );
}

function DeleteForm({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  const initial: DeleteState = { error: null, version: 0 };
  const [state, action, pending] = useActionState(deleteEntryAction.bind(null, entry.id), initial);

  return (
    <form key={state.version} action={action} className={formClass}>
      <p className="text-sm">이 글을 삭제하려면 글 비밀번호를 입력하세요. 삭제한 글은 되돌릴 수 없습니다.</p>
      <PasswordField error={state.error} />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className={ghostButton}>
          취소
        </button>
        <button type="submit" disabled={pending} className={dangerButton}>
          {pending ? "삭제 중…" : "삭제하기"}
        </button>
      </div>
    </form>
  );
}

const formClass = "flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800";

function PasswordField({ error }: { error: string | null }) {
  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-sm">글 비밀번호</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          className={inputClass}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </>
  );
}
