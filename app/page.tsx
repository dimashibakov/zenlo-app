export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          Zenlo
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          AI-Powered Health Optimization
        </p>
        <a 
          href="/upload"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
        >
          Upload Blood Test
        </a>
      </div>
    </main>
  );
}