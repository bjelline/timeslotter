create table
  public.items (
    id uuid not null default uuid_generate_v4 (),
    created_at timestamp with time zone null default now(),
    planned_start_at timestamp with time zone null,
    planned_end_at timestamp with time zone null,
    predicted_start_at timestamp with time zone null,
    predicted_end_at timestamp with time zone null,
    started_at timestamp with time zone null,
    ended_at timestamp with time zone null,
    schedule_id uuid null,
    name character varying null,
    constraint item_pkey primary key (id),
    constraint items_schedule_id_fkey foreign key (schedule_id) references schedules (id)
  ) tablespace pg_default;
