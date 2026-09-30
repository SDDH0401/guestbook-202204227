import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "미니 방명록",
  description: "이름과 메시지를 남기는 미니 방명록",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full">
        <div className="mx-auto flex max-w-[560px] flex-col gap-4 px-4 pb-16 pt-10">
          <header className="px-2 pb-2">
            <h1 className="text-[26px] font-bold leading-snug tracking-tight text-[#191f28]">미니 방명록</h1>
            <p className="mt-1 text-[15px] text-[#8b95a1]">개발자 신동현 · 202204227</p>
          </header>
          <main className="flex flex-col gap-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
