-- Fix security warnings: Add search_path to immutable functions

CREATE OR REPLACE FUNCTION public.calculate_next_review(
  state TEXT,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  was_successful BOOLEAN
) RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  IF NOT was_successful THEN
    RETURN NOW() + INTERVAL '1 day';
  END IF;
  
  CASE state
    WHEN 'new' THEN RETURN NOW() + INTERVAL '1 day';
    WHEN 'learning' THEN RETURN NOW() + INTERVAL '3 days';
    WHEN 'familiar' THEN RETURN NOW() + INTERVAL '7 days';
    WHEN 'mastered' THEN RETURN NOW() + INTERVAL '30 days';
    WHEN 'reviewing' THEN RETURN NOW() + INTERVAL '60 days';
    ELSE RETURN NOW() + INTERVAL '1 day';
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.calculate_next_state(
  current_state TEXT,
  average_score DECIMAL
) RETURNS TEXT AS $$
BEGIN
  IF average_score >= 0.9 THEN
    CASE current_state
      WHEN 'new' THEN RETURN 'learning';
      WHEN 'learning' THEN RETURN 'familiar';
      WHEN 'familiar' THEN RETURN 'mastered';
      WHEN 'mastered' THEN RETURN 'reviewing';
      WHEN 'reviewing' THEN RETURN 'reviewing';
      ELSE RETURN current_state;
    END CASE;
  ELSIF average_score < 0.7 THEN
    CASE current_state
      WHEN 'familiar' THEN RETURN 'learning';
      WHEN 'mastered' THEN RETURN 'familiar';
      WHEN 'reviewing' THEN RETURN 'mastered';
      ELSE RETURN current_state;
    END CASE;
  END IF;
  
  RETURN current_state;
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public;