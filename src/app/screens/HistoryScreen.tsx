import { useState } from 'react';
import { Trash2, UtensilsCrossed } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { getHistory, deleteMeal, groupByDate, formatTime, type HistoryEntry } from '../utils/history';
import { getGoals, pct } from '../utils/goals';

export function HistoryScreen() {
  const [entries, setEntries] = useState<HistoryEntry[]>(getHistory);
  const goals = getGoals();
  const groups = groupByDate(entries);

  const handleDelete = (id: string) => {
    deleteMeal(id);
    setEntries(getHistory());
  };

  // Daily totals for a group
  const dayTotals = (dayEntries: HistoryEntry[]) =>
    dayEntries.reduce(
      (acc, e) => ({ calories: acc.calories + e.calories, protein: acc.protein + e.protein, carbs: acc.carbs + e.carbs, fat: acc.fat + e.fat }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-safe" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
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
                {/* Date header with daily summary */}
                <div className="px-2 mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base" style={{ fontWeight: 600, color: '#1F2937' }}>{date}</span>
                    <span className="text-sm" style={{ color: barColor, fontWeight: 600 }}>{totals.calories} kcal</span>
                  </div>
                  {/* Daily calorie progress bar */}
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(calPct, 100)}%`, backgroundColor: barColor }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {calPct}% of {goals.calories} kcal goal · P:{totals.protein}g · C:{totals.carbs}g · F:{totals.fat}g
                  </p>
                </div>

                {/* Meal cards */}
                <div className="space-y-2">
                  {dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3"
                    >
                      {/* Image or placeholder */}
                      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        {entry.imageDataUrl
                          ? <img src={entry.imageDataUrl} alt={entry.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ fontWeight: 600, color: '#1F2937' }}>{entry.name}</p>
                        <p className="text-xs text-gray-400">{formatTime(entry.savedAt)}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          P:{entry.protein}g · C:{entry.carbs}g · F:{entry.fat}g
                        </p>
                      </div>

                      {/* Calories + delete */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-base" style={{ fontWeight: 600, color: 'var(--main-green)' }}>{entry.calories}</p>
                          <p className="text-xs text-gray-400">kcal</p>
                        </div>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1 text-gray-200 active:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
