import { supabase } from './supabase';

export interface Goals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const DEFAULTS: Goals = { calories: 2000, protein: 150, carbs: 250, fat: 65 };
const CACHE_KEY = 'calority_goals';

function getCache(): Goals {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
  } catch { return DEFAULTS; }
}
function setCache(goals: Goals) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(goals));
}

// Use a fixed row id so there's always one goals row per "user" (anonymous)
const GOALS_ROW_ID = 'default';

export async function getGoals(): Promise<Goals> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('id', GOALS_ROW_ID)
    .single();

  if (error || !data) return getCache();

  const goals: Goals = {
    calories: data.calories ?? DEFAULTS.calories,
    protein: data.protein ?? DEFAULTS.protein,
    carbs: data.carbs ?? DEFAULTS.carbs,
    fat: data.fat ?? DEFAULTS.fat,
  };
  setCache(goals);
  return goals;
}

export async function saveGoals(goals: Partial<Goals>) {
  const current = getCache();
  const merged = { ...current, ...goals };
  setCache(merged);

  await supabase.from('goals').upsert({
    id: GOALS_ROW_ID,
    calories: merged.calories,
    protein: merged.protein,
    carbs: merged.carbs,
    fat: merged.fat,
  });
}

// ── Sync helpers (unchanged) ─────────────────────────────────────────────────

export function pct(value: number, goal: number) {
  return Math.min(Math.round((value / goal) * 100), 100);
}

export function summaryLabel(p: number): { text: string; color: string } {
  if (p >= 100) return { text: 'Goal reached!', color: '#E67E22' };
  if (p >= 75) return { text: 'Almost there', color: '#F39C12' };
  if (p >= 40) return { text: 'Good progress', color: '#2ECC71' };
  return { text: 'Keep going', color: '#3498DB' };
}
