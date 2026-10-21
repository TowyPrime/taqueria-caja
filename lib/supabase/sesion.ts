import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function actualizarSesion(request: NextRequest) {
  
  let respuesta = NextResponse.next({
    request,
  })


  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Primero escribe cada cookie en request.cookies
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          // Recrea la respuesta y escribe las cookies en respuesta.cookies
          respuesta = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            respuesta.cookies.set(name, value, options)
          })
        },
      },
    }
  )


  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  const url = request.nextUrl.clone()

 
  if (!claims && !url.pathname.startsWith('/entrar')) {
    url.pathname = '/entrar'
    return NextResponse.redirect(url)
  }

  if (claims && url.pathname === '/entrar') {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return respuesta
}