'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  getProductos,
  addProducto,
  updateProducto,
  deleteProducto
} from '@/services/productos'
import { getCategorias } from '@/services/categorias'

type Producto = {
  id: number
  nombre: string
  descripcion?: string
  precio: number
  imagen_url?: string
  estado: 'disponible' | 'Agotado'
  categoria_id: number
  categorias: {
    nombre: string
  }
}

type Categoria = {
  id: number
  nombre: string
}

export default function ProductosAdmin() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen_url: '',
    estado: 'disponible',
    categoria_id: ''
  })
  const [editandoId, setEditandoId] = useState<number | null>(null)

  useEffect(() => {
    cargarProductos()
    cargarCategorias()
  }, [])

  const cargarProductos = async () => {
    const { data, error } = await getProductos()
    if (error) toast.error('Error al cargar productos')
    if (data) setProductos(data)
  }

  const cargarCategorias = async () => {
    const { data, error } = await getCategorias()
    if (error) toast.error('Error al cargar categorías')
    if (data) setCategorias(data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const limpiarForm = () => {
    setForm({
      nombre: '',
      descripcion: '',
      precio: '',
      imagen_url: '',
      estado: 'disponible',
      categoria_id: ''
    })
    setEditandoId(null)
  }

  const handleAgregar = async () => {
    const { nombre, precio, categoria_id } = form
    if (!nombre || !precio || !categoria_id) {
      toast.error('Nombre, precio y categoría son obligatorios.')
      return
    }

    const { error } = await addProducto({
      nombre,
      descripcion: form.descripcion,
      precio: parseFloat(precio),
      imagen_url: form.imagen_url,
      estado: form.estado as 'disponible' | 'Agotado',
      categoria_id: parseInt(categoria_id)
    })

    if (error) {
      toast.error('Error al agregar producto')
    } else {
      toast.success('Producto agregado correctamente')
      limpiarForm()
      cargarProductos()
    }
  }

  const handleEditar = async () => {
    if (!editandoId) return

    const { nombre, precio, categoria_id } = form
    if (!nombre || !precio || !categoria_id) {
      toast.error('Nombre, precio y categoría son obligatorios.')
      return
    }

    const { error } = await updateProducto(editandoId, {
      nombre,
      descripcion: form.descripcion,
      precio: parseFloat(precio),
      imagen_url: form.imagen_url,
      estado: form.estado as 'disponible' | 'Agotado',
      categoria_id: parseInt(categoria_id)
    })

    if (error) {
      toast.error('Error al editar producto')
    } else {
      toast.success('Producto actualizado')
      limpiarForm()
      cargarProductos()
    }
  }

  const handleEliminar = async (id: number) => {
    const confirm = window.confirm('¿Eliminar producto?')
    if (!confirm) return

    const { error } = await deleteProducto(id)
    if (error) {
      toast.error('Error al eliminar producto')
    } else {
      toast.success('Producto eliminado')
      cargarProductos()
    }
  }

  const comenzarEdicion = (prod: Producto) => {
    setEditandoId(prod.id)
    setForm({
      nombre: prod.nombre,
      descripcion: prod.descripcion || '',
      precio: String(prod.precio),
      imagen_url: prod.imagen_url || '',
      estado: prod.estado,
      categoria_id: String(prod.categoria_id)
    })
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🍽️ Gestión de Productos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="border px-3 py-2 rounded"
        />
        <input
          name="precio"
          value={form.precio}
          onChange={handleChange}
          placeholder="Precio"
          className="border px-3 py-2 rounded"
          type="number"
        />
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="border px-3 py-2 rounded col-span-full"
        />
        <input
          name="imagen_url"
          value={form.imagen_url}
          onChange={handleChange}
          placeholder="URL de imagen"
          className="border px-3 py-2 rounded"
        />
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="disponible">Disponible</option>
          <option value="Agotado">Agotado</option>
        </select>
        <select
          name="categoria_id"
          value={form.categoria_id}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">Seleccione categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {editandoId ? (
        <button onClick={handleEditar} className="bg-yellow-500 text-white px-4 py-2 rounded mb-6">
          Guardar cambios
        </button>
      ) : (
        <button onClick={handleAgregar} className="bg-rose-600 text-white px-4 py-2 rounded mb-6">
          Agregar producto
        </button>
      )}

      <div className="bg-white shadow rounded">
        {productos.map((p) => (
          <div key={p.id} className="flex justify-between items-center border-b px-4 py-3">
            <div>
              <p className="font-bold">{p.nombre}</p>
              <p className="text-sm text-gray-600">
                {p.descripcion} | S/. {p.precio.toFixed(2)} | {p.estado} |{' '}
                <span className="italic">{p.categorias?.nombre}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => comenzarEdicion(p)} className="bg-blue-500 text-white px-3 py-1 rounded">
                Editar
              </button>
              <button onClick={() => handleEliminar(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
