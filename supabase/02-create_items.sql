CREATE TYPE item_status AS ENUM ('past', 'current', 'future');

create table
  public.items (
    id uuid not null default uuid_generate_v4 (),
    created_at timestamp with time zone null default now(),
    start_at timestamp with time zone null,
    end_at timestamp with time zone null,
    schedule_id uuid null,
    name character varying null,
    status public.item_status not null default 'future'::item_status,
    constraint item_pkey primary key (id),
    constraint items_schedule_id_fkey foreign key (schedule_id) references schedules (id) on delete cascade
  ) tablespace pg_default;
