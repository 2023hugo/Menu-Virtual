'use client';

import { useEffect, useState } from 'react';
import { getProductosDisponibles } from '@/services/productos';
import { getRestaurante } from '@/services/restaurante';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Hook para debouncing
const useDebouncedValue = (value: string | null, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

type Producto = {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  categoria_id: number;
  categorias: {
    nombre: string;
  };
};

type Restaurante = {
  nombre: string;
  mensaje_bienvenida?: string;
};

export default function CartaPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<string>('');

  // Verificar si el usuario está logueado
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) router.push('/login');
    };

    const fetchDatos = async () => {
      try {
        const { data: productosData, error: productosError } = await getProductosDisponibles();
        if (productosError) throw new Error('Error al cargar productos.');

        const { data: restData, error: restError } = await getRestaurante();
        if (restError) throw new Error('Error al cargar el restaurante.');

        const categoriasUnicas = [
          ...new Set(productosData.map((prod) => prod.categorias?.nombre || 'Sin categoría')),
        ];

        setProductos(productosData);
        setCategorias(categoriasUnicas);
        setRestaurante(restData);
        setLoading(false);
      } catch (error: any) {
        setError(error.message || 'Hubo un problema al cargar los datos.');
        setLoading(false);
      }
    };

    fetchUser();
    fetchDatos();
  }, [router]);

  // Usar el valor debounced para filtrar productos
  const debouncedCategoria = useDebouncedValue(categoriaSeleccionada, 300);

  const productosFiltrados = debouncedCategoria
    ? productos.filter((p) => p.categorias?.nombre === debouncedCategoria)
    : productos;

  const agregarAPedido = (producto: Producto) => {
    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
      const nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      setCarrito(nuevoCarrito);
    } else {
      const nuevoProducto = { ...producto, cantidad: 1 };
      setCarrito([...carrito, nuevoProducto]);
    }
    alert('✅ Producto agregado a tu carrito');
  };

  const verCarrito = () => {
    router.push('/ListPedidos');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  if (loading) return (
    <div className="text-center mt-10">
      <div className="animate-spin rounded-full border-t-4 border-green-800 w-16 h-16 mx-auto"></div>
      <p className="mt-4 text-green-800">Cargando sesión...</p>
    </div>
  );

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="relative pb-24 flex flex-wrap">
      {/* Barra lateral */}
      <div className="w-full sm:w-1/5 bg-gradient-to-b from-green-800 to-green-600 text-white p-4 flex flex-col items-center shadow-lg rounded-lg">
        <div className="w-48 h-24 mb-6">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={192}
            height={192}
            className="object-contain animate__animated animate__zoomIn"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Menú</h2>
        <div className="flex flex-col gap-4 w-full">
          {user ? (
            <>
              <Link href="/Perfil" className="px-4 py-2 rounded-full bg-white text-green-800 text-center hover:bg-green-700 transition duration-200">Ver perfil</Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 mt-2 rounded-full bg-white text-green-800 text-center hover:bg-green-700 transition duration-200"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-full bg-white text-green-800 text-center hover:bg-green-700 transition duration-200">Iniciar sesión</Link>
              <Link href="/registro" className="px-4 py-2 mt-2 rounded-full bg-white text-green-800 text-center hover:bg-green-700 transition duration-200">Registrarse</Link>
            </>
          )}

          <h3 className="mt-6 text-lg text-center text-white">Tipos de Productos</h3>
          <button
            onClick={() => setCategoriaSeleccionada(null)}
            className={`px-4 py-2 rounded-full border w-full text-center ${!categoriaSeleccionada ? 'bg-white text-green-800' : 'bg-green-800 text-white'} transition duration-200`}
          >
            Todos
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaSeleccionada(categoria)}
              className={`px-4 py-2 rounded-full border w-full text-center ${categoriaSeleccionada === categoria ? 'bg-white text-green-800' : 'bg-green-800 text-white'} transition duration-200`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="w-full sm:w-4/5 p-4">
        {/* Header */}
        <header className="bg-green-800 text-white p-6 text-center shadow-md relative">
          <h1 className="text-4xl font-bold">{restaurante?.nombre || 'Mi Restaurante'}</h1>
          {restaurante?.mensaje_bienvenida && (
            <p className="text-sm mt-2">{restaurante.mensaje_bienvenida}</p>
          )}
        </header>

        {/* Seleccionar mesa */}
        <div className="my-4">
          <label htmlFor="mesa" className="block text-lg font-medium">Seleccione la mesa:</label>
          <input
            id="mesa"
            type="text"
            value={mesaSeleccionada}
            onChange={(e) => setMesaSeleccionada(e.target.value)}
            placeholder="Número de mesa"
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
        </div>

        {/* Productos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-150 bg-[#00b6b6] hover:bg-[#00a0a0]"
            >
              {producto.imagen_url && (
                <div className="w-full h-36 mb-4 flex justify-center items-center overflow-hidden transform transition-all duration-300 hover:scale-105">
                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    width={120}
                    height={150}
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL="/path/to/low-res-image.jpg"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold text-rose-700 text-center">{producto.nombre}</h3>
              {producto.descripcion && (
                <p className="text-sm text-gray-600 text-center">{producto.descripcion}</p>
              )}
              <p className="mt-2 font-semibold text-center">S/. {producto.precio.toFixed(2)}</p>
              <button
                onClick={() => agregarAPedido(producto)}
                className="mt-3 w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600 transition"
              >
                Agregar a carrito
              </button>
            </div>
          ))}
        </div>

        {/* Botones flotantes para ver el carrito */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <button
            onClick={verCarrito}
            className="bg-rose-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-rose-700"
          >
            Ver Pedido ({carrito.length})
          </button>
        </div>
      </div>
    </div>
  );
}
