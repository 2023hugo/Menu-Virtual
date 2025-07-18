'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen_url?: string;
};

type PedidoItem = Producto & { cantidad: number };

type UserData = {
  id: string;
  email: string;
};

export default function CartPage() {
  const [carrito, setCarrito] = useState<PedidoItem[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  // Cargar productos del carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  // Obtener usuario logueado
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || ''
        });
      }
    };
    fetchUser();
  }, []);

  // Guardar pedido en Supabase y en historial
  const verCarrito = async () => {
    if (!user) {
      alert('Debes iniciar sesión para guardar tu pedido.');
      router.push('/login');
      return;
    }
    if (carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    try {
      // Guardar el pedido principal en la tabla de pedidos
      const { error: pedidoError } = await supabase.from('pedidos').upsert({
        usuario_id: user.id,
        items: carrito,
        creado_en: new Date().toISOString()
      });
      if (pedidoError) throw pedidoError;

      // Guardar el pedido en el historial
      const historialData = carrito.map(item => ({
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
      }));

      const { error: historialError } = await supabase.from('historial_pedidos').upsert({
        usuario_id: user.id,
        items: historialData,
        creado_en: new Date().toISOString(),
        tipo: 'historial',  // Puedes añadir un campo para diferenciarlo si lo deseas
      });
      if (historialError) throw historialError;

      alert('✅ Pedido guardado correctamente.');
      localStorage.removeItem('carrito');
      setCarrito([]);
      router.push('/ListPedidos');
    } catch (error) {
      // Manejo de errores mejorado
      console.error('Error al guardar el pedido:', error);
      alert('❌ Error al guardar el pedido. Verifica los detalles en la consola.');
    }
  };

  // Eliminar producto del carrito
  const eliminarProducto = (id: number) => {
    const carritoActualizado = carrito.filter((item) => item.id !== id);
    setCarrito(carritoActualizado);
    localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
  };

  // Total del carrito
  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">🛒 Carrito de Compras</h1>
      {carrito.length === 0 ? (
        <p className="text-gray-500 text-lg">No tienes productos en tu carrito.</p>
      ) : (
        <>
          <div className="space-y-6">
            {carrito.map((item, idx) => (
              <div key={item.id + '-' + idx} className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-6">
                  {item.imagen_url && (
                    <img
                      src={item.imagen_url}
                      alt={item.nombre}
                      width={80}
                      height={80}
                      className="rounded-lg shadow-md"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{item.nombre}</h2>
                    <p className="text-sm text-gray-500">S/. {item.precio.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">x{item.cantidad}</span>
                  <button
                    onClick={() => eliminarProducto(item.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 border-t flex justify-between items-center">
            <p className="text-lg font-bold">
              Total: <span className="text-pink-600">S/. {total.toFixed(2)}</span>
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="bg-gray-300 text-black py-2 px-6 rounded-lg hover:bg-gray-400 transition"
              >
                Volver
              </button>
              <button
                onClick={verCarrito}
                className="bg-pink-600 text-white py-2 px-6 rounded-lg hover:bg-pink-700 transition"
              >
                Guardar y Ver Pedido
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
