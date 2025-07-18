'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-hot-toast'

export default function RegistroPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1. Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    const user = authData?.user
    if (authError || !user) {
      toast.error('Error al registrar usuario')
      console.error(authError)
      setLoading(false)
      return
    }

    // 2. Insertar datos del usuario en tabla "usuarios"
    const { error: insertError } = await supabase.from('usuarios').insert([{
      id: user.id,
      nombres,
      apellidos,
      rol: 'cliente',
    }])

    if (insertError) {
      toast.error('Error al guardar en tabla usuarios')
      console.error(insertError)
      setLoading(false)
      return
    }

    toast.success('Registro exitoso ✅')

    // 3. Redirigir a localhost:3000
    router.push('http://localhost:3000') // Redirige al localhost:3000
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      {/* Barra superior con logo centrado */}
      <div className="absolute top-0 left-0 right-0 flex justify-center p-4 bg-brown-800 shadow-md">
        <Image
          src="/logo.jpg" // Reemplaza con la ruta del logo que subiste
          alt="Logo"
          width={150} // Tamaño ajustado para el logo
          height={150} // Tamaño ajustado para el logo
          className="rounded-full" // Bordes redondeados para el logo
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mt-28 sm:mt-32"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Crear Cuenta</h2>

        <div>
          <label htmlFor="nombres" className="block text-sm font-medium text-gray-700">Nombres</label>
          <input
            id="nombres"
            type="text"
            placeholder="Nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            required
            className="border p-3 mt-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos</label>
          <input
            id="apellidos"
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
            className="border p-3 mt-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-3 mt-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-3 mt-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-md mt-6 hover:bg-green-700 transition duration-200 ease-in-out"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <div className="text-center mt-4 text-sm text-gray-600">
          <p>¿Ya tienes cuenta? <a href="/login" className="text-green-600 hover:underline">Iniciar sesión</a></p>
        </div>

        {/* Botón de Volver con estilo */}
        <button
          type="button"
          onClick={() => router.push('http://localhost:3000')}
          className="w-full bg-gray-600 text-white py-3 rounded-md mt-4 hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          Volver 
        </button>
      </form>
    </div>
  )
}
