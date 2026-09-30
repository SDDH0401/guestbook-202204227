"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { createEntryStore, type PasswordFailure } from "@/lib/entries";

export type CreateState = { errors: string[]; values: { name: string; message: string }; version: number };
export type EditState = { error: string | null; message: string; done: boolean; version: number };
export type DeleteState = { error: string | null; version: number };

const FAILURE_MESSAGES: Record<PasswordFailure, string> = {
  "wrong-password": "비밀번호가 일치하지 않습니다.",
  "not-found": "이미 삭제된 글입니다.",
};

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "");
const store = () => createEntryStore(getDb());

export async function createEntryAction(prev: CreateState, formData: FormData): Promise<CreateState> {
  const values = { name: text(formData, "name"), message: text(formData, "message") };
  const result = await store().createEntry({ ...values, password: text(formData, "password") });
  if (!result.ok) return { errors: result.errors, values, version: prev.version + 1 };

  revalidatePath("/");
  return { errors: [], values: { name: "", message: "" }, version: prev.version + 1 };
}

export async function editEntryAction(id: number, prev: EditState, formData: FormData): Promise<EditState> {
  const message = text(formData, "message");
  const outcome = await store().editEntry({ id, message, password: text(formData, "password") });
  const version = prev.version + 1;
  if (outcome === "edited") {
    revalidatePath("/");
    return { error: null, message, done: true, version };
  }
  const error = typeof outcome === "string" ? FAILURE_MESSAGES[outcome] : outcome.errors.join(" ");
  return { error, message, done: false, version };
}

export async function deleteEntryAction(id: number, prev: DeleteState, formData: FormData): Promise<DeleteState> {
  const outcome = await store().deleteEntry({ id, password: text(formData, "password") });
  if (outcome === "deleted") {
    revalidatePath("/");
    return { error: null, version: prev.version + 1 };
  }
  return { error: FAILURE_MESSAGES[outcome], version: prev.version + 1 };
}
