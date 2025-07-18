'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-brown-800 flex flex-col items-center justify-center px-4 py-12 text-center">
      <Image
        src="/logo.jpg" // Asegúrate de tener tu logo aquí o reemplaza con una imagen externa
        alt="Logo Restaurante"
        width={300}  // Aumenté el tamaño del logo para mayor impacto
        height={300} // Aumenté el tamaño del logo
        className="mb-8 rounded-full border-8 border-white shadow-2xl transform transition-all duration-1000 hover:scale-150 hover:rotate-12 hover:shadow-2xl"
      />

      <h1 className="text-5xl font-extrabold text-[#6f4f28] mb-6 animate__animated animate__fadeIn animate__delay-1s">
        Bienvenido a <span className="text-[#8b5e3c]">Nuestro Menú Virtual</span>
      </h1>
      <p className="text-xl text-[#6f4f28] mb-12 animate__animated animate__fadeIn animate__delay-2s max-w-3xl mx-auto">
        Bienvenido a nuestro rincón de frescura, donde cada sorbo de Coffee Hause te ofrece energía y sabor.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => router.push('/login')}
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-xl active:scale-95 active:shadow-lg"
        >
          <i className="mr-2 fas fa-lock"></i> Iniciar Sesión
        </button>

        <button
          onClick={() => router.push('/registro')}
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-xl active:scale-95 active:shadow-lg"
        >
          <i className="mr-2 fas fa-user-plus"></i> Registrarse
        </button>

        {/* Botón para ingresar como invitado */}
        <button
          onClick={() => router.push('/cart')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-xl active:scale-95 active:shadow-lg"
        >
          <i className="mr-2 fas fa-user"></i> Ingresar como Invitado
        </button>
      </div>

      <div className="mt-12 text-white font-medium">
        <p>¿Tienes preguntas o dudas? ¡Estamos aquí para ayudarte!</p>
        <button
          onClick={() => router.push('/contacto')}
          className="mt-6 text-lg bg-brown-700 hover:bg-brown-800 text-white py-3 px-6 rounded-lg transition-all duration-300"
        >
          ¡Contáctanos!
        </button>
      </div>
    </div>
  )
}
