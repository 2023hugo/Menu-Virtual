'use client'

import { useEffect, useState } from 'react'
import {
  addRestaurante,
  getRestaurante,
  updateRestaurante,
  deleteRestaurante,
} from '@/services/restaurante'
import { RestauranteInput } from '@/lib/types'
import { toast } from 'react-hot-toast'

export default function RestauranteAdmin() {
  const [form, setForm] = useState<RestauranteInput>({
    nombre: '',
    mensaje_bienvenida: '',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    whatsapp_url: '',
  })

  const [restauranteId, setRestauranteId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Obtener restaurante al cargar
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getRestaurante()
      if (error) {
        toast.error('Error al obtener restaurante')
        console.error(error)
      }
      if (data) {
        setForm(data)
        setRestauranteId(data.id)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre) {
      toast.error('El nombre es obligatorio.')
      return
    }

    const { data, error } = restauranteId
      ? await updateRestaurante(restauranteId, form)
      : await addRestaurante(form)

    if (error) {
      toast.error('Error al guardar restaurante.')
      console.error(error)
    } else {
      toast.success(`Restaurante ${restauranteId ? 'actualizado' : 'registrado'} correctamente`)
      setForm(data)
      setRestauranteId(data.id)
    }
  }

  const handleEliminar = async () => {
    if (!restauranteId) return
    const ok = confirm('¿Estás seguro de eliminar el restaurante? Esta acción no se puede deshacer.')
    if (!ok) return

    const { error } = await deleteRestaurante(restauranteId)
    if (error) {
      toast.error('Error al eliminar restaurante')
    } else {
      toast.success('Restaurante eliminado')
      setForm({
        nombre: '',
        mensaje_bienvenida: '',
        facebook_url: '',
        instagram_url: '',
        tiktok_url: '',
        whatsapp_url: '',
      })
      setRestauranteId(null)
    }
  }

  if (loading) return <p className="text-center mt-4">Cargando...</p>

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        {restauranteId ? 'Editar Restaurante' : 'Registrar Restaurante'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del restaurante"
          className="border p-2 rounded"
          required
        />
        <textarea
          name="mensaje_bienvenida"
          value={form.mensaje_bienvenida}
          onChange={handleChange}
          placeholder="Mensaje de bienvenida"
          className="border p-2 rounded"
        />
        <input
          type="url"
          name="facebook_url"
          value={form.facebook_url}
          onChange={handleChange}
          placeholder="URL de Facebook"
          className="border p-2 rounded"
        />
        <input
          type="url"
          name="instagram_url"
          value={form.instagram_url}
          onChange={handleChange}
          placeholder="URL de Instagram"
          className="border p-2 rounded"
        />
        <input
          type="url"
          name="tiktok_url"
          value={form.tiktok_url}
          onChange={handleChange}
          placeholder="URL de TikTok"
          className="border p-2 rounded"
        />
        <input
          type="url"
          name="whatsapp_url"
          value={form.whatsapp_url}
          onChange={handleChange}
          placeholder="URL de WhatsApp"
          className="border p-2 rounded"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
          >
            {restauranteId ? 'Actualizar' : 'Registrar'}
          </button>
          {restauranteId && (
            <button
              type="button"
              onClick={handleEliminar}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Eliminar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
