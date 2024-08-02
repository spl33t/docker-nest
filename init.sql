-- Ensure dblink extension is available
CREATE EXTENSION IF NOT EXISTS dblink;

-- Conditionally create the database
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ams') THEN
      PERFORM dblink_exec('dbname=' || current_database(), 'CREATE DATABASE ams');
   END IF;
END
$$;
