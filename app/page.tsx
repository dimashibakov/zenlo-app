'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
    } else {
      setUserEmail(user.email || null)
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          Zenlo
        </h1>
        <p className="text-xl text-slate-300 mb-2">
          AI-Powered Health Optimization
        </p>
        {userEmail && (
          <p className="text-sm text-slate-400 mb-8">
            Welcome, {userEmail}
          </p>
        )}
        <a 
          href="/upload"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold mb-4"
        >
          Upload Blood Test
        </a>
        
        <div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  )
}