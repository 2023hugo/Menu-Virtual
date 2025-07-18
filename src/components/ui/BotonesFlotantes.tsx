'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function BotonesFlotantes() {
  const router = useRouter()

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      <button
        onClick={() => router.push('/Perfil')}
        className="bg-white shadow-md hover:shadow-xl rounded-full p-3 border border-gray-300"
      >
        <Image src="/perfil.svg" alt="Perfil" width={24} height={24} />
      </button>
      <button
        onClick={() => router.push('/Historial')}
        className="bg-white shadow-md hover:shadow-xl rounded-full p-3 border border-gray-300"
      >
        <Image src="/hist.svg" alt="Historial" width={24} height={24} />
      </button>
      <button
        onClick={() => router.push('/ListPedidos')}
        className="bg-white shadow-md hover:shadow-xl rounded-full p-3 border border-gray-300"
      >
        <Image src="/list.svg" alt="Carrito" width={24} height={24} />
      </button>
    </div>
  )
}
