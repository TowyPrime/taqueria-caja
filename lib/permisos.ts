import { connection } from "next/server";
import { crearClienteServidor } from "./supabase/servidor";
import { redirect } from "next/navigation";

export async function exigirAdmin() {
  await connection();
  const supabase = await crearClienteServidor();

  const { data } = await supabase.auth.getClaims();
  const id = data?.claims.sub;

  if (!id) redirect("/entrar");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, activo")
    .eq("id", id)
    .single();

  if (perfil?.rol !== "admin" || !perfil?.activo) redirect("/");
  return perfil;
}
