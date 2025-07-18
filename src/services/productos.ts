import { supabase } from '@/lib/supabaseClient'
import { ProductoInput } from '@/lib/types'

export async function getProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*, categorias(nombre)')
    .order('id')
  return { data, error }
}

export async function addProducto(producto: ProductoInput) {
  const { data, error } = await supabase.from('productos').insert(producto).select().single()
  return { data, error }
}

export async function updateProducto(id: number, producto: ProductoInput) {
  const { data, error } = await supabase.from('productos').update(producto).eq('id', id).select().single()
  return { data, error }
}

export async function deleteProducto(id: number) {
  const { error } = await supabase.from('productos').delete().eq('id', id)
  return { error }
}
export async function getProductosDisponibles() {
  return await supabase
    .from('productos')
    .select('*, categorias(nombre)')
    .eq('estado', 'disponible')
    .order('categoria_id', { ascending: true })
    .order('id', { ascending: true })
}
