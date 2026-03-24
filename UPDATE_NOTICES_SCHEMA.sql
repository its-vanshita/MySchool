-- Update ms_notices to support advanced targeting for both Admin and Teachers

ALTER TABLE public.ms_notices
ADD COLUMN IF NOT EXISTS target_audience TEXT DEFAULT 'all',
ADD COLUMN IF NOT EXISTS target_classes UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_teachers UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_students UUID[] DEFAULT '{}';

-- The target_audience can be: 'all', 'students', 'teachers', 'specific_classes', 'specific_teachers', 'specific_students'

-- You no longer solely rely on class_id, but it remains for backward compatibility.
