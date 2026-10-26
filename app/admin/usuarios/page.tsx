import { Suspense } from "react";
import { exigirAdmin } from "@/lib/permisos";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export default function UsuariosPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Usuarios</h1>
      <Suspense fallback={<CardSkeletonList />}>
        <ListaUsuarios />
      </Suspense>
    </div>
  );
}

async function ListaUsuarios() {

  await exigirAdmin();

  const supabase = await crearClienteServidor();

  const { data: usuarios, error } = await supabase
    .from("perfiles")
    .select("nombre, rol, activo, creado_en")
    .order("creado_en", { ascending: false });

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
        Ocurrió un error al cargar la lista de usuarios. Inténtalo de nuevo más tarde.
      </div>
    );
  }

  if (!usuarios || usuarios.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No se encontraron usuarios registrados.</p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {usuarios.map((usuario, index) => (
        <div 
          key={index} 
          className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold text-base truncate">
                {usuario.nombre || "Sin nombre"}
              </h2>
              <span className="text-xs text-muted-foreground">
                Registrado: {new Date(usuario.creado_en).toLocaleDateString()}
              </span>
            </div>
            
            {/* Indicador de estado activo/inactivo */}
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                usuario.activo
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {usuario.activo ? "Activo" : "Inactivo"}
            </span>
          </div>

          <div className="pt-2 border-t flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Rol:</span>
            <span className="capitalize font-medium px-2 py-0.5 bg-accent rounded text-xs">
              {usuario.rol}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CardSkeletonList() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 rounded-xl border bg-card/50 h-28 animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}