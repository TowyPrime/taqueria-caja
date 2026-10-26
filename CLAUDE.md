@AGENTS.md

# taqueria-caja

Control de ingresos, egresos y utilidad semanal de una taquería. Next.js 16 (App Router) + TypeScript + Tailwind + Supabase. App web pensada para móvil y Windows.

## Forma de trabajo con el dueño del proyecto (modo tutor)
- Es un estudiante: quiere aprender, se confunde si solo le doy pistas y siente que no aprende si le doy el código completo.
- Por cada tarea: objetivo en una línea, pasos numerados y concretos ("en el archivo X, haz Y"), nombres exactos de funciones/conceptos, y qué probar.
- Si el tema ya se vio, remitirlo al archivo y función donde lo hizo, sin pegar código. Si es nuevo, mostrar un ejemplo resuelto de un problema parecido pero distinto (con código) y que él lo adapte.
- Él escribe el código; yo reviso señalando errores con explicación breve del porqué. Si se atora de verdad, dar un esqueleto con huecos.
- Tareas cortas, con un solo concepto nuevo. Al terminar, hacerle 1-3 preguntas para que explique con sus palabras, y proponer un ejercicio de "romperlo a propósito".
- No editar sus archivos salvo que lo pida ("colócalos tú"). Este CLAUDE.md sí fue pedido por él.
- Verificar siempre en disco lo que dice haber hecho; correr `npx tsc --noEmit` y `npx eslint .`. Si algo falla en ejecución, pedir el log de la terminal donde corre `npm run dev`.
- Decisiones técnicas las propongo yo con recomendación; al dueño solo le pregunto lo que depende del negocio.
- Sin emojis, respuestas claras, en español.
- Next 16 tiene cambios: leer la guía relevante en `node_modules/next/dist/docs/` antes de proponer APIs (por ejemplo, `middleware` ahora es `proxy.ts`; `cookies()` y `searchParams` son promesas).

## Reglas de Next 16 en este proyecto
- `next.config.ts` trae `cacheComponents: true` (viene de la plantilla). Toda lectura de datos de la petición (`cookies()`, `headers()`, `params`, `searchParams`) o consulta a Supabase con el cliente de servidor debe ir dentro de un componente envuelto en `<Suspense>`. La página principal no hace `await` de esos datos: pasa la promesa a un componente hijo `async`. Si no, aparece el error "blocking-prerender-runtime".
- Los componentes que usan Supabase con sesión (`getClaims`, `getUser`, consultas) llaman internamente a `Date.now()`: deben ir en `<Suspense>` y empezar con `await connection()` (de `next/server`), antes de crear el cliente. Si no, aparece el error "blocking-prerender-current-time" en desarrollo.
- Verificar con `npm run build`: las rutas deben salir como `◐` (prerender parcial) o `○`, sin errores.
- No exportar componentes extra desde archivos `page.tsx` si no hace falta.

## Requisitos del negocio
- El negocio trabaja jueves, viernes, sábado y domingo. La utilidad semanal se calcula de jueves a domingo.
- Se captura el ingreso de cada día (efectivo y terminal) y los gastos.
- El admin decide quién usa la app. Los usuarios se crean por invitación de Supabase (`inviteUserByEmail`, con la clave `service_role` solo en servidor, nunca `NEXT_PUBLIC_`). Registro público desactivado.
- Proveedores (mínimo el nombre) y catálogo de productos para selección rápida; poder agregar un producto nuevo al vuelo; precios modificables (las verduras varían por peso y temporada). Cada renglón de compra guarda su propio `precio_unitario`; el precio del catálogo es solo sugerido.

## Modelo de datos (planeado)
`perfiles` (hecha), `proveedores`, `productos`, `ingresos`, `compras`, `compras_detalle`, `gastos`.
- RLS activo en todas las tablas desde el inicio. Las políticas de datos deben exigir `public.es_usuario_activo()`; las de administración, `public.es_admin()`.
- Fechas siempre en hora local (no usar `toISOString().split('T')[0]`, da fecha UTC y desplaza el día en la noche). Crear un helper `fechaLocalISO` en `lib/` cuando se necesite.
- Inserciones compuestas (compra + detalle) con una función RPC de Postgres para que sean atómicas.

## Estructura
- `proxy.ts` (raíz): llama a `actualizarSesion`; redirige a `/entrar` sin sesión.
- `lib/supabase/cliente.ts` (`crearClienteNavegador`), `servidor.ts` (`crearClienteServidor`, async), `sesion.ts` (`actualizarSesion`, usa `getClaims()`).
- `app/entrar/` (`page.tsx` + `acciones.ts`): login con Server Action.
- `supabase/migraciones/`: SQL ejecutado a mano en el SQL Editor de Supabase (`001_perfiles.sql`, `002_es_usuario_activo.sql`). Cada cambio nuevo va en un archivo numerado nuevo; no editar los ya ejecutados.
- Variables de entorno: `.env.local` (no se guarda en git) con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`; `.env.example` guarda los nombres.

## Fases
1. Base del proyecto y conexión con Supabase: HECHA.
2. Login, `perfiles` y RLS: HECHA (2A SQL, 2B clientes y proxy, 2C login, 2D saludo con lectura de `perfiles` bajo RLS, cerrar sesión con `signOut({ scope: 'local' })`).
3. **EN CURSO** Admin: invitar y desactivar usuarios; pantalla para que el invitado defina su contraseña; evitar que el último admin se desactive o se quite el rol.
4. Catálogos: proveedores y productos.
5. Captura de ingresos del día.
6. Captura de compras y gastos.
7. Resumen semanal (jueves a domingo).
8. Despliegue en Vercel.

## Dónde me quedé
- 2026-10-23: fase 2 completa y commiteada. `/` saluda con nombre y rol leyendo `perfiles` (componente `SaludoUsuario` dentro de `<Suspense>`); `/entrar` funciona; "Cerrar sesión" funciona.
- Pendiente menor: su `nombre` en `perfiles` es su correo (valor por defecto del trigger); puede actualizarlo. Confirmar que su `rol` volvió a `admin` tras la prueba de la predicción.
- Siguiente, fase 3 en subtareas: 3A cliente admin con la clave secreta (`lib/supabase/admin.ts`, `import 'server-only'`, variable `SUPABASE_SERVICE_ROLE_KEY` sin prefijo `NEXT_PUBLIC_`, nombre en `.env.example`); 3B página `/admin/usuarios` solo para admin (lista `perfiles`); 3C formulario de invitación con `inviteUserByEmail`; 3D pantalla para que el invitado defina su contraseña; 3E activar/desactivar y proteger al último admin.
- Conceptos que ya entendió: `cookies()`/`searchParams` asíncronos y `<Suspense>`; el proxy es solo portero y la seguridad real es RLS; `redirect()` lanza una excepción y no va dentro de `try/catch`; los `name` del formulario deben coincidir con `formData.get`.
- Corrección pendiente de concepto: la política de `select` de `perfiles` permite ver el perfil propio (`auth.uid() = id`) aunque cambie el rol; el rol solo importa para ver perfiles ajenos y para actualizar.
