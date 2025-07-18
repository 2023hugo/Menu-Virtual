// services/auth.ts
import { supabase } from '@/lib/supabaseClient'

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Suponiendo que el usuario tiene un rol que está almacenado en su metadata o en la base de datos
  const user = data?.user
  if (user) {
    // Suponiendo que el rol del usuario se encuentra en su metadata o en una tabla asociada
    const rol = user?.role || 'cliente' // Si no tienes rol, usa 'cliente' como predeterminado.
    return { rol }
  }

  return { error: 'Error desconocido' }
}
