import { useState, useEffect } from 'react';
import { Target, TrendingUp, LogOut, User, Salad, Bell, Shield, ChevronRight, X, Check, Activity, Ruler, Weight } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { getGoals, saveGoals } from '../utils/goals';
import { useAuth } from '../utils/auth';

interface EditProfileData {
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: string;
}

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(150);
  const [carbsGoal, setCarbsGoal] = useState(250);
  const [fatGoal, setFatGoal] = useState(65);
  const [weightGoal, setWeightGoal] = useState(70);

  // Edit Profile sheet
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profile, setProfile] = useState<EditProfileData>({ name: '', age: '', height: '', weight: '', gender: 'male' });

  // Manage Diet sheet
  const [showDiet, setShowDiet] = useState(false);
  const [dietType, setDietType] = useState('balanced');
  const [mealFreq, setMealFreq] = useState(3);
  const [waterGoal, setWaterGoal] = useState(2.5);

  // Notifications sheet
  const [showNotif, setShowNotif] = useState(false);
  const [mealReminders, setMealReminders] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  // Goals saved toast
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getGoals().then(g => {
      setCalorieGoal(g.calories);
      setProteinGoal(g.protein);
      setCarbsGoal(g.carbs);
      setFatGoal(g.fat);
    });
    const stored = localStorage.getItem('calority_profile');
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const handleSaveGoals = async () => {
    await saveGoals({ calories: calorieGoal, protein: proteinGoal, carbs: carbsGoal, fat: fatGoal });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveProfile = () => {
    localStorage.setItem('calority_profile', JSON.stringify(profile));
    setShowEditProfile(false);
  };

  const displayName = profile.name || user?.email?.split('@')[0] || 'User';

  const dietOptions = [
    { id: 'balanced', label: 'Balanced', emoji: '⚖️' },
    { id: 'keto', label: 'Keto', emoji: '🥑' },
    { id: 'vegan', label: 'Vegan', emoji: '🌱' },
    { id: 'paleo', label: 'Paleo', emoji: '🥩' },
    { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
    { id: 'highprotein', label: 'High Protein', emoji: '💪' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto pb-safe" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Header */}
      <div className="bg-white pt-safe px-6 pb-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl tracking-tight" style={{ fontWeight: 600, color: '#1F2937' }}>Profile</h1>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 text-sm text-gray-500 active:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Avatar + name card */}
      <div className="px-6 pt-6 pb-2">
        <div className="bg-white rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2ECC71, #27AE60)' }}>
            {displayName[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg truncate" style={{ fontWeight: 600, color: '#1F2937' }}>{displayName}</p>
            <p className="text-sm text-gray-400 truncate">{user?.email}</p>
            {profile.height && profile.weight && (
              <p className="text-xs text-gray-400 mt-0.5">{profile.height}cm · {profile.weight}kg · {profile.age ? `${profile.age}y` : ''}</p>
            )}
          </div>
          <button
            onClick={() => setShowEditProfile(true)}
            className="px-3 py-1.5 rounded-full text-xs border border-gray-200 text-gray-500"
            style={{ fontWeight: 600 }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Calorie goal card */}
      <div className="px-6 pt-4 pb-2">
        <div className="rounded-3xl p-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-white/80" />
            <p className="text-white/80 text-sm">Daily Calorie Goal</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl text-white" style={{ fontWeight: 700 }}>{calorieGoal}</span>
            <span className="text-lg text-white/80">kcal</span>
          </div>
          <div className="flex gap-4 mt-3">
            <span className="text-white/80 text-xs">P: {proteinGoal}g</span>
            <span className="text-white/80 text-xs">C: {carbsGoal}g</span>
            <span className="text-white/80 text-xs">F: {fatGoal}g</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-6 pt-4 pb-2">
        <p className="text-xs text-gray-400 mb-3 px-1" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>MANAGE</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[
            { icon: User, label: 'Edit Profile', sub: 'Name, age, height, weight', color: '#3498DB', action: () => setShowEditProfile(true) },
            { icon: Salad, label: 'Manage Diet', sub: `${dietOptions.find(d => d.id === dietType)?.label ?? 'Balanced'} · ${mealFreq} meals/day`, color: '#2ECC71', action: () => setShowDiet(true) },
            { icon: Activity, label: 'Nutrition Goals', sub: `${calorieGoal} kcal target`, color: '#E67E22', action: () => document.getElementById('goals-section')?.scrollIntoView({ behavior: 'smooth' }) },
            { icon: Bell, label: 'Notifications', sub: mealReminders ? 'Reminders on' : 'Reminders off', color: '#9B59B6', action: () => setShowNotif(true) },
            { icon: Shield, label: 'Privacy & Data', sub: 'Manage your data', color: '#7F8C8D', action: () => alert('Coming soon') },
          ].map(({ icon: Icon, label, sub, color, action }, i, arr) => (
            <button
              key={label}
              onClick={action}
              className={`w-full flex items-center gap-4 px-5 py-4 active:bg-gray-50 text-left ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ fontWeight: 600, color: '#1F2937' }}>{label}</p>
                <p className="text-xs text-gray-400 truncate">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Goals sliders */}
      <div id="goals-section" className="px-6 pt-4 pb-4">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Target className="w-4 h-4" style={{ color: 'var(--energy-orange)' }} />
          <p className="text-xs text-gray-400" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>NUTRITION GOALS</p>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Daily Calories', value: calorieGoal, set: setCalorieGoal, min: 1200, max: 3500, step: 50, unit: 'kcal', color: 'var(--main-green)' },
            { label: 'Protein', value: proteinGoal, set: setProteinGoal, min: 50, max: 300, step: 5, unit: 'g', color: '#2ECC71' },
            { label: 'Carbs', value: carbsGoal, set: setCarbsGoal, min: 50, max: 500, step: 5, unit: 'g', color: 'var(--energy-orange)' },
            { label: 'Fat', value: fatGoal, set: setFatGoal, min: 20, max: 150, step: 5, unit: 'g', color: '#F39C12' },
            { label: 'Target Weight', value: weightGoal, set: setWeightGoal, min: 40, max: 120, step: 1, unit: 'kg', color: '#3498DB' },
          ].map(({ label, value, set, min, max, step, unit, color }) => {
            const p = ((value - min) / (max - min)) * 100;
            return (
              <div key={label} className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-600">{label}</label>
                  <span className="text-sm px-3 py-0.5 rounded-full text-white" style={{ backgroundColor: color, fontWeight: 600 }}>{value} {unit}</span>
                </div>
                <input
                  type="range" min={min} max={max} step={step} value={value}
                  onChange={e => set(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${p}%, #E5E7EB ${p}%, #E5E7EB 100%)` }}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSaveGoals}
          className="w-full mt-4 py-4 rounded-full text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{ backgroundColor: saved ? '#27AE60' : 'var(--main-green)', fontWeight: 600 }}
        >
          {saved ? <><Check className="w-5 h-5" /> Saved!</> : 'Save Goals'}
        </button>
      </div>

      <BottomNav />

      {/* Edit Profile Sheet */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-[390px] mx-auto bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Display Name', key: 'name', placeholder: 'Your name', icon: User },
                { label: 'Age', key: 'age', placeholder: 'e.g. 25', icon: Activity, type: 'number' },
                { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 175', icon: Ruler, type: 'number' },
                { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 70', icon: Weight, type: 'number' },
              ].map(({ label, key, placeholder, icon: Icon, type = 'text' }) => (
                <div key={key}>
                  <label className="text-sm text-gray-500 mb-1 block">{label}</label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3">
                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={profile[key as keyof EditProfileData]}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                      className="flex-1 outline-none text-sm bg-transparent"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Gender</label>
                <div className="flex gap-2">
                  {['male', 'female', 'other'].map(g => (
                    <button
                      key={g}
                      onClick={() => setProfile(p => ({ ...p, gender: g }))}
                      className="flex-1 py-2.5 rounded-2xl text-sm border-2 capitalize transition-all"
                      style={{
                        borderColor: profile.gender === g ? 'var(--main-green)' : '#E5E7EB',
                        color: profile.gender === g ? 'var(--main-green)' : '#6B7280',
                        fontWeight: profile.gender === g ? 600 : 400,
                        backgroundColor: profile.gender === g ? '#F0FDF4' : 'white',
                      }}
                    >{g}</button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              className="w-full mt-6 py-4 rounded-full text-white"
              style={{ backgroundColor: 'var(--main-green)', fontWeight: 600 }}
            >Save Profile</button>
          </div>
        </div>
      )}

      {/* Manage Diet Sheet */}
      {showDiet && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-[390px] mx-auto bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Manage Diet</h2>
              <button onClick={() => setShowDiet(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <p className="text-sm text-gray-500 mb-3">Diet type</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {dietOptions.map(({ id, label, emoji }) => (
                <button
                  key={id}
                  onClick={() => setDietType(id)}
                  className="flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: dietType === id ? 'var(--main-green)' : '#E5E7EB',
                    backgroundColor: dietType === id ? '#F0FDF4' : 'white',
                  }}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="text-xs" style={{ color: dietType === id ? 'var(--main-green)' : '#6B7280', fontWeight: dietType === id ? 600 : 400 }}>{label}</span>
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-3">Meals per day</p>
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setMealFreq(f => Math.max(1, f - 1))} className="w-10 h-10 rounded-full border-2 border-gray-200 text-lg text-gray-600">−</button>
              <span className="text-2xl flex-1 text-center" style={{ fontWeight: 600 }}>{mealFreq}</span>
              <button onClick={() => setMealFreq(f => Math.min(6, f + 1))} className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg" style={{ backgroundColor: 'var(--main-green)' }}>+</button>
            </div>

            <p className="text-sm text-gray-500 mb-2">Daily water goal (L)</p>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3 mb-6">
              <span className="text-xl">💧</span>
              <input
                type="number" step="0.1" min="0.5" max="5"
                value={waterGoal}
                onChange={e => setWaterGoal(Number(e.target.value))}
                className="flex-1 outline-none text-sm"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <span className="text-sm text-gray-400">litres</span>
            </div>

            <button
              onClick={() => setShowDiet(false)}
              className="w-full py-4 rounded-full text-white"
              style={{ backgroundColor: 'var(--main-green)', fontWeight: 600 }}
            >Save Diet Preferences</button>
          </div>
        </div>
      )}

      {/* Notifications Sheet */}
      {showNotif && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-[390px] mx-auto bg-white rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Notifications</h2>
              <button onClick={() => setShowNotif(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Meal Reminders', sub: 'Get reminded to log your meals', value: mealReminders, set: setMealReminders },
                { label: 'Goal Alerts', sub: 'Alert when nearing daily limits', value: goalAlerts, set: setGoalAlerts },
                { label: 'Weekly Report', sub: 'Summary of your weekly progress', value: weeklyReport, set: setWeeklyReport },
              ].map(({ label, sub, value, set }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm" style={{ fontWeight: 600, color: '#1F2937' }}>{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                  <button
                    onClick={() => set(v => !v)}
                    className="w-12 h-6 rounded-full transition-colors relative"
                    style={{ backgroundColor: value ? 'var(--main-green)' : '#E5E7EB' }}
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all" style={{ left: value ? '26px' : '2px' }} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowNotif(false)}
              className="w-full mt-5 py-4 rounded-full text-white"
              style={{ backgroundColor: 'var(--main-green)', fontWeight: 600 }}
            >Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
