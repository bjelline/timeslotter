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

  -- Iterate over the cursor and update the start_at and end_at columns
  INSERT INTO items (schedule_id, name, start_at, end_at)
  VALUES (p_schedule_id, p_name, v_start_timestamp, v_start_timestamp + v_timeslot_interval)
  RETURNING id INTO inserted_id;

  -- Return the number of updated rows
  RETURN inserted_id;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_next_item TO authenticated;
