-- supabase kann kein COPY
-- CREATE GLOBAL TEMPORARY TABLE temp_items (
--   item_name TEXT
-- );

-- COPY temp_items FROM 'storage/csv_upload/mmp1.csv' DELIMITER ','  CSV QUOTE AS '"' CSV HEADER;


INSERT INTO items (schedule_id, item_name)
  SELECT 'b61cf9f9-ba0d-4600-a345-ae255afb27bb' AS schedule_id, CONCAT("Name", ': ', "Projekt") AS item_name
  FROM temp_items;
