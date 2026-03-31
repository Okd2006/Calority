import { useState, useEffect } from 'react';
import { Trash2, UtensilsCrossed, X, Flame, Beef, Wheat, Droplets } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { getHistory, deleteMeal, groupByDate, formatTime, formatDate, type HistoryEntry } from '../utils/history';
import { getGoals, pct } from '../utils/goals';
import type { Goals } from '../utils/goals';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function getCachedHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem('calority_history') ?? '[]'); } catch { return []; }
}
function getCachedGoals(): Goals {
  try {
    const s = localStorage.getItem('calority_goals');
    return s ? { calories: 2000, protein: 150, carbs: 250, fat: 65, ...JSON.parse(s) } : { calories: 2000, protein: 150, carbs: 250, fat: 65 };
  } catch { return { calories: 2000, protein: 150, carbs: 250, fat: 65 }; }
}

function MealDetailSheet({ entry, goals, onClose, onDelete }: {
  entry: HistoryEntry;
  goals: Goals;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const macros = [
    { label: 'Protein', value: entry.protein, goal: goals.protein, color: '#2ECC71', icon: Beef },
    { label: 'Carbs', value: entry.carbs, goal: goals.carbs, color: '#E67E22', icon: Wheat },
    { label: 'Fat', value: entry.fat, goal: goals.fat, color: '#F39C12', icon: Droplets },
  ];

  const pieData = macros.map(m => ({ name: m.label, value: m.value, color: m.color }));

  // Estimated extra nutrients from macros
  const fiber = Math.round(entry.carbs * 0.1);
  const sugar = Math.round(entry.carbs * 0.3);
  const saturatedFat = Math.round(entry.fat * 0.35);
  const sodium = Math.round(entry.calories * 0.8);

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="w-full max-w-[390px] mx-auto bg-white rounded-t-3xl overflow-y-auto"
        style={{ maxHeight: '90vh', fontFamily: 'Poppins, sans-serif' }}
      >
        {/* Meal image */}
        <div className="relative">
          <div className="w-full h-52 bg-gray-100">
            {entry.imageDataUrl
              ? <img src={entry.imageDataUrl} alt={entry.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>}
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="px-6 pt-5 pb-8">
          {/* Name + time */}
          <h2 className="text-xl" style={{ fontWeight: 700, color: '#1F2937' }}>{entry.name}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(entry.savedAt)} · {formatTime(entry.savedAt)}</p>

          {/* Calories hero */}
          <div className="mt-4 rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: '#F0FDF4' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2ECC71' }}>
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Calories</p>
                <p className="text-2xl" style={{ fontWeight: 700, color: '#1F2937' }}>{entry.calories} <span className="text-sm text-gray-400">kcal</span></p>
              </div>
            </div>
            <div className="w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={20} outerRadius={36} dataKey="value">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Macro cards */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {macros.map(({ label, value, goal, color, icon: Icon }) => {
              const p = pct(value, goal);
              return (
                <div key={label} className="rounded-2xl p-3 border border-gray-100 shadow-sm">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${color}18` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-lg" style={{ fontWeight: 700, color }}>{value}g</p>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p}%`, backgroundColor: color }} />
                  </div>
                  <p className="text-xs text-gray-300 mt-1">{p}% of goal</p>
                </div>
              );
            })}
          </div>

          {/* Extra nutrients */}
          <div className="mt-4 bg-gray-50 rounded-2xl p-4">
            <p className="text-sm mb-3" style={{ fontWeight: 600, color: '#1F2937' }}>Estimated Nutrients</p>
            <div className="space-y-2">
              {[
                { label: 'Fiber', value: `${fiber}g`, color: '#27AE60' },
                { label: 'Sugar', value: `${sugar}g`, color: '#E67E22' },
                { label: 'Saturated Fat', value: `${saturatedFat}g`, color: '#F39C12' },
                { label: 'Sodium', value: `${sodium}mg`, color: '#3498DB' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm" style={{ fontWeight: 600, color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          {entry.ingredients?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm mb-3" style={{ fontWeight: 600, color: '#1F2937' }}>Detected Ingredients</p>
              <div className="space-y-2">
                {entry.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#2ECC71' }} />
                    <span className="text-sm text-gray-600">{ing}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete */}
          <button
            onClick={() => { onDelete(entry.id); onClose(); }}
            className="w-full mt-6 py-3.5 rounded-full border-2 border-red-100 text-red-400 flex items-center justify-center gap-2 active:bg-red-50"
            style={{ fontWeight: 600 }}
          >
            <Trash2 className="w-4 h-4" />
            Delete Meal
          </button>
        </div>
      </div>
    </div>
  );
}

export function HistoryScreen() {
  const [entries, setEntries] = useState<HistoryEntry[]>(getCachedHistory);
  const [goals, setGoals] = useState<Goals>(getCachedGoals);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    getHistory().then(setEntries);
    getGoals().then(setGoals);
  }, []);

  const groups = groupByDate(entries);

  const handleDelete = async (id: string) => {
    await deleteMeal(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const dayTotals = (dayEntries: HistoryEntry[]) =>
    dayEntries.reduce(
      (acc, e) => ({ calories: acc.calories + e.calories, protein: acc.protein + e.protein, carbs: acc.carbs + e.carbs, fat: acc.fat + e.fat }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-safe" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="bg-white pt-safe px-6 pb-4 border-b border-gray-100">
        <h1 className="text-3xl tracking-tight" style={{ fontWeight: 600, color: '#1F2937' }}>History</h1>
        <p className="text-sm text-gray-500 mt-1">{entries.length} meals logged</p>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 mt-24 gap-4 text-center">
          <UtensilsCrossed className="w-16 h-16 text-gray-200" />
          <p className="text-lg text-gray-400" style={{ fontWeight: 600 }}>No meals saved yet</p>
          <p className="text-sm text-gray-400">Scan a meal and tap "Save Meal" to see it here</p>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-6">
          {groups.map(({ date, entries: dayEntries }) => {
            const totals = dayTotals(dayEntries);
            const calPct = pct(totals.calories, goals.calories);
            const barColor = calPct > 100 ? '#E67E22' : '#2ECC71';

            return (
              <div key={date}>
                <div className="px-2 mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base" style={{ fontWeight: 600, color: '#1F2937' }}>{date}</span>
                    <span className="text-sm" style={{ color: barColor, fontWeight: 600 }}>{totals.calories} kcal</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(calPct, 100)}%`, backgroundColor: barColor }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {calPct}% of {goals.calories} kcal goal · P:{totals.protein}g · C:{totals.carbs}g · F:{totals.fat}g
                  </p>
                </div>

                <div className="space-y-2">
                  {dayEntries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelected(entry)}
                      className="w-full bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3 active:bg-gray-50 text-left"
                    >
                      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        {entry.imageDataUrl
                          ? <img src={entry.imageDataUrl} alt={entry.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ fontWeight: 600, color: '#1F2937' }}>{entry.name}</p>
                        <p className="text-xs text-gray-400">{formatTime(entry.savedAt)}</p>
                        <p className="text-xs text-gray-500 mt-0.5">P:{entry.protein}g · C:{entry.carbs}g · F:{entry.fat}g</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-base" style={{ fontWeight: 600, color: 'var(--main-green)' }}>{entry.calories}</p>
                          <p className="text-xs text-gray-400">kcal</p>
                        </div>
                        <div
                          onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}
                          className="p-1 text-gray-200 active:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />

      {selected && (
        <MealDetailSheet
          entry={selected}
          goals={goals}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
