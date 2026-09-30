# Spec: 미니 방명록 (guestbook-202204227)

**Status:** ready-for-agent

## Problem Statement

방문자는 이름과 짧은 메시지를 남기고 다른 사람들이 남긴 글을 한눈에 보고 싶다. 하지만 방명록 하나 쓰려고 회원가입·로그인을 하고 싶지는 않다. 그렇다고 아무나 남의 글을 고치거나 지울 수 있어서도 안 된다. 글쓴이는 자기가 쓴 글의 오타를 고치거나 글을 지울 수 있어야 한다.

## Solution

한 페이지짜리 방명록. 위쪽에 새 글 작성 폼(이름·메시지·글 비밀번호)이 있고, 아래에 모든 방명록 글이 작성 시각 최신순으로 나열된다. 각 글에는 [수정]과 [삭제] 버튼이 있어 누르면 그 글 아래에 폼이 인라인으로 열린다. 글 비밀번호가 맞으면 수정·삭제가 반영되고, 틀리면 "비밀번호가 일치하지 않습니다."가 그 폼 아래에 표시되며 글은 그대로 남는다. 헤더에는 개발자 이름(신동현)과 학번(202204227)이 표시된다.

## User Stories

1. As a 방문자, I want 로그인 없이 방명록 페이지에 들어오자마자 모든 글을 보고 싶다, so that 다른 사람들이 남긴 말을 바로 읽을 수 있다.
2. As a 방문자, I want 글이 작성 시각 최신순으로 정렬되어 보이기를, so that 가장 최근 글을 먼저 볼 수 있다.
3. As a 방문자, I want 각 글의 이름, 메시지, 작성 시각을 보고 싶다, so that 누가 언제 무슨 말을 남겼는지 알 수 있다.
4. As a 방문자, I want 작성 시각이 한국 시간(KST) `YYYY.MM.DD HH:mm` 형식으로 보이기를, so that 시간을 헷갈리지 않는다.
5. As a 방문자, I want 글이 하나도 없을 때 "아직 방명록 글이 없습니다" 안내를 보고 싶다, so that 페이지가 고장 난 것이 아님을 안다.
6. As a 방문자, I want 이름·메시지·글 비밀번호를 입력해 새 글을 남기고 싶다, so that 방명록에 흔적을 남길 수 있다.
7. As a 방문자, I want 새 글을 남기면 바로 목록 맨 위에 보이기를, so that 제대로 등록됐는지 확인할 수 있다.
8. As a 방문자, I want 이름·메시지·비밀번호가 비었거나 너무 길면 이유와 함께 거부되기를, so that 무엇을 고쳐야 할지 안다.
9. As a 방문자, I want 입력값의 앞뒤 공백이 자동으로 정리되기를, so that 공백만 넣은 글이 생기지 않는다.
10. As a 방문자, I want 검증 오류가 나도 입력했던 내용이 폼에 남아 있기를, so that 처음부터 다시 쓰지 않아도 된다.
11. As a 글쓴이, I want 내 글의 [수정]을 눌러 메시지와 비밀번호 입력칸을 그 자리에서 열고 싶다, so that 페이지 이동 없이 고칠 수 있다.
12. As a 글쓴이, I want 수정 폼에 기존 메시지가 미리 채워져 있기를, so that 일부만 고치면 된다.
13. As a 글쓴이, I want 올바른 글 비밀번호를 대면 메시지가 수정되기를, so that 오타를 고칠 수 있다.
14. As a 글쓴이, I want 비밀번호가 틀리면 수정이 거부되고 "비밀번호가 일치하지 않습니다."가 보이기를, so that 왜 안 됐는지 안다.
15. As a 글쓴이, I want 수정해도 이름과 작성 시각, 목록 순서는 그대로이기를, so that 방명록의 시간 순서가 유지된다.
16. As a 방문자, I want 수정된 글에 "(수정됨 · 시각)" 표시를 보고 싶다, so that 글이 나중에 바뀌었음을 안다.
17. As a 글쓴이, I want 수정할 메시지도 새 글과 같은 규칙(1~500자)으로 검증되기를, so that 빈 메시지로 바꿔 버리는 일이 없다.
18. As a 글쓴이, I want 내 글의 [삭제]를 눌러 비밀번호 입력칸을 그 자리에서 열고 싶다, so that 페이지 이동 없이 지울 수 있다.
19. As a 글쓴이, I want 올바른 글 비밀번호를 대면 글이 목록에서 사라지기를, so that 원치 않는 글을 없앨 수 있다.
20. As a 글쓴이, I want 비밀번호가 틀리면 삭제가 거부되고 "비밀번호가 일치하지 않습니다."가 보이기를, so that 왜 안 됐는지 안다.
21. As a 글쓴이, I want 다른 글의 비밀번호로는 내 글을 고치거나 지울 수 없기를, so that 글 비밀번호가 그 글 하나에만 효력이 있다.
22. As a 방문자, I want 이미 삭제된 글을 수정·삭제하려 하면 "이미 삭제된 글입니다." 안내를 보고 싶다, so that 다른 탭에서 지워진 상황을 이해할 수 있다.
23. As a 글쓴이, I want 폼 전송 중에는 버튼이 비활성화되기를, so that 두 번 눌러 중복 글이 생기지 않는다.
24. As a 방문자, I want [취소]를 눌러 열린 수정·삭제 폼을 닫고 싶다, so that 실수로 연 폼을 치울 수 있다.
25. As a 채점자, I want 헤더에서 개발자 이름과 학번을 보고 싶다, so that 누구의 제출물인지 확인할 수 있다.
26. As a 글쓴이, I want 내 비밀번호가 DB에 평문으로 저장되지 않기를, so that DB가 유출돼도 비밀번호가 드러나지 않는다.
27. As a 방문자, I want 휴대폰 화면에서도 방명록을 읽고 쓸 수 있기를, so that 어디서나 쓸 수 있다.

## Implementation Decisions

- **방명록 store 모듈**: DB(`query(text, params)` 인터페이스)를 주입받아 다음을 제공한다. 모든 규칙은 이 모듈 안에 있다.
  - `listEntries()` → 글 목록(id, 이름, 메시지, 작성 시각, 수정 시각 또는 null), 작성 시각 내림차순(같으면 id 내림차순).
  - `createEntry({ name, message, password })` → `{ ok: true, id }` 또는 `{ ok: false, errors }`.
  - `editEntry({ id, message, password })` → `"edited" | "wrong-password" | "not-found"` 또는 검증 오류.
  - `deleteEntry({ id, password })` → `"deleted" | "wrong-password" | "not-found"`.
  - 비밀번호 해시는 절대 목록 결과로 나가지 않는다.
- **입력 규칙**: 앞뒤 공백 제거 후 이름 1~20자, 메시지 1~500자, 비밀번호 4~50자(비밀번호는 공백 제거하지 않음, 길이만 검사).
- **비밀번호 모듈**: Node 내장 `scrypt` + 글마다 16바이트 랜덤 salt, `salt:hash` hex 문자열로 저장, `timingSafeEqual`로 비교 (ADR-0001).
- **스키마**: `entries(id bigint identity pk, name text not null, message text not null, password_hash text not null, created_at timestamptz not null default now(), updated_at timestamptz null)`. `created_at` 인덱스. 여러 번 실행해도 안전한 `create table if not exists`.
- **마이그레이션**: `npm run db:migrate`가 스키마 SQL을 `DATABASE_URL` DB에 적용한다. 배포 전에 한 번 실행한다.
- **UI/흐름**: 단일 페이지(`/`). 조회는 Server Component, 작성·수정·삭제는 Server Actions + `useActionState` (ADR-0002). 성공 시 경로 재검증으로 목록이 갱신된다. 수정·삭제 폼은 글마다 인라인으로 토글된다.
- **시각 표기**: `Asia/Seoul` 타임존, `YYYY.MM.DD HH:mm`.
- **개발자 표시**: 헤더에 "개발자: 신동현 (202204227)".

## Testing Decisions

- 좋은 테스트는 외부 동작만 검증한다: store 모듈의 공개 함수에 입력을 넣고 결과·목록 상태를 확인한다. 해시 형식, SQL 문자열 같은 내부 구현은 검증하지 않는다.
- **단일 seam: 방명록 store 모듈.** 테스트는 PGlite(메모리 Postgres)에 실제 스키마 SQL을 올려 돌린다. 시계는 주입 가능하게 해 정렬·수정 시각을 결정적으로 검증한다.
- 검증 대상: 작성→목록 반영, 최신순 정렬, 입력 검증(빈 값/길이/공백), 올바른 비밀번호로 수정·삭제, 틀린 비밀번호 거부 후 데이터 불변, 다른 글 비밀번호 거부, 없는 글, 수정 시 순서·이름 유지와 수정 시각 기록, 목록에 해시 미노출.
- Prior art: voting-app의 `lib/polls.test.ts` (PGlite + 주입 DB 패턴).
- UI는 자동 테스트하지 않고, 로컬 `npm run dev`와 배포 URL에서 CRUD를 손으로 확인한다.

## Out of Scope

- 회원가입/로그인, 관리자 기능, 글 비밀번호 변경·찾기
- 이름 수정 (요구사항은 메시지 수정만)
- 페이지네이션, 검색, 댓글, 좋아요, 이미지 첨부
- 스팸 방지(캡차, rate limit), 비밀번호 시도 횟수 제한
- 실시간 갱신(폴링/웹소켓)

## Further Notes

- GitHub repo / Vercel 프로젝트 / Neon 프로젝트 이름은 모두 `guestbook-202204227`.
- Vercel에는 Neon 연동으로 `DATABASE_URL`이 들어가야 하며, 스키마는 `npm run db:migrate`로 미리 적용해 둔다.

## Comments

### /code-review (f60b89e...946956f)

**Standards**: 문서화된 규칙(ADR-0001/0002, AGENTS.md의 Next.js 문서) 위반 없음. 실제 문제 1건: Server Action에 bind된 글 id를 런타임 검증하지 않아, 조작된 id가 오면 bigint 비교에서 500이 난다 → **반영** (store에서 안전한 양의 정수가 아니면 not-found). 판단 영역 스멜(Duplicated Code: store 생성/폼 footer, 결과 타입 3종 불일치로 인한 분기, Data Clumps `{id, password}`, Mysterious Name `check`) → `check`만 `passwordCheck`로 개명, 나머지는 규모 대비 이득이 작아 보류.

**Spec**: 차단급 누락 없음. CRUD 4개 흐름과 비밀번호 불일치 안내 모두 스펙대로 동작. 반영: 이미 삭제된 글에 수정·삭제 시 목록을 재검증해 그 글이 사라지게 함, 비밀번호 확인과 UPDATE/DELETE 사이에 글이 지워지는 경합을 `returning`으로 감지. 보류: 검증 오류 시 비밀번호 칸만 비워지는 것(의도: 비밀번호는 다시 입력), 목록 개수 표시 등 사소한 추가 UI.

**Summary**: Standards 1건 반영(가장 심각: 미검증 id), Spec 2건 반영(가장 심각: 삭제된 글이 목록에 남음).
