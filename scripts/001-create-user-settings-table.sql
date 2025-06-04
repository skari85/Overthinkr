-- Create a table to store user-specific settings, including API keys
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  groq_api_key text,
  openrouter_api_key text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS) for the user_settings table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own settings
DROP POLICY IF EXISTS "Users can view their own settings." ON public.user_settings;
CREATE POLICY "Users can view their own settings." ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own settings
DROP POLICY IF EXISTS "Users can insert their own settings." ON public.user_settings;
CREATE POLICY "Users can insert their own settings." ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own settings
DROP POLICY IF EXISTS "Users can update their own settings." ON public.user_settings;
CREATE POLICY "Users can update their own settings." ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Set up trigger to update 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
