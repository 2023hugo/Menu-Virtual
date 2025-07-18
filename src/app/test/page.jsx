'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect } from 'react'

export default function TestPage() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('productos').select('*')
      console.log('DATA:', data)
      console.log('ERROR:', error)
    }
    testConnection()
  }, [])

  return <div className="p-4 text-lg">Conectado a Supabase (ver consola)</div>
}
