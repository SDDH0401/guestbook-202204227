# 04: 배포 준비 (Vercel + Neon)

**What to build:** `npm run build`가 로컬에서 통과하고, README에 Neon 스키마 적용·Vercel 배포 절차가 적혀 있어 GitHub repo를 Vercel에 import하고 Neon을 연결하면 배포 URL에서 작성·조회·수정·삭제가 그대로 동작한다.

**Blocked by:** 01, 02, 03

**Status:** ready-for-agent

- [ ] `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`가 모두 통과한다
- [ ] README에 프로젝트 이름 규칙(`guestbook-202204227`), `DATABASE_URL`, `npm run db:migrate`, Vercel 배포 절차가 적혀 있다
- [ ] 방명록 페이지는 요청마다 DB를 읽는다(빌드 시점에 정적으로 굳지 않는다)
