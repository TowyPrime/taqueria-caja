'use server'

import { crearClienteServidor } from "@/lib/supabase/servidor";
import { redirect } from "next/navigation";

export async function iniciarSesion(formData: FormData) {

    const email = String(formData.get('correo') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    const supabase = await crearClienteServidor();

    const {error} = await supabase.auth.signInWithPassword({email, password})

    if(error){
        redirect('/entrar?error=credenciales')
    }

    redirect('/')
}

export async function cerrarSesion() {

    const supabase = await crearClienteServidor();

    const {error} = await supabase.auth.signOut();

    if(error){
        console.error("ocurrio un error al cerrar sesión:", error);
    }

    redirect('/entrar')
}
    