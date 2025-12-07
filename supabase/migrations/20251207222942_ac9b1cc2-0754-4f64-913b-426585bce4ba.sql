-- Create search_history table for logged-in users
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Users can only view their own search history
CREATE POLICY "Users can view their own search history"
ON public.search_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own search history
CREATE POLICY "Users can create their own search history"
ON public.search_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own search history
CREATE POLICY "Users can delete their own search history"
ON public.search_history
FOR DELETE
USING (auth.uid() = user_id);