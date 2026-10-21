CREATE OR REPLACE FUNCTION public.es_usuario_activo()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.perfiles
    WHERE id = (SELECT auth.uid())
      AND activo = TRUE
  );
$$;