import { supabase } from '@/lib/supabaseClient'

export async function getCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('id', { ascending: true })
  return { data, error }
}

export async function addCategoria(categoria: { nombre: string }) {
  const { data, error } = await supabase
    .from('categorias')
    .insert(categoria)
    .select()
    .single()
  return { data, error }
}

export async function updateCategoria(id: number, categoria: { nombre: string }) {
  const { data, error } = await supabase
    .from('categorias')
    .update(categoria)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteCategoria(id: number) {
  const { error } = await supabase.from('categorias').delete().eq('id', id)
  return { error }
}
