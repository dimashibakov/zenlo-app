'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

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

  function handleDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
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
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Upload Blood Test</h1>
        <p className="text-slate-400 text-center mb-8">Upload your blood test PDF for AI-powered analysis</p>
        
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/10 scale-105' 
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
            }`}
          >
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleChange}
              className="hidden"
              disabled={uploading}
            />
            
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Icon */}
                <div className={`p-4 rounded-full transition-all duration-300 ${
                  dragActive ? 'bg-blue-500/20' : 'bg-slate-700'
                }`}>
                  <svg 
                    className={`w-12 h-12 transition-colors ${
                      dragActive ? 'text-blue-400' : 'text-slate-400'
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                    />
                  </svg>
                </div>

                {/* Text */}
                <div>
                  <p className="text-lg font-semibold text-white mb-1">
                    {dragActive ? 'Drop your file here' : 'Drag & drop your PDF here'}
                  </p>
                  <p className="text-sm text-slate-400">
                    or <span className="text-blue-400 hover:text-blue-300 font-medium">browse files</span>
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  Supports: PDF files only
                </p>
              </div>
            </label>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50 disabled:shadow-none"
          >
            {uploading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </span>
            ) : (
              'Analyze Blood Test'
            )}
          </button>
        </div>
      </div>
    </main>
  )
}