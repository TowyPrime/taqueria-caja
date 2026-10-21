'use server'

import { crearClienteServidor } from "@/lib/supabase/servidor";
import { redirect } from "next/navigation";

export async function iniciarSesion(formData: FormData) {

    const email = String(formData.get('correo') ?? '').trim();
    const password = String(formData.get('password') ?? '').trim();

    const supabase = await crearClienteServidor();

    const {error} = await supabase.auth.signInWithPassword({email, password})

    if(error){
        redirect('/entrar?error=credenciales')
    }

    redirect('/')
}
    