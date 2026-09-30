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
    <form key={state.version} action={action} className="flex flex-col gap-3 rounded-3xl bg-white p-6">
      <h2 className="mb-1 text-[19px] font-bold text-[#191f28]">한마디 남기기</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="name"
          aria-label="이름"
          placeholder="이름"
          defaultValue={state.values.name}
          maxLength={LIMITS.nameMaxLength}
          required
          className={inputClass}
        />
        <input
          name="password"
          type="password"
          aria-label="비밀번호"
          placeholder={`비밀번호 (${LIMITS.passwordMinLength}자 이상)`}
          minLength={LIMITS.passwordMinLength}
          maxLength={LIMITS.passwordMaxLength}
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>
      <textarea
        name="message"
        aria-label="메시지"
        placeholder="하고 싶은 말을 적어 주세요"
        defaultValue={state.values.message}
        maxLength={LIMITS.messageMaxLength}
        required
        rows={3}
        className={`${inputClass} resize-none`}
      />
      <p className="px-1 text-[13px] text-[#8b95a1]">비밀번호는 나중에 글을 고치거나 지울 때 필요해요.</p>
      {state.errors.length > 0 && (
        <ul role="alert" className="px-1 text-[13px] text-[#f04452]">
          {state.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <button type="submit" disabled={pending} className={`mt-1 ${primaryButton}`}>
        {pending ? "남기는 중" : "남기기"}
      </button>
    </form>
  );
}
