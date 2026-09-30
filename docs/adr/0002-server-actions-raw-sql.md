# API Route 대신 Server Actions와 ORM 없는 raw SQL store 모듈을 쓴다

방명록의 작성·수정·삭제는 외부 클라이언트가 호출할 공개 API가 필요 없으므로 `/api/*` Route Handler 대신 Next.js Server Actions로 처리하고, 조회는 Server Component에서 직접 한다. DB 접근은 `@neondatabase/serverless` 위에 raw SQL을 쓰는 방명록 store 모듈 하나로 모으고, 이 모듈이 DB를 주입받게 해서 테스트에서는 메모리 Postgres(PGlite)에 같은 스키마를 올려 검증한다. 규칙(입력 검증·비밀번호 확인·정렬)이 전부 이 모듈 안에 있으므로 테스트 seam도 여기 하나로 충분하다.
