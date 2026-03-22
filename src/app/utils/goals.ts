export interface Goals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const DEFAULTS: Goals = { calories: 2000, protein: 150, carbs: 250, fat: 65 };
const KEY = 'calority_goals';

export function getGoals(): Goals {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function saveGoals(goals: Partial<Goals>) {
  localStorage.setItem(KEY, JSON.stringify({ ...getGoals(), ...goals }));
}

export function pct(value: number, goal: number) {
  return Math.min(Math.round((value / goal) * 100), 100);
}

export function summaryLabel(p: number): { text: string; color: string } {
  if (p >= 100) return { text: 'Goal reached!', color: '#E67E22' };
  if (p >= 75) return { text: 'Almost there', color: '#F39C12' };
  if (p >= 40) return { text: 'Good progress', color: '#2ECC71' };
  return { text: 'Keep going', color: '#3498DB' };
}
