# guestbook-202204227 — 미니 방명록

개발자: **신동현 (202204227)**

이름·메시지·작성 시각이 쌓이는 한 페이지짜리 방명록입니다. 회원가입/로그인 없이, 글을 쓸 때 정한 **글 비밀번호**로 자기 글의 메시지 수정·삭제 권한을 확인합니다.

## 기능

- **작성**: 이름(1~20자), 메시지(1~500자), 비밀번호(4~50자)로 새 글 남기기
- **조회**: 전체 글을 작성 시각 최신순으로 표시 (KST `YYYY.MM.DD HH:mm`)
- **수정**: 글 비밀번호가 맞으면 메시지 수정, "(수정됨 · 시각)" 표시. 틀리면 "비밀번호가 일치하지 않습니다." 안내
- **삭제**: 글 비밀번호가 맞으면 삭제. 틀리면 "비밀번호가 일치하지 않습니다." 안내
- 비밀번호는 평문이 아닌 scrypt 해시(글마다 다른 salt)로 저장

## 기술 스택

Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind CSS · Neon Postgres (`@neondatabase/serverless`, ORM 없는 raw SQL) · Vitest + PGlite · Vercel

## SDD 산출물 (Matt Pocock's Skills)

| 단계 | 산출물 |
| --- | --- |
| `/grill-with-docs` | [CONTEXT.md](CONTEXT.md), [docs/adr/](docs/adr/) |
| `/to-spec` | [.scratch/guestbook/spec.md](.scratch/guestbook/spec.md) |
| `/to-tickets` | [.scratch/guestbook/issues/](.scratch/guestbook/issues/) |
| `/implement` | `lib/`, `app/`, `components/`, `db/schema.sql` + 테스트 |
| `/code-review` | Standards / Spec 2축 리뷰 → 반영 커밋 |

## 로컬 실행

```bash
npm install
# .env.local 에 Neon 연결 문자열
echo "DATABASE_URL=postgresql://..." > .env.local
npm run db:migrate   # entries 테이블 생성 (여러 번 실행해도 안전)
npm run dev
```

## 검증

```bash
npm test          # store 모듈 테스트 (메모리 Postgres, DB 불필요)
npm run typecheck
npm run lint
npm run build
```

## 배포 (Vercel + Neon)

프로젝트 이름은 GitHub repo / Vercel 프로젝트 / Neon 프로젝트 모두 `guestbook-202204227`.

1. GitHub에 public repo `guestbook-202204227`로 push
2. Vercel → Add New → Project → repo Import (프로젝트 이름 `guestbook-202204227`)
3. Neon 연동(Storage) 또는 Settings → Environment Variables에 `DATABASE_URL` 등록
4. 해당 DB에 `npm run db:migrate` 실행 (또는 Neon SQL Editor에서 `db/schema.sql` 실행)
5. Deploy / 환경변수 변경 후에는 Redeploy
