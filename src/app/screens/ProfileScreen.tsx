import { useState, useEffect } from 'react';
import { Settings, Target, TrendingUp } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { getGoals, saveGoals } from '../utils/goals';

export function ProfileScreen() {
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(150);
  const [carbsGoal, setCarbsGoal] = useState(250);
  const [fatGoal, setFatGoal] = useState(65);

  useEffect(() => {
    getGoals().then(g => {
      setCalorieGoal(g.calories);
      setProteinGoal(g.protein);
      setCarbsGoal(g.carbs);
      setFatGoal(g.fat);
    });
  }, []);
  const [weightGoal, setWeightGoal] = useState(70);

  const handleSave = async () => {
    await saveGoals({ calories: calorieGoal, protein: proteinGoal, carbs: carbsGoal, fat: fatGoal });
    alert('Goals saved!');
  };
  
  return (
    <div className="min-h-screen bg-white pb-safe" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="pt-safe px-6 pb-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl tracking-tight"
            style={{ 
              fontWeight: 600,
              color: '#1F2937'
            }}
          >
            Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your goals
          </p>
        </div>
        <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      {/* Daily Progress Card */}
      <div className="px-6 py-6">
        <div className="rounded-3xl p-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-white/90" />
            <p className="text-white/90 text-sm">Daily Calorie Goal</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl text-white" style={{ fontWeight: 600 }}>{calorieGoal}</span>
            <span className="text-xl text-white/90">kcal</span>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5" style={{ color: 'var(--energy-orange)' }} />
          <h2 className="text-xl" style={{ fontWeight: 600, color: '#1F2937' }}>Your Goals</h2>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Daily Calories', value: calorieGoal, set: setCalorieGoal, min: 1200, max: 3500, step: 50, unit: 'kcal', color: 'var(--main-green)' },
            { label: 'Protein', value: proteinGoal, set: setProteinGoal, min: 50, max: 300, step: 5, unit: 'g', color: '#2ECC71' },
            { label: 'Carbs', value: carbsGoal, set: setCarbsGoal, min: 50, max: 500, step: 5, unit: 'g', color: 'var(--energy-orange)' },
            { label: 'Fat', value: fatGoal, set: setFatGoal, min: 20, max: 150, step: 5, unit: 'g', color: '#F39C12' },
            { label: 'Target Weight', value: weightGoal, set: setWeightGoal, min: 40, max: 120, step: 1, unit: 'kg', color: '#3498DB' },
          ].map(({ label, value, set, min, max, step, unit, color }) => {
            const pct = ((value - min) / (max - min)) * 100;
            return (
              <div key={label} className="p-5 rounded-2xl border border-gray-200 shadow-sm">
                <label className="block text-sm text-gray-600 mb-2">{label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)` }}
                  />
                  <div className="px-4 py-2 rounded-xl text-center min-w-20 text-white text-sm" style={{ backgroundColor: color, fontWeight: 600 }}>
                    {value}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{unit} per day</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-6 py-4 rounded-full text-white shadow-md transition-transform active:scale-95"
          style={{ backgroundColor: 'var(--main-green)', fontWeight: 600 }}
        >
          Save Goals
        </button>
      </div>
      
      <BottomNav />
    </div>
  );
}


