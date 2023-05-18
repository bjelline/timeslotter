drop function insert_next_item;

create function insert_next_item(p_schedule_id uuid, p_name text)
  returns items
  language plpgsql as
$$
DECLARE
  v_start_timestamp timestamp with time zone;
  v_end_timestamp timestamp with time zone;
  v_create_at timestamp with time zone;
  v_timeslot_interval INTERVAL;
  v_inserted_item_id uuid;
  v_status public.item_status;
  output_rec items;
BEGIN
  v_start_timestamp := (SELECT MAX(possible_start) AS max_possible_start
FROM (
  SELECT MAX(end_at) AS possible_start
  FROM items
  WHERE schedule_id = p_schedule_id
  UNION ALL
  SELECT start AS possible_start
  FROM schedules
  WHERE id = p_schedule_id
) AS subquery);
  v_timeslot_interval := (select time_per_slot from schedules where id = p_schedule_id) * interval '1 minute';
  v_end_timestamp := v_start_timestamp + v_timeslot_interval;
  -- Iterate over the cursor and update the start_at and end_at columns
  INSERT INTO items (schedule_id, name, start_at, end_at)
  VALUES (p_schedule_id, p_name, v_start_timestamp, v_end_timestamp)
  RETURNING id, created_at, "status" INTO v_inserted_item_id, v_create_at, v_status;

  -- item:
  -- id uuid not null default uuid_generate_v4 (),
  -- created_at timestamp with time zone null default now(),
  -- start_at timestamp with time zone null,
  -- end_at timestamp with time zone null,
  -- schedule_id uuid null,
  -- name character varying null,
  -- status
  output_rec := (v_inserted_item_id, v_create_at,
    v_start_timestamp, v_end_timestamp,
    p_schedule_id, p_name, v_status);

  RETURN output_rec;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_next_item TO authenticated;
