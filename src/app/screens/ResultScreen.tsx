import { useState } from 'react';
import { ArrowLeft, AlertCircle, Plus, Pencil, Check, X, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getGoals, pct, summaryLabel } from '../utils/goals';
import { saveMeal } from '../utils/history';

function EditableNumber({
  value, onChange, color, unit
}: { value: number; onChange: (v: number) => void; color: string; unit?: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const commit = () => {
    const n = parseFloat(draft);
    if (!isNaN(n) && n >= 0) onChange(Math.round(n));
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus
          type="number"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => e.key === 'Enter' && commit()}
          className="w-20 text-2xl border-b-2 outline-none text-center"
          style={{ fontWeight: 600, color, borderColor: color }}
        />
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    );
  }

  return (
    <button onClick={() => { setDraft(String(value)); setEditing(true); }} className="flex items-center gap-1 group">
      <span className="text-2xl" style={{ fontWeight: 600, color }}>{value}</span>
      {unit && <span className="text-sm text-gray-400">{unit}</span>}
      <Pencil className="w-3 h-3 text-gray-300 group-hover:text-gray-500 ml-1" />
    </button>
  );
}

export function ResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mealData, imageDataUrl, error } = (location.state as any) ?? {};
  const goals = getGoals();

  const [name, setName] = useState(mealData?.name ?? '');
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [servings, setServings] = useState(1);
  const [base] = useState({
    calories: mealData?.calories ?? 0,
    protein: mealData?.protein ?? 0,
    carbs: mealData?.carbs ?? 0,
    fat: mealData?.fat ?? 0,
  });
  const [overrides, setOverrides] = useState<{ calories?: number; protein?: number; carbs?: number; fat?: number }>({});
  const ingredients: string[] = mealData?.ingredients ?? [];
  const confidence: string = mealData?.confidence ?? 'medium';
  const confidenceNote: string = mealData?.confidenceNote ?? '';
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveMeal({ name, calories, protein, carbs, fat, ingredients, imageDataUrl });
    setSaved(true);
    setTimeout(() => navigate('/history'), 800);
  };

  if (error || !mealData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <AlertCircle className="w-16 h-16 text-red-400" />
        <p className="text-center text-gray-600">{error ?? 'No meal data found.'}</p>
        <button onClick={() => navigate('/home')} className="px-8 py-3 rounded-full text-white" style={{ backgroundColor: 'var(--main-green)', fontWeight: 600 }}>
          Try Again
        </button>
      </div>
    );
  }

  const scaled = (key: keyof typeof base) =>
    overrides[key] !== undefined ? overrides[key]! : Math.round(base[key] * servings);

  const calories = scaled('calories');
  const protein = scaled('protein');
  const carbs = scaled('carbs');
  const fat = scaled('fat');

  const macroData = [
    { name: 'Protein', value: protein, color: '#2ECC71' },
    { name: 'Carbs', value: carbs, color: '#E67E22' },
    { name: 'Fat', value: fat, color: '#F39C12' },
  ];

  const calPct = pct(calories, goals.calories);
  const calLabel = summaryLabel(calPct);

  const macros = [
    { key: 'protein' as const, label: 'Protein', value: protein, goal: goals.protein, color: 'var(--main-green)' },
    { key: 'carbs' as const, label: 'Carbs', value: carbs, goal: goals.carbs, color: 'var(--energy-orange)' },
    { key: 'fat' as const, label: 'Fat', value: fat, goal: goals.fat, color: '#F39C12' },
  ];

  const currentMealData = { name, calories, protein, carbs, fat, ingredients };

  return (
    <div className="min-h-screen bg-white pb-8 overflow-y-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 z-10">
        <button onClick={() => navigate('/home')} className="p-2 -ml-2 active:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl" style={{ fontWeight: 600 }}>Meal Analysis</h1>
      </div>

      {/* Meal Image */}
      <div className="px-6 pt-6 pb-4">
        <div className="w-full h-56 rounded-3xl overflow-hidden shadow-lg bg-gray-100">
          {imageDataUrl
            ? <img src={imageDataUrl} alt={name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>}
        </div>
      </div>

      {/* Food Name — editable */}
      <div className="px-6 pb-4">
        {editingName ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={nameDraft}
              onChange={e => setNameDraft(e.target.value)}
              className="flex-1 text-2xl border-b-2 outline-none"
              style={{ fontWeight: 600, color: '#1F2937', borderColor: 'var(--main-green)' }}
              onKeyDown={e => { if (e.key === 'Enter') { setName(nameDraft); setEditingName(false); } }}
            />
            <button onClick={() => { setName(nameDraft); setEditingName(false); }} className="p-1 text-green-500"><Check className="w-5 h-5" /></button>
            <button onClick={() => setEditingName(false)} className="p-1 text-gray-400"><X className="w-5 h-5" /></button>
          </div>
        ) : (
          <button onClick={() => { setNameDraft(name); setEditingName(true); }} className="flex items-center gap-2 group">
            <h2 className="text-2xl" style={{ fontWeight: 600, color: '#1F2937' }}>{name}</h2>
            <Pencil className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
          </button>
        )}
      </div>

      {/* Confidence banner */}
      {confidence !== 'high' && (
        <div className="px-6 pb-4">
          <div
            className="flex items-start gap-3 p-4 rounded-2xl"
            style={{ backgroundColor: confidence === 'low' ? '#FEF2F2' : '#FFFBEB', border: `1px solid ${confidence === 'low' ? '#FECACA' : '#FDE68A'}` }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: confidence === 'low' ? '#EF4444' : '#F59E0B' }} />
            <div>
              <p className="text-sm" style={{ fontWeight: 600, color: confidence === 'low' ? '#DC2626' : '#D97706' }}>
                {confidence === 'low' ? 'Low confidence result' : 'Moderate confidence'}
              </p>
              {confidenceNote && <p className="text-xs mt-0.5" style={{ color: confidence === 'low' ? '#EF4444' : '#F59E0B' }}>{confidenceNote}</p>}
              <p className="text-xs text-gray-500 mt-1">Tap any value below to correct it manually.</p>
            </div>
          </div>
        </div>
      )}

      {/* Serving size adjuster */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-5 py-3">
          <span className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Serving size</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setServings(s => Math.max(0.25, parseFloat((s - 0.25).toFixed(2))))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg"
              style={{ backgroundColor: 'var(--energy-orange)' }}
            >−</button>
            <span className="text-lg w-10 text-center" style={{ fontWeight: 600 }}>{servings}x</span>
            <button
              onClick={() => setServings(s => parseFloat((s + 0.25).toFixed(2)))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg"
              style={{ backgroundColor: 'var(--main-green)' }}
            >+</button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1 px-1">Tap any number below to edit it manually</p>
      </div>

      {/* Calories Card */}
      <div className="px-6 pb-4">
        <div className="rounded-3xl p-6 shadow-sm" style={{ backgroundColor: 'var(--main-green)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm mb-1">Total Calories</p>
              <div className="flex items-end gap-1">
                <EditableNumber
                  value={calories}
                  onChange={v => setOverrides(o => ({ ...o, calories: v }))}
                  color="white"
                />
              </div>
              <p className="text-white/90 text-sm">kcal</p>
            </div>
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={macroData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value">
                    {macroData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Cards — all editable */}
      <div className="px-6 grid grid-cols-3 gap-3 pb-6">
        {macros.map(({ key, label, value, goal, color }) => (
          <div key={label} className="rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <EditableNumber
              value={value}
              onChange={v => setOverrides(o => ({ ...o, [key]: v }))}
              color={color}
              unit="g"
            />
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div className="h-full rounded-full" style={{ width: `${pct(value, goal)}%`, backgroundColor: color }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">of {goal}g</p>
          </div>
        ))}
      </div>

      {/* Goals Summary */}
      <div className="px-6 pb-6">
        <h3 className="text-lg mb-3" style={{ fontWeight: 600, color: '#1F2937' }}>How this fits your day</h3>
        <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Calories</span>
              <span className="text-sm" style={{ color: calLabel.color, fontWeight: 600 }}>{calPct}% of daily goal</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${calPct}%`, backgroundColor: calLabel.color }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{calories} of {goals.calories} kcal — {calLabel.text}</p>
          </div>
          {macros.map(({ label, value, goal, color }) => {
            const p = pct(value, goal);
            const lbl = summaryLabel(p);
            return (
              <div key={label} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm" style={{ color, fontWeight: 600 }}>{p}% of daily goal</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p}%`, backgroundColor: color }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{value}g of {goal}g — {lbl.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <div className="px-6 pb-6">
          <h3 className="text-lg mb-3" style={{ fontWeight: 600, color: '#1F2937' }}>Detected Ingredients</h3>
          <div className="space-y-2">
            {ingredients.map((ing: string, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--main-green)' }} />
                <span className="text-sm text-gray-700">{ing}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 flex flex-col gap-3">
        <button
          onClick={handleSave}
          disabled={saved}
          className="w-full py-4 rounded-full shadow-md transition-all active:scale-95 text-white flex items-center justify-center gap-2"
          style={{ backgroundColor: saved ? '#27AE60' : 'var(--main-green)', fontWeight: 600 }}
        >
          {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved!</> : 'Save Meal'}
        </button>
        <button
          onClick={() => navigate('/add-meal', { state: { items: [{ ...currentMealData, imageDataUrl }] } })}
          className="w-full py-4 rounded-full border-2 transition-transform active:scale-95 flex items-center justify-center gap-2"
          style={{ borderColor: 'var(--main-green)', color: 'var(--main-green)', fontWeight: 600 }}
        >
          <Plus className="w-5 h-5" />
          Add More Foods
        </button>
      </div>
    </div>
  );
}


