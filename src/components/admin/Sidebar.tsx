'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/categorias', label: 'Categorías' },
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/restaurante', label: 'Restaurante' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-rose-600 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Menu Virtual</h2>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded ${
              pathname === link.href ? 'bg-white text-rose-600 font-semibold' : 'hover:bg-rose-500'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
