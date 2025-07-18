import DashboardLayout from '@/components/admin/DashboardLayout'

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bienvenido al Dashboard</h2>
        <p className="text-gray-600 text-lg mb-6">Aquí podrás gestionar las categorías, productos y la información del restaurante.</p>
        <div className="flex space-x-4 mt-6">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">Gestionar Categorías</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">Gestionar Productos</button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300">Ver Información</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
