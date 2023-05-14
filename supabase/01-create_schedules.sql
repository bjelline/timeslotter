create table
  public.schedules (
    id uuid not null default uuid_generate_v4 (),
    start timestamp with time zone null,
    end timestamp with time zone null,
    hard_end timestamp with time zone null,
    created_at timestamp with time zone null default now(),
    time_per_slot smallint null default '10'::smallint,
    title character varying null default 'a new schedule'::character varying,
    description text null,
    user_id uuid null,
    constraint schedules_pkey primary key (id)
  ) tablespace pg_default;
