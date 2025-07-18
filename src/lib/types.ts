// src/lib/types.ts

export type ProductoInput = {
  categoria_id: number
  nombre: string
  descripcion?: string
  precio: number
  imagen_url?: string
  estado?: 'disponible' | 'Agotado'
}
export type RestauranteInput = {
  nombre: string
  mensaje_bienvenida?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  whatsapp_url?: string
}
export type Producto = {
  id: number
  categoria_id: number
  nombre: string
  descripcion?: string
  precio: number
  imagen_url?: string
  estado: 'disponible' | 'Agotado'
  categorias?: {
    nombre: string
  }
}

export type Restaurante = {
  id: number
  nombre: string
  mensaje_bienvenida?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  whatsapp_url?: string
  creado_en?: string
  actualizado_en?: string
}
