
-- Audits table: one row per chat analysis
CREATE TABLE public.audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  field TEXT NOT NULL,
  specialty TEXT NOT NULL,
  optimization TEXT NOT NULL,
  query TEXT NOT NULL,
  ai_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit recommendations: the 3 material cards per audit
CREATE TABLE public.audit_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  profile TEXT NOT NULL, -- 'Best Overall', 'Ecological Profile', 'Economic Profile'
  material_name TEXT NOT NULL,
  category TEXT NOT NULL,
  score NUMERIC NOT NULL DEFAULT 0,
  sustainability NUMERIC NOT NULL DEFAULT 0,
  co2 NUMERIC NOT NULL DEFAULT 0,
  cost NUMERIC NOT NULL DEFAULT 0,
  co2_saved NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies for audits
CREATE POLICY "Users can view their own audits"
  ON public.audits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own audits"
  ON public.audits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own audits"
  ON public.audits FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for recommendations (via audit ownership)
CREATE POLICY "Users can view their audit recommendations"
  ON public.audit_recommendations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.audits WHERE audits.id = audit_id AND audits.user_id = auth.uid()));
CREATE POLICY "Users can create audit recommendations"
  ON public.audit_recommendations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.audits WHERE audits.id = audit_id AND audits.user_id = auth.uid()));

-- Indexes
CREATE INDEX idx_audits_user_id ON public.audits(user_id);
CREATE INDEX idx_audit_recommendations_audit_id ON public.audit_recommendations(audit_id);
