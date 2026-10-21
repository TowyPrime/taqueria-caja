create type rol_usuario as enum(
  'admin',
  'empleado'
);

create table perfiles(
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol rol_usuario not null default 'empleado',
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

CREATE OR REPLACE FUNCTION public.es_admin()
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
      AND rol = 'admin'
      AND activo = TRUE
  );
$$;

alter table public.perfiles enable row level security;

CREATE POLICY "Ver perfil propio o todos si es admin"
ON public.perfiles
FOR SELECT
TO authenticated
USING (
  (SELECT auth.uid()) = id
  OR (SELECT public.es_admin())
);

CREATE POLICY "Solo admins pueden actualizar perfiles"
ON public.perfiles
FOR UPDATE
TO authenticated
USING (
  (SELECT public.es_admin())
)
WITH CHECK (
  (SELECT public.es_admin())
);

CREATE OR REPLACE FUNCTION public.crear_perfil()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'nombre', ''), NEW.email)
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER after_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.crear_perfil();

revoke execute on function public.crear_perfil() from public, anon, authenticated;