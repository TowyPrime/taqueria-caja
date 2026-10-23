import { crearClienteServidor } from "@/lib/supabase/servidor";
import { cerrarSesion } from "./entrar/acciones";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950 p-4">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-12">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Gestión de caja Taquería Lety
        </h1>
        <div className="my-6">
          <Suspense fallback={null}>
            <SaludoUsuario />
          </Suspense>
        </div>

        <form action={cerrarSesion} className="mt-8">
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400"
          >
            Cerrar sesión
          </button>
        </form>
      </main>
    </div>
  );
}

async function SaludoUsuario() {
  let mensaje;

  const supabase = await crearClienteServidor();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/entrar")
  }

  const userId = data?.claims.sub;

  const { data: profile, error: profileError } = await supabase
    .from("perfiles")
    .select("nombre, rol")
    .eq("id", userId)
    .single();

  if (profileError) {
    mensaje = "No se encontró el perfil de usuario";
  } else {
    mensaje = `Hola ${profile?.nombre} eres (${profile?.rol})`;
  }

  return (
    <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
      {mensaje}
    </p>
  );
}
