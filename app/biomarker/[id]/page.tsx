export default async function BiomarkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // В Next.js 15 params это Promise, нужно await
  const resolvedParams = await params;
  const biomarkerIndex = parseInt(resolvedParams.id);
  
  // Те же данные что и на странице results
  const allBiomarkers = [
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

  // Выбираем нужный биомаркер по индексу
  const biomarker = allBiomarkers[biomarkerIndex];

  // Если индекс неверный, показываем ошибку
  if (!biomarker) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Biomarker not found</h1>
        <a href="/results" className="text-blue-400">← Back to Results</a>
      </div>
    </div>;
  }

  // Разные insights для разных биомаркеров
  const getInsight = (name: string) => {
    const insights: { [key: string]: { text: string; whyItMatters: string } } = {
      "Vitamin D": {
        text: "Your Vitamin D level of 48 ng/mL is in the optimal range! This is excellent. You're getting adequate sun exposure or supplementation. Vitamin D at this level supports strong immune function, bone health, and mood regulation.",
        whyItMatters: "Vitamin D supports immune function, bone health, mood regulation, and over 200 biological processes in your body."
      },
      "Ferritin (Iron)": {
        text: "Your Ferritin level of 22 ng/mL is below optimal. This is common, especially in active individuals or those with heavy menstrual cycles. Low iron can contribute to fatigue, reduced exercise recovery, and difficulty concentrating.",
        whyItMatters: "Iron is essential for oxygen transport in blood, energy production, and cognitive function. Optimal levels improve stamina and mental clarity."
      },
      "TSH (Thyroid)": {
        text: "Your TSH level of 1.8 mIU/L is optimal! This indicates healthy thyroid function, which regulates your metabolism, energy levels, and body temperature.",
        whyItMatters: "Thyroid hormones control your metabolic rate, affecting energy, weight, mood, and body temperature regulation."
      },
      "Vitamin B12": {
        text: "Your B12 level of 380 pg/mL is slightly suboptimal. While not deficient, raising it towards 500-700 could improve energy and cognitive function. This is especially important if you're on a plant-based diet.",
        whyItMatters: "B12 is crucial for nerve function, DNA synthesis, red blood cell formation, and energy metabolism."
      }
    };
    
    return insights[name] || {
      text: `Your ${name} level of ${biomarker.value} ${biomarker.unit} is ${biomarker.status}. This biomarker plays an important role in your overall health.`,
      whyItMatters: `${name} is an important health marker that should be monitored regularly.`
    };
  };

  // Разные рекомендации для разных биомаркеров
  const getRecommendations = (name: string) => {
    const recommendations: { [key: string]: any } = {
      "Vitamin D": {
        diet: ["Fatty fish (salmon, mackerel) 2-3x/week", "Egg yolks", "Fortified dairy", "Mushrooms"],
        supplements: ["Maintain D3: 2,000 IU daily", "Take with fat for absorption"],
        lifestyle: ["Continue current sun exposure", "Outdoor activities at midday"]
      },
      "Ferritin (Iron)": {
        diet: ["Red meat 2-3x/week", "Spinach with vitamin C", "Lentils and beans", "Pumpkin seeds"],
        supplements: ["Iron bisglycinate: 25-50mg daily", "Take with vitamin C", "Avoid with coffee/tea"],
        lifestyle: ["Space out intense workouts", "Ensure adequate rest", "Track menstrual cycle if applicable"]
      },
      "TSH (Thyroid)": {
        diet: ["Iodized salt in moderation", "Selenium-rich foods (Brazil nuts)", "Avoid excessive soy"],
        supplements: ["Continue current regimen", "Selenium if deficient"],
        lifestyle: ["Maintain current healthy habits", "Manage stress levels", "Regular sleep schedule"]
      },
      "Vitamin B12": {
        diet: ["Meat, fish, eggs daily", "Fortified nutritional yeast", "Dairy products", "Fortified cereals"],
        supplements: ["B12: 1,000 mcg methylcobalamin", "B-complex if needed"],
        lifestyle: ["Reduce alcohol consumption", "Check medications (PPIs can reduce absorption)"]
      }
    };

    return recommendations[name] || {
      diet: ["Balanced whole foods diet", "Plenty of vegetables", "Adequate protein"],
      supplements: ["Consult with healthcare provider"],
      lifestyle: ["Regular exercise", "Adequate sleep", "Stress management"]
    };
  };

  const insight = getInsight(biomarker.name);
  const recommendations = getRecommendations(biomarker.name);

  // Severity score (0-100)
  const calculateSeverity = () => {
    if (biomarker.status === "optimal") return 0;
    if (biomarker.status === "suboptimal") return 30;
    if (biomarker.status === "low") return 65;
    return 85;
  };

  const severity = calculateSeverity();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8">
          <a href="/results" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Results
          </a>
          <h1 className="text-4xl font-bold text-white mb-2">
            {biomarker.name}
          </h1>
          <p className="text-slate-400">
            Detailed analysis and recommendations
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-slate-400 text-sm mb-1">Your Level</div>
              <div className="text-4xl font-bold text-white">
                {biomarker.value} <span className="text-2xl text-slate-400">{biomarker.unit}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm mb-1">Optimal Range</div>
              <div className="text-xl font-semibold text-slate-300">
                {biomarker.range} {biomarker.unit}
              </div>
            </div>
          </div>
          
          <div className={`inline-block px-4 py-2 rounded-full font-semibold ${
            biomarker.status === "optimal" ? "bg-green-500/20 text-green-400" :
            biomarker.status === "suboptimal" ? "bg-yellow-500/20 text-yellow-400" :
            "bg-orange-500/20 text-orange-400"
          }`}>
            {biomarker.status === "optimal" ? "✅" : "⚠️"} {biomarker.status.toUpperCase()}
            {severity > 0 && ` - Severity: ${severity}/100`}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">🤖</span> AI Insight
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            {insight.text}
          </p>
          <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-blue-500">
            <h3 className="text-white font-semibold mb-2">Why it matters:</h3>
            <p className="text-slate-300 text-sm">
              {insight.whyItMatters}
            </p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            💡 Recommendations
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">🥗</span> Diet
            </h3>
            <ul className="space-y-2">
              {recommendations.diet.map((item: string, i: number) => (
                <li key={i} className="text-slate-300 flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">💊</span> Supplements
            </h3>
            <ul className="space-y-2">
              {recommendations.supplements.map((item: string, i: number) => (
                <li key={i} className="text-slate-300 flex items-start">
                  <span className="text-blue-400 mr-2">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-yellow-400 text-sm mt-3 bg-yellow-500/10 p-3 rounded">
              ⚠️ Always consult your healthcare provider before starting supplements
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">🌞</span> Lifestyle
            </h3>
            <ul className="space-y-2">
              {recommendations.lifestyle.map((item: string, i: number) => (
                <li key={i} className="text-slate-300 flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <a 
            href="/results"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Back to All Results
          </a>
        </div>

      </div>
    </main>
  );
}