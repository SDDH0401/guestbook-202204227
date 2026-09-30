-- 방명록 스키마. 여러 번 실행해도 안전하다 (npm run db:migrate).
create table if not exists entries (
  id bigint generated always as identity primary key,
  name text not null,
  message text not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists entries_created_at_idx on entries (created_at desc);
