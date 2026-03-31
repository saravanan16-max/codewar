create extension if not exists "pgcrypto";

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team_code text unique not null,
  passcode text not null,
  created_at timestamptz default now()
);

create table if not exists rounds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'draft',
  start_time timestamptz,
  end_time timestamptz,
  created_at timestamptz default now()
);

create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  round_id uuid references rounds(id) on delete cascade,
  title text not null,
  slug text unique not null,
  statement text not null,
  difficulty text not null default 'easy',
  score integer not null default 100,
  created_at timestamptz default now()
);

create table if not exists test_cases (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid references problems(id) on delete cascade,
  input_text text not null default '',
  expected_output text not null,
  is_hidden boolean not null default true,
  weight integer not null default 1,
  created_at timestamptz default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  problem_id uuid references problems(id) on delete cascade,
  language text not null,
  source_code text not null,
  verdict text not null default 'Queued',
  passed_count integer not null default 0,
  total_count integer not null default 0,
  runtime_ms numeric,
  memory_kb integer,
  score integer not null default 0,
  created_at timestamptz default now()
);

create or replace view leaderboard as
with best_per_problem as (
  select
    s.team_id,
    s.problem_id,
    max(s.score) as best_score,
    min(s.created_at) filter (where s.score > 0) as first_accept_time
  from submissions s
  group by s.team_id, s.problem_id
)
select
  t.id as team_id,
  t.name as team_name,
  coalesce(sum(b.best_score), 0) as total_score,
  count(*) filter (where b.best_score > 0) as solved_count,
  min(b.first_accept_time) as first_solve_at
from teams t
left join best_per_problem b on b.team_id = t.id
group by t.id, t.name
order by total_score desc, solved_count desc, first_solve_at asc nulls last;
