drop function plan_to_fit;

create function plan_to_fit(p_schedule_id uuid)
returns setof items
language plpgsql
as $$
DECLARE
  v_start_timestamp timestamp with time zone;
  v_count INTEGER := (SELECT COUNT(*) FROM items WHERE schedule_id = p_schedule_id);
  v_timeslot_interval INTERVAL;
  v_row_number INTEGER := 1;
  c_items CURSOR FOR
    SELECT id
    FROM items
    WHERE schedule_id = p_schedule_id
    AND NOT (status = 'past');
BEGIN
  v_start_timestamp := (SELECT MAX(possible_start) AS max_possible_start
    FROM (
      SELECT MAX(end_at) AS possible_start
      FROM items
      WHERE schedule_id = p_schedule_id
      AND NOT (status = 'future')
      UNION ALL
      SELECT start AS possible_start
      FROM schedules
      WHERE id = p_schedule_id
      UNION ALL
      SELECT NOW() AS possible_start
    ) AS subquery);
  v_timeslot_interval := (select "end"-v_start_timestamp from schedules where id = p_schedule_id) / v_count;

  -- Iterate over the cursor and update the start_at and end_at columns
  FOR item_rec IN c_items LOOP
    UPDATE items
    SET start_at = v_start_timestamp + ((v_row_number - 1) * v_timeslot_interval),
        end_at = v_start_timestamp + (v_row_number * v_timeslot_interval)
    WHERE items.id = item_rec.id;

    v_row_number := v_row_number + 1;
  END LOOP;

  -- Return the number of updated rows
  RETURN QUERY select * from items where schedule_id = p_schedule_id order by start_at;
END;
$$;

GRANT EXECUTE ON FUNCTION plan_to_fit TO authenticated;
