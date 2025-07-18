'use client'

export default function HeaderAdmin() {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-bold text-rose-600">Panel de Administración</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">Administrador</span>
        <div className="w-8 h-8 bg-rose-500 rounded-full"></div>
      </div>
    </header>
  )
}
