import { supabase } from '@/lib/supabaseClient'
import { RestauranteInput } from '@/lib/types'

// Obtener los datos del restaurante
export async function getRestaurante() {
  return await supabase
    .from('restaurante')
    .select('*')
    .order('id', { ascending: true })
    .limit(1)
    .single()
}


// Agregar un nuevo restaurante (solo se usa si no hay ninguno)
export async function addRestaurante(data: RestauranteInput) {
  return await supabase.from('restaurante').insert(data).select().single()
}

// Editar restaurante (por ID)
export async function updateRestaurante(id: number, data: RestauranteInput) {
  return await supabase.from('restaurante').update(data).eq('id', id).select().single()
}

// Eliminar restaurante
export async function deleteRestaurante(id: number) {
  return await supabase.from('restaurante').delete().eq('id', id)
}
