-- Add version_id column to user_passages
ALTER TABLE user_passages 
ADD COLUMN version_id uuid REFERENCES bible_versions(id);

-- Default existing passages to KJV
UPDATE user_passages SET version_id = '86f77392-e93a-42f9-8997-efe2680bac31';

-- Make it required going forward
ALTER TABLE user_passages ALTER COLUMN version_id SET NOT NULL;