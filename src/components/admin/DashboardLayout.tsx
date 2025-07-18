'use client'

import Sidebar from './Sidebar'
import HeaderAdmin from './HeaderAdmin'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <HeaderAdmin />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
