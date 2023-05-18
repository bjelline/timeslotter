-- drop function stop_schedule;


create function stop_schedule(p_schedule_id uuid, p_item_id uuid, p_must_fit boolean)
  returns integer
  language plpgsql
  as
$$
DECLARE
  v_row_number INTEGER;
BEGIN
  -- reorder - this item must be first
  UPDATE items SET end_at = NOW(), status = 'past' WHERE id = p_item_id;

  IF p_must_fit THEN
    v_row_number :=  plan_to_fit(p_schedule_id);
  ELSE
    v_row_number :=  plan_to_fixed_length(p_schedule_id);
  END IF;

  RETURN v_row_number - 1;
END;
$$;

GRANT EXECUTE ON FUNCTION stop_schedule TO authenticated;

-- select plan_to_fixed_length('b61cf9f9-ba0d-4600-a345-ae255afb27bb', 10);
