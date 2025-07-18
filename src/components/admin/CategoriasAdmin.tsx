'use client'

import { useEffect, useState } from 'react'
import { getCategorias, addCategoria, updateCategoria, deleteCategoria } from '@/services/categorias'
import toast from 'react-hot-toast'


type Categoria = {
  id: number
  nombre: string
}

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nombre, setNombre] = useState('')
  const [editandoId, setEditandoId] = useState<number | null>(null)

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    const { data, error } = await getCategorias()
    if (error) console.error('Error al obtener categorías:', error)
    if (data) setCategorias(data)
  }

  const handleAgregar = async () => {
    if (!nombre.trim()) return toast.error('El nombre no puede estar vacío.')
    const { error } = await addCategoria({ nombre })
    if (error) {
      toast.error('Error al agregar categoría.')
      console.error(error)
    } else {
      toast.success('Categoría agregada correctamente.')
    }
    setNombre('')
    cargarCategorias()
  }

  const handleEditar = async () => {
    if (!editandoId || !nombre.trim()) return toast.error('El nombre no puede estar vacío.')
    const { error } = await updateCategoria(editandoId, { nombre })
    if (error) {
      toast.error('Error al editar categoría.')
      console.error(error)
    } else {
      toast.success('Categoría actualizada.')
    }
    setEditandoId(null)
    setNombre('')
    cargarCategorias()
  }

  const handleEliminar = async (id: number) => {
    const confirm = window.confirm('¿Estás seguro de eliminar esta categoría?')
    if (!confirm) return
    const { error } = await deleteCategoria(id)
    if (error) {
      toast.error('Error al eliminar categoría.')
      console.error(error)
    } else {
      toast.success('Categoría eliminada.')
    }
    cargarCategorias()
  }
  const comenzarEdicion = (categoria: Categoria) => {
    setEditandoId(categoria.id)
    setNombre(categoria.nombre)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📂 Gestión de Categorías</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          placeholder="Nombre de la categoría"
        />
        {editandoId ? (
          <button onClick={handleEditar} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Guardar
          </button>
        ) : (
          <button onClick={handleAgregar} className="bg-rose-600 text-white px-4 py-2 rounded">
            Agregar
          </button>
        )}
      </div>

      <ul className="divide-y bg-white rounded shadow">
        {categorias.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center px-4 py-2">
            <span>{cat.nombre}</span>
            <div className="flex gap-2">
              <button
                onClick={() => comenzarEdicion(cat)}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(cat.id)}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
