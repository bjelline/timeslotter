DECLARE
  v_schedule_id VARCHAR2(36) := 'b61cf9f9-ba0d-4600-a345-ae255afb27bb';
  v_file_location VARCHAR2(255) := 'storage/csv_upload/mmp1.csv';
  v_csv_data CLOB;
BEGIN
  -- Read the CSV file into a CLOB variable
  v_csv_data := BFILENAME('CSV_DIR', v_file_location);

  -- Create a temporary table to hold the CSV data
  EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE temp_items (
                      item_name VARCHAR2(255)
                    ) ON COMMIT PRESERVE ROWS';

  -- Use SQL*Loader to load the CSV data into the temporary table
  EXECUTE IMMEDIATE 'ALTER SESSION SET skip_unusable_indexes = true';
  EXECUTE IMMEDIATE 'ALTER SESSION SET skip_index_maintenance = true';
  EXECUTE IMMEDIATE 'ALTER SESSION SET skip_undo_errors = true';
  EXECUTE IMMEDIATE 'ALTER SESSION SET events ''10131 trace name context forever, level 10''';

  EXECUTE IMMEDIATE 'LOAD DATA INFILE :csv_data
                    INTO TABLE temp_items
                    FIELDS TERMINATED BY '',''
                    OPTIONALLY ENCLOSED BY ''"''
                    TRAILING NULLCOLS
                    (item_name)'
  USING IN v_csv_data;

  -- Insert the data from the temporary table into the "items" table with the specified schedule_id
  INSERT INTO items (schedule_id, name)
  SELECT id, item_name
  FROM temp_items;

  -- Drop the temporary table
  EXECUTE IMMEDIATE 'DROP TABLE temp_items';
END;
-- supabase kann kein COPY
-- CREATE GLOBAL TEMPORARY TABLE temp_items (
--   item_name TEXT
-- );

-- COPY temp_items FROM 'storage/csv_upload/mmp1.csv' DELIMITER ','  CSV QUOTE AS '"' CSV HEADER;


INSERT INTO items (schedule_id, item_name)
  SELECT 'b61cf9f9-ba0d-4600-a345-ae255afb27bb' AS schedule_id, CONCAT("Name", ': ', "Projekt") AS item_name
  FROM temp_items;
