'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUserId(user.id)
    }
  }

  async function handleUpload() {
    if (!file || !userId) return

    setUploading(true)

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blood-tests')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blood-tests')
        .getPublicUrl(fileName)

      // 3. Save to database
      const { data: testData, error: dbError } = await supabase
        .from('blood_tests')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_url: publicUrl,
          analysis_status: 'completed'
        })
        .select()
        .single()

      if (dbError) throw dbError

      // 4. Create mock biomarkers
      const mockBiomarkers = [
        { name: 'Vitamin D', value: 32, unit: 'ng/mL', status: 'normal', optimal_range: '30-100' },
        { name: 'Testosterone', value: 450, unit: 'ng/dL', status: 'low', optimal_range: '500-900' },
        { name: 'Cholesterol', value: 185, unit: 'mg/dL', status: 'normal', optimal_range: '<200' }
      ]

      for (const marker of mockBiomarkers) {
        await supabase.from('biomarkers').insert({
          blood_test_id: testData.id,
          ...marker
        })
      }

      // 5. Redirect to results
      router.push(`/results?id=${testData.id}`)

    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-slate-800 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Upload Blood Test</h1>
        
        <div className="mb-6">
          <label className="block text-slate-300 mb-2">
            Choose your blood test PDF
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
            disabled={uploading}
          />
        </div>

        {file && (
          <div className="mb-6 text-slate-300">
            Selected: {file.name}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {uploading ? 'Uploading...' : 'Analyze Blood Test'}
        </button>
      </div>
    </main>
  )
}