'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { loginUser } from '@/services/auth'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: loginError } = await loginUser(email, password)

    if (loginError) {
      setLoading(false)
      return setError(loginError)
    }

    // Redirigir siempre al carrito después de iniciar sesión
    router.push('/cart')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      {/* Barra superior con logo centrado */}
      <div className="absolute top-0 left-0 right-0 flex justify-center p-4 bg-brown-800 shadow-md">
        <Image
          src="/logo.jpg" 
          alt="Logo"
          width={150} // Tamaño ajustado para el logo
          height={150} // Tamaño ajustado para el logo
          className="rounded-full" // Bordes redondeados para el logo
        />
      </div>

      {/* Formulario de Login */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-md mt-20 sm:mt-32"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Iniciar Sesión</h2>

        {/* Mostrar error si existe */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="mb-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 ease-in-out disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>

        {/* Opciones adicionales */}
        <div className="text-center mt-6 text-sm">
          <p className="text-gray-600">¿Olvidaste tu contraseña?</p>
          <p>¿Aún no eres miembro? <a href="/registro" className="text-green-600 hover:underline">Crear nueva cuenta</a></p>
        </div>
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
