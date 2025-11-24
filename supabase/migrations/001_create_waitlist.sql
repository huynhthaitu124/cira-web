-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  language TEXT DEFAULT 'vi',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for waitlist signup)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all records
CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to do everything
CREATE POLICY "Allow service role all" ON waitlist
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to send welcome email (placeholder for Edge Function)
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be triggered when a new waitlist entry is created
  -- The actual email sending will be done via Supabase Edge Function
  -- or you can use pg_net extension to call external APIs
  
  -- For now, we just log it
  RAISE NOTICE 'New waitlist signup: %', NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to send email on new signup
CREATE TRIGGER on_waitlist_signup
  AFTER INSERT ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email();

-- Create view for waitlist stats (optional)
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT
  COUNT(*) as total_signups,
  COUNT(*) FILTER (WHERE email_sent = true) as emails_sent,
  COUNT(*) FILTER (WHERE language = 'vi') as vietnamese_users,
  COUNT(*) FILTER (WHERE language = 'en') as english_users,
  DATE_TRUNC('day', created_at) as signup_date
FROM waitlist
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY signup_date DESC;

-- Grant access to the view
GRANT SELECT ON waitlist_stats TO authenticated;
