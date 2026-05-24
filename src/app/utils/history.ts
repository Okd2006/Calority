import { supabase } from './supabase';

export interface HistoryEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  imageDataUrl?: string;
  savedAt: string;
}

const CACHE_KEY = 'calority_history';
function getCache(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]'); } catch { return []; }
}
function setCache(entries: HistoryEntry[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
}

async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const userId = await getUserId();
  if (!userId) return getCache(); // guest — use localStorage only

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });

  if (error || !data) return getCache();

  const entries: HistoryEntry[] = data.map(row => ({
    id: row.id,
    name: row.name,
    calories: row.calories,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
    ingredients: row.ingredients ?? [],
    imageDataUrl: row.image_data_url ?? undefined,
    savedAt: row.saved_at,
  }));

  // Always overwrite cache with server data for logged-in users
  // so stale data from a previous user never leaks through
  setCache(entries);
  return entries;
}

export async function saveMeal(entry: Omit<HistoryEntry, 'id' | 'savedAt'>): Promise<HistoryEntry> {
  const savedAt = new Date().toISOString();
  const userId = await getUserId();

  const newEntry: HistoryEntry = {
    id: `${Date.now()}`,
    ...entry,
    savedAt,
  };

  if (!userId) {
    const cache = getCache();
    cache.unshift(newEntry);
    setCache(cache);
    return newEntry;
  }

  const { data } = await supabase
    .from('meals')
    .insert({
      user_id: userId,
      name: entry.name,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      ingredients: entry.ingredients,
      image_data_url: entry.imageDataUrl ?? null,
      saved_at: savedAt,
    })
    .select()
    .single();

  return { ...newEntry, id: data?.id ?? newEntry.id };
}

export async function deleteMeal(id: string) {
  const userId = await getUserId();
  if (userId) {
    // For logged-in users, delete from Supabase by row id
    await supabase.from('meals').delete().eq('id', id).eq('user_id', userId);
  }
  // Always update local cache
  setCache(getCache().filter(e => e.id !== id));
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function groupByDate(entries: HistoryEntry[]): { date: string; entries: HistoryEntry[] }[] {
  const map = new Map<string, HistoryEntry[]>();
  for (const entry of entries) {
    const key = formatDate(entry.savedAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return Array.from(map.entries()).map(([date, entries]) => ({ date, entries }));
}
