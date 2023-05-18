drop function plan_to_fit;

create function plan_to_fit(p_schedule_id uuid)
returns integer
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
    WHERE schedule_id = p_schedule_id;
BEGIN
  v_start_timestamp := (select start from schedules where id = p_schedule_id);
  v_timeslot_interval := (select end"-"start"  from schedules where id = p_schedule_id) / v_count;

  -- Iterate over the cursor and update the start_at and end_at columns
  FOR item_rec IN c_items LOOP
    UPDATE items
    SET start_at = v_start_timestamp + ((v_row_number - 1) * v_timeslot_interval),
        end_at = v_start_timestamp + (v_row_number * v_timeslot_interval)
    WHERE items.id = item_rec.id;

    v_row_number := v_row_number + 1;
  END LOOP;

  -- Return the number of updated rows
  RETURN v_row_number - 1;
END;
$$;

GRANT EXECUTE ON FUNCTION plan_to_fit TO authenticated;


select plan_to_fit('b61cf9f9-ba0d-4600-a345-ae255afb27bb');

