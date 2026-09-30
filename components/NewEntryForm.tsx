"use client";

import { useActionState } from "react";
import { createEntryAction, type CreateState } from "@/app/actions";
import { LIMITS } from "@/lib/limits";
import { inputClass, primaryButton } from "./styles";

const initial: CreateState = { errors: [], values: { name: "", message: "" }, version: 0 };

export function NewEntryForm() {
  const [state, action, pending] = useActionState(createEntryAction, initial);

  return (
    // 제출마다 version이 바뀌어 폼이 다시 그려진다: 성공하면 비고, 실패하면 입력값이 되살아난다.
    <form
      key={state.version}
      action={action}
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <h2 className="font-semibold">방명록 남기기</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm">이름</span>
          <input
            name="name"
            defaultValue={state.values.name}
            maxLength={LIMITS.nameMaxLength}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm">비밀번호 (수정·삭제용, {LIMITS.passwordMinLength}자 이상)</span>
          <input
            name="password"
            type="password"
            minLength={LIMITS.passwordMinLength}
            maxLength={LIMITS.passwordMaxLength}
            required
            autoComplete="new-password"
            className={inputClass}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-sm">메시지</span>
        <textarea
          name="message"
          defaultValue={state.values.message}
          maxLength={LIMITS.messageMaxLength}
          required
          rows={3}
          className={inputClass}
        />
      </label>
      {state.errors.length > 0 && (
        <ul role="alert" className="text-sm text-red-600">
          {state.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <button type="submit" disabled={pending} className={`self-end ${primaryButton}`}>
        {pending ? "남기는 중…" : "남기기"}
      </button>
    </form>
  );
}
