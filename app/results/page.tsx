'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Biomarker {
  id: string
  name: string
  value: number
  unit: string
  status: string
  optimal_range: string
}

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get('id')
  
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (testId) {
      loadBiomarkers()
    }
  }, [testId])

  async function loadBiomarkers() {
    try {
      const { data, error } = await supabase
        .from('biomarkers')
        .select('*')
        .eq('blood_test_id', testId)

      if (error) throw error
      setBiomarkers(data || [])
    } catch (error) {
      console.error('Error loading biomarkers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading results...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Your Blood Test Results
        </h1>

        <div className="space-y-4">
          {biomarkers.map((marker) => (
            <div
              key={marker.id}
              onClick={() => router.push(`/biomarker/${marker.id}`)}
              className="bg-slate-800 p-6 rounded-lg cursor-pointer hover:bg-slate-700 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-white">
                  {marker.name}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    marker.status === 'normal'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {marker.status}
                </span>
              </div>
              <div className="text-slate-300">
                <span className="text-2xl font-bold text-white">
                  {marker.value}
                </span>{' '}
                {marker.unit}
              </div>
              <div className="text-sm text-slate-400 mt-2">
                Optimal: {marker.optimal_range}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}