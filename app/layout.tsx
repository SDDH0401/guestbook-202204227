import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "미니 방명록",
  description: "이름과 메시지를 남기는 미니 방명록",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">
        <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
          <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <h1 className="text-2xl font-bold">미니 방명록</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">개발자: 신동현 (202204227)</p>
          </header>
          <main className="flex flex-col gap-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
