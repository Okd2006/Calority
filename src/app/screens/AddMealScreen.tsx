import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Camera, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { getGoals, pct, summaryLabel, type Goals } from '../utils/goals';
import { saveMeal } from '../utils/history';
import { resizeImage } from '../utils/imageUtils';

const SUPABASE_URL = 'https://vlcmcyzpgsywvtjlsqqy.supabase.co/functions/v1/make-server-be9d8453';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsY21jeXpwZ3N5d3Z0amxzcXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjI2MzIsImV4cCI6MjA4OTI5ODYzMn0.1Y7ULHx1QQJIPpI47k-arad4mFiZqL7-ZGUbl4tcjp8';

interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  imageDataUrl?: string;
}

export function AddMealScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialItems: MealItem[] = (location.state as any)?.items ?? [];

  const [items, setItems] = useState<MealItem[]>(initialItems);
  const [scanning, setScanning] = useState(false);
  const [saved, setSaved] = useState(false);
  const [goals, setGoals] = useState<Goals>({ calories: 2000, protein: 150, carbs: 250, fat: 65 });
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getGoals().then(setGoals); }, []);

  const handleSaveAll = async () => {
    if (items.length === 0) return;
    await Promise.all(items.map(item => saveMeal({
      name: item.name, calories: item.calories, protein: item.protein,
      carbs: item.carbs, fat: item.fat, ingredients: item.ingredients, imageDataUrl: item.imageDataUrl,
    })));
    setSaved(true);
    setTimeout(() => navigate('/history'), 800);
  };

  const totals = items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const analyzeImage = async (file: File) => {
    setScanning(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const raw = e.target?.result as string;
      try {
        const { dataUrl, base64, mimeType: mime } = await resizeImage(raw, 1600);
        const res = await fetch(`${SUPABASE_URL}/analyze-meal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ imageBase64: base64, mimeType: mime }),
        });
        const data = await res.json();
        setItems(prev => [...prev, { ...data, imageDataUrl: dataUrl }]);
      } catch {
        alert('Could not analyze image. Please try again.');
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeImage(file);
    e.target.value = '';
  };

  const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));

  const macroRows = [
    { label: 'Calories', value: totals.calories, goal: goals.calories, unit: 'kcal', color: 'var(--main-green)' },
    { label: 'Protein', value: totals.protein, goal: goals.protein, unit: 'g', color: '#2ECC71' },
    { label: 'Carbs', value: totals.carbs, goal: goals.carbs, unit: 'g', color: 'var(--energy-orange)' },
    { label: 'Fat', value: totals.fat, goal: goals.fat, unit: 'g', color: '#F39C12' },
  ];

  return (
    <div className="min-h-screen pb-8" style={{ fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(to bottom, #A8E6B0 0%, #F0FAF1 100%)' }}>
      {/* Hidden inputs */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
        <button onClick={() => navigate('/home')} className="text-gray-500 text-sm" style={{ fontWeight: 600 }}>Cancel</button>
        <h1 className="text-lg" style={{ fontWeight: 600 }}>Add Meal</h1>
        <button
          onClick={handleSaveAll}
          disabled={items.length === 0 || saved}
          className="text-sm px-4 py-1.5 rounded-full text-white flex items-center gap-1 disabled:opacity-40"
          style={{ backgroundColor: saved ? '#27AE60' : 'var(--main-green)', fontWeight: 600 }}
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : 'Save All'}
        </button>
      </div>

      {/* Scanned Items */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-base mb-3" style={{ fontWeight: 600, color: '#374151' }}>
          Scanned Foods {items.length > 0 && `(${items.length})`}
        </h2>

        {items.length === 0 && !scanning && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center gap-2 text-gray-400">
            <Camera className="w-10 h-10" />
            <p className="text-sm">Scan your first food item below</p>
          </div>
        )}

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              {item.imageDataUrl && (
                <img src={item.imageDataUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ fontWeight: 600, color: '#1F2937' }}>{item.name}</p>
                <p className="text-xs text-gray-500">{item.calories} kcal · P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g</p>
              </div>
              <button onClick={() => removeItem(i)} className="p-2 text-gray-300 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Scanning indicator */}
          {scanning && (
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 animate-pulse">
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add more buttons */}
      <div className="px-6 pb-6 flex gap-3">
        <button
          onClick={() => cameraRef.current?.click()}
          disabled={scanning}
          className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: 'var(--main-green)', fontWeight: 600 }}
        >
          <Camera className="w-5 h-5" />
          Camera
        </button>
        <button
          onClick={() => uploadRef.current?.click()}
          disabled={scanning}
          className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 border-2 transition-opacity disabled:opacity-50"
          style={{ borderColor: 'var(--main-green)', color: 'var(--main-green)', fontWeight: 600 }}
        >
          <Upload className="w-5 h-5" />
          Upload
        </button>
      </div>

      {/* Totals Summary */}
      {items.length > 0 && (
        <div className="px-6">
          <h2 className="text-base mb-3" style={{ fontWeight: 600, color: '#374151' }}>Meal Totals vs Your Goals</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {macroRows.map(({ label, value, goal, unit, color }, i) => {
              const p = pct(value, goal);
              const lbl = summaryLabel(p);
              return (
                <div key={label} className={`p-4 ${i < macroRows.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm" style={{ fontWeight: 600, color: '#1F2937' }}>{label}</span>
                    <span className="text-sm" style={{ color, fontWeight: 600 }}>{value}{unit} / {goal}{unit}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: color }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">{p}% of daily goal</span>
                    <span className="text-xs" style={{ color: lbl.color }}>{lbl.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Summary */}
          <div className="mt-4 rounded-2xl p-4 border border-gray-100 bg-white shadow-sm">
            <p className="text-sm" style={{ fontWeight: 600, color: '#1F2937', marginBottom: 6 }}>Summary</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              This meal provides <span style={{ color: 'var(--main-green)', fontWeight: 600 }}>{totals.calories} kcal</span> — {pct(totals.calories, goals.calories)}% of your daily target.
              {pct(totals.protein, goals.protein) < 30
                ? ' Consider adding a protein source to better meet your goals.'
                : pct(totals.calories, goals.calories) > 60
                ? ' This is a calorie-dense meal — keep the rest of your day light.'
                : ' This meal fits well within your daily goals.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



