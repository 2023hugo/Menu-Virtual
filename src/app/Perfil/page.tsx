'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

type Usuario = {
  id: string
  nombres: string
  apellidos: string
  correo: string
  rol: string
  creado_en: string
  actualizado_en: string
  imagen_perfil?: string
}

export default function PerfilPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerfil = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        console.error(error)
        router.push('/login') 
        return
      }

      const { data: perfilData, error: perfilError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single()

      if (perfilError) {
        console.error(perfilError)
        router.push('/login') 
        return
      }

      setUsuario(perfilData)
      setLoading(false)
    }

    fetchPerfil()
  }, [router])

  if (loading) {
    return <p className="text-center mt-10">Cargando perfil...</p>
  }

  if (!usuario) {
    return (
      <div className="text-center mt-10">
        <p>No se encontró tu perfil. Por favor, inicia sesión.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Barra superior con el logo y botones */}
      <div className="flex justify-between items-center w-full px-6 py-3 bg-green-700 shadow-md border-b-2 border-green-800 rounded-md">
        <Image
          src="/logo.jpg" 
          alt="Logo de la empresa"
          width={120}  // Ajusté el tamaño del logo
          height={120}  // Ajusté el tamaño del logo
          className="rounded-full"
        />
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/ListPedidos')}
            className="py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-800 transition duration-200"
          >
            Ver pedidos
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/login')
            }}
            className="py-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-800 transition duration-200"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Información del perfil */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mt-8">
        <div className="flex justify-center mb-4">
          <Image
            src={usuario.imagen_perfil || '/perfil.svg'}
            alt="Imagen de perfil"
            width={120}
            height={120}
            className="rounded-full border-4 border-green-600"
          />
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-center">{usuario.nombres} {usuario.apellidos}</h3>
        <p className="text-center text-lg text-gray-600 mb-4">¡Bienvenido a tu perfil!</p>

        <div className="space-y-2 text-left mb-6">
          <p><strong>Rol:</strong> {usuario.rol}</p>
          <p><strong>Fecha de registro:</strong> {new Date(usuario.creado_en).toLocaleDateString()}</p>
        </div>

        {/* Descripción de la empresa House Coffee */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold mb-4">Sobre House Coffee</h3>
          <p className="text-gray-600">
            House Coffee es una empresa comprometida con ofrecer la mejor experiencia de café a nuestros clientes. 
            Nuestro objetivo es brindar una amplia variedad de cafés de alta calidad, ofreciendo un espacio único 
            donde cada taza cuenta. Nos enorgullece ser parte de la cultura local, brindando productos de café 
            que son 100% frescos y seleccionados con los más altos estándares.
          </p>
        </div>

        {/* Redes sociales */}
        <div className="mt-6 flex justify-center gap-6">
          <a href="https://www.facebook.com" target="_blank" className="text-blue-600 hover:text-blue-800">
            <FaFacebook size={30} />
          </a>
          <a href="https://www.instagram.com" target="_blank" className="text-pink-600 hover:text-pink-800">
            <FaInstagram size={30} />
          </a>
          <a href="https://www.twitter.com" target="_blank" className="text-blue-400 hover:text-blue-600">
            <FaTwitter size={30} />
          </a>
        </div>

        {/* Botón de regresar */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.back()} 
            className="py-2 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}
