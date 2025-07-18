'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type PedidoHistorial = {
  id: number
  creado_en: string
  items: {
    nombre: string
    cantidad: number
    precio: number
    imagen_url?: string
  }[]
}

export default function HistorialPage() {
  const [historial, setHistorial] = useState<PedidoHistorial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        setHistorial([])
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('historial_pedidos')
        .select('id, creado_en, items')
        .eq('usuario_id', userData.user.id)
        .order('creado_en', { ascending: false })

      if (!error && data) {
        setHistorial(data)
      } else {
        setHistorial([])
      }
      setLoading(false)
    }
    fetchHistorial()
  }, [])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Historial de Pedidos</h1>
      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : historial.length === 0 ? (
        <p className="text-gray-600">No hay historial aún.</p>
      ) : (
        <ul className="space-y-2">
          {historial.map((pedido) => (
            <li key={pedido.id} className="border p-4 rounded">
              <div className="mb-2 text-sm text-gray-500">
                Pedido realizado el {new Date(pedido.creado_en).toLocaleString()}
              </div>
              <ul>
                {pedido.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between border-b py-1">
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span className="text-pink-600 font-semibold">
                      S/. {(item.precio * item.cantidad).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}