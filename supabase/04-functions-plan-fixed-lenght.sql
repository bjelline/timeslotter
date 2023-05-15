drop function plan_to_fixed_length;

create function plan_to_fixed_length(p_schedule_id uuid)
returns integer
language plpgsql
as $$
DECLARE
  v_start_timestamp timestamp with time zone;
  v_timeslot_interval INTERVAL;
  v_row_number INTEGER := 1;
  c_items CURSOR FOR
    SELECT id
    FROM items
    WHERE schedule_id = p_schedule_id;
BEGIN
  v_start_timestamp := (select start from schedules where id = p_schedule_id);
  v_timeslot_interval := (select time_per_slot from schedules where id = p_schedule_id) * interval '1 minute';

  -- Iterate over the cursor and update the planned_start_at and planned_end_at columns
  FOR item_rec IN c_items LOOP
    UPDATE items
    SET planned_start_at = v_start_timestamp + ((v_row_number - 1) * v_timeslot_interval),
        planned_end_at = v_start_timestamp + (v_row_number * v_timeslot_interval)
    WHERE items.id = item_rec.id;

    v_row_number := v_row_number + 1;
  END LOOP;

  -- Return the number of updated rows
  RETURN v_row_number - 1;
END;
$$;

GRANT EXECUTE ON FUNCTION plan_to_fixed_length TO authenticated;


-- select plan_to_fixed_length('b61cf9f9-ba0d-4600-a345-ae255afb27bb', 10);

