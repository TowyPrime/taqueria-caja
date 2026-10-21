import { iniciarSesion } from "./acciones"


interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EntrarPage({ searchParams }: PageProps) {
  const params = await searchParams
  const error = params.error

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Iniciar Sesión</h1>

      {error === 'credenciales' && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>
          Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.
        </p>
      )}

      <form action={iniciarSesion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="correo" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Correo electrónico
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="contrasena" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Contraseña
          </label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button type="submit" style={{ padding: '0.75rem', cursor: 'pointer' }}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  )
}