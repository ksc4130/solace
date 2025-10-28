-- Create specialties table
CREATE TABLE IF NOT EXISTS "specialties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "specialties_name_unique" UNIQUE("name")
);

-- Create advocate_specialties junction table
CREATE TABLE IF NOT EXISTS "advocate_specialties" (
	"advocate_id" integer NOT NULL,
	"specialty_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "advocate_specialties_advocate_id_specialty_id_pk" PRIMARY KEY("advocate_id","specialty_id")
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "advocate_specialties" ADD CONSTRAINT "advocate_specialties_advocate_id_advocates_id_fk" FOREIGN KEY ("advocate_id") REFERENCES "public"."advocates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "advocate_specialties" ADD CONSTRAINT "advocate_specialties_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Migrate existing advocate specialty data from JSONB to normalized tables (if any)
DO $$
DECLARE
    advocate_record RECORD;
    specialty_text TEXT;
    specialty_id_val INTEGER;
BEGIN
    -- Create the many-to-many relationships for existing advocates
    FOR advocate_record IN 
        SELECT id, payload::jsonb as payload_json
        FROM advocates 
        WHERE payload IS NOT NULL AND payload != '[]'
    LOOP
        FOR specialty_text IN 
            SELECT jsonb_array_elements_text(advocate_record.payload_json)
        LOOP
            -- Get the specialty ID
            SELECT id INTO specialty_id_val 
            FROM specialties 
            WHERE name = specialty_text;

            -- Insert the relationship if specialty exists
            IF specialty_id_val IS NOT NULL THEN
                INSERT INTO advocate_specialties (advocate_id, specialty_id)
                VALUES (advocate_record.id, specialty_id_val)
                ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Note: The payload column is kept for now. 
-- After verifying the migration, you can drop it with:
-- ALTER TABLE advocates DROP COLUMN payload;
