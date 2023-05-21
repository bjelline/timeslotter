drop function reorder_items;


create function reorder_items(p_item_ids uuid[], p_schedule_id uuid)
  returns setof items
  language plpgsql
  as
$$
DECLARE
  items_table items[];
BEGIN
  RETURN QUERY SELECT * FROM items WHERE schedule_id = p_schedule_id ORDER BY start_at;
END;
$$;

GRANT EXECUTE ON FUNCTION reorder_items TO authenticated;

-- select plan_to_fixed_length('b61cf9f9-ba0d-4600-a345-ae255afb27bb', 10);

select id, name, start_at, end_at from items where id IN (
'673171cf-dd8b-4a2e-a249-bd580f4b70e9','bbc70c38-7195-464e-864e-7c9dc4a9202a','edad3879-4748-4c09-b691-c5eb27af0ffc','1467297d-bdcb-441d-bb61-aa46fed39172','59319a51-1307-4283-953a-253bd893870e','8136cf1e-500d-4d2d-af27-997a53940ad3','55797f2c-ba25-42ed-9a20-5a3f6791b601','440efbfb-7401-4a86-8eb8-6c2aad1219ad','b34809ed-f249-4de5-8c47-b5236942a60b','79824c06-127b-4d6a-9390-828f7609cb47','1cf25aca-7879-4ec9-ad7e-929fd4b8fd19','01c69681-d2de-4054-82de-2fa1c5dcb89d','b522e6e7-439f-45db-9cbf-e9c4127770ee','9d940c1e-345a-4c2f-8f2c-1775248a6bc7'
);


