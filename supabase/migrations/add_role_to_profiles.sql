-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- Create an index on the role column for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Update existing profiles to have the 'customer' role
UPDATE profiles SET role = 'customer' WHERE role IS NULL;

-- Set the test user as admin (replace with your actual admin user ID)
UPDATE profiles SET role = 'admin' WHERE id = 'test-user-id';

