import { iniciarSesion } from "./acciones";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function EntrarPage({ searchParams }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 rounded-full dark:bg-amber-950 dark:text-amber-300">
            Taquería Lety
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Iniciar sesión
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Ingresa tus datos para acceder al sistema
          </p>
        </div>
        <Suspense fallback={null}>
          <AvisoError searchParams={searchParams} />
        </Suspense>

        {/* Formulario */}
        <form action={iniciarSesion} className="mt-8 space-y-5">
          <div>
            <label
              className="block text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
              htmlFor="correo"
            >
              Correo electrónico
            </label>
            <input
              id="correo"
              type="email"
              name="correo"
              autoComplete="email"
              required
              placeholder="tu@correo.com"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-950 text-base placeholder-zinc-400 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          <div>
            <label
              className="block text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-950 text-sm placeholder-zinc-400 shadow-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 active:scale-[0.99] dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

async function AvisoError({ searchParams }: Props) {
  const params = await searchParams;

  if (params.error !== "credenciales") return null;

  return (
    <div className="bg-red-500 text-white p-4 rounded-md shadow-md my-4 flex items-center justify-between">
      <p className="font-medium">
        Error: Credenciales inválidas. Por favor, verifica tus datos e intenta
        nuevamente.
      </p>
    </div>
  );
}
