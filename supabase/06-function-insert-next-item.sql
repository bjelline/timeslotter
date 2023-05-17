drop function insert_next_item;


create function insert_next_item(p_schedule_id uuid, p_name text)
  returns uuid
  language plpgsql as
$$
DECLARE
  v_start_timestamp timestamp with time zone;
  v_timeslot_interval INTERVAL;
  inserted_id uuid;
BEGIN
  v_start_timestamp := (select max end from items where schedule_id = p_schedule_id);
  v_timeslot_interval := (select time_per_slot from schedules where id = p_schedule_id) * interval '1 minute';

  -- Iterate over the cursor and update the planned_start_at and planned_end_at columns
  INSERT INTO items (schedule_id, name, planned_start_at, planned_end_at)
  VALUES (p_schedule_id, p_name, v_start_timestamp, v_start_timestamp + v_timeslot_interval)
  RETURNING id INTO inserted_id;

  -- Return the number of updated rows
  RETURN inserted_id;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_next_item TO authenticated;

