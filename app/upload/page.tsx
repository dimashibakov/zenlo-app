'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Upload Blood Test
          </h1>
          <p className="text-slate-400">
            Upload your PDF and get AI-powered insights
          </p>
        </div>

        {/* Upload Box */}
        <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-blue-500 transition-colors">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <p className="text-xl text-white mb-2">
            Drop your PDF here
          </p>
          <p className="text-sm text-slate-400 mb-6">
            or click to browse
          </p>
          
          {/* Hidden file input */}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          
          {/* Button triggers file input */}
          <label 
            htmlFor="file-upload"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer"
          >
            Choose File
          </label>

          {/* Show selected file */}
          {selectedFile && (
            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <p className="text-white font-semibold">Selected file:</p>
              <p className="text-slate-300">{selectedFile.name}</p>
              <p className="text-slate-400 text-sm">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        {selectedFile && (
          <div className="mt-8 text-center">
            <a 
  href="/results"
  className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg"
>
  Analyze Blood Test
</a>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </a>
        </div>

      </div>
    </main>
  );
}