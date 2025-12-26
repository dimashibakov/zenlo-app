export default function ResultsPage() {
  // Mock данные биомаркеров
  const biomarkers = [
    { name: "Vitamin D", value: 48, unit: "ng/mL", status: "optimal", range: "40-60" },
    { name: "Ferritin (Iron)", value: 22, unit: "ng/mL", status: "low", range: "50-150" },
    { name: "TSH (Thyroid)", value: 1.8, unit: "mIU/L", status: "optimal", range: "0.5-2.5" },
    { name: "Vitamin B12", value: 380, unit: "pg/mL", status: "suboptimal", range: "400-900" },
    { name: "HbA1c (Blood Sugar)", value: 5.2, unit: "%", status: "optimal", range: "<5.5" },
    { name: "Total Cholesterol", value: 185, unit: "mg/dL", status: "optimal", range: "<200" },
    { name: "HDL (Good)", value: 65, unit: "mg/dL", status: "optimal", range: ">60" },
    { name: "LDL (Bad)", value: 98, unit: "mg/dL", status: "optimal", range: "<100" },
    { name: "hsCRP (Inflammation)", value: 0.8, unit: "mg/L", status: "optimal", range: "<1.0" },
    { name: "Fasting Glucose", value: 88, unit: "mg/dL", status: "optimal", range: "70-99" },
  ];

  const optimalCount = biomarkers.filter(b => b.status === "optimal").length;
  const total = biomarkers.length;

  const getStatusColor = (status: string) => {
    if (status === "optimal") return "text-green-400";
    if (status === "suboptimal") return "text-yellow-400";
    if (status === "low") return "text-orange-400";
    return "text-red-400";
  };

  const getStatusBg = (status: string) => {
    if (status === "optimal") return "bg-green-500/20";
    if (status === "suboptimal") return "bg-yellow-500/20";
    if (status === "low") return "bg-orange-500/20";
    return "bg-red-500/20";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Your Results
          </h1>
          <p className="text-slate-400">
            AI analysis complete
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 mb-8 text-center">
          <div className="text-6xl font-bold text-white mb-2">
            {optimalCount}/{total}
          </div>
          <div className="text-2xl text-slate-300 mb-4">
            Biomarkers Optimal
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${(optimalCount / total) * 100}%` }}
            ></div>
          </div>
          <p className="text-slate-400 mt-4">
            Great progress! 2 biomarkers need attention
          </p>
        </div>

        <div className="space-y-4">
          {biomarkers.map((biomarker, index) => (
            <a 
              key={index}
              href={`/biomarker/${index}`}
              className="block bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {biomarker.name}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Range: {biomarker.range} {biomarker.unit}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-white mb-1">
                    {biomarker.value} <span className="text-slate-400 text-lg">{biomarker.unit}</span>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBg(biomarker.status)} ${getStatusColor(biomarker.status)}`}>
                    {biomarker.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </a>
        </div>

      </div>
    </main>
  );
}