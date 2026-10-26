import 'server-only'

import { createClient } from '@supabase/supabase-js'

export function crearClienteAdmin(){
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if(!supabaseUrl || !supabaseSecretKey){
    throw new Error('Faltan las variables de entorno obligatorias para el cliente de Supabase.');
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth:{
      autoRefreshToken: false,
      persistSession: false,
    }
  })

}